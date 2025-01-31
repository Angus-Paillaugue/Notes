import type { User, Note, CoreNote, ListNoteItem, ListNote, TextNote } from '$lib/types';
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import {getDbConnection} from '.';
import { getUser } from './user';

export async function getUsersNote(id: User['id']): Promise<Note[]> {
  const db = await getDbConnection();
	const query = 'SELECT id FROM note WHERE user_id = ? ORDER BY id DESC';
	const [rows] = await db.execute<RowDataPacket[]>(query, [id]);
	const noteIds = rows.map((row) => row.id);
	const notes = await Promise.all(noteIds.map(getNote));

	return notes.filter(Boolean) as Note[];
}

export async function getNote(noteId: Note['id']): Promise<Note | null> {
  const db = await getDbConnection();
	const query = 'SELECT * FROM note WHERE id = ?';

	const [rows] = await db.execute<RowDataPacket[]>(query, [noteId]);
	if (rows.length === 0) {
		return null;
	}
	const coreNote = rows[0] as CoreNote & { user_id: number };
	coreNote.user = (await getUser(coreNote.user_id)) as User;
	if (coreNote.type === 'text') {
		const [textRows] = await db.execute<RowDataPacket[]>(
			'SELECT * FROM text_note_content WHERE note_id = ?',
			[noteId]
		);
		const textNote = textRows[0] as { content: string };
		return {
			...coreNote,
			content: textNote.content
		} as TextNote;
	} else {
		const [listRows] = await db.execute<RowDataPacket[]>(
			'SELECT * FROM list_note_content WHERE note_id = ? ORDER BY position ASC',
			[noteId]
		);
		const items = listRows.map((row) => ({
			id: row.id,
			item: row.item,
			checked: row.checked === 1,
			position: row.position
		}));
		return {
			...coreNote,
			items
		} as ListNote;
	}
}

export async function createNote(
	user: User,
	title: string,
	type: CoreNote['type']
): Promise<Note['id']> {
	let query = 'INSERT INTO note (user_id, title, type) VALUES (?, ?, ?)';
  const db = await getDbConnection();
	const [result] = await db.execute<ResultSetHeader>(query, [user.id, title, type]);
	if (type === 'text') {
		query = "INSERT INTO text_note_content (note_id, content) VALUES (?, '')";
	} else {
		query = "INSERT INTO list_note_content (note_id, item, position) VALUES (?, '', 0)";
	}
	await db.execute<ResultSetHeader>(query, [result.insertId]);
	return result.insertId;
}

export async function addItemToListNote(
	noteId: Note['id'],
	item: ListNoteItem['item'],
	position: ListNoteItem['position']
): Promise<ListNoteItem['id']> {
	const query = 'INSERT INTO list_note_content (note_id, item, position) VALUES (?, ?, ?)';
  const db = await getDbConnection();
	const [result] = await db.execute<ResultSetHeader>(query, [noteId, item, position]);
	return result.insertId;
}

async function saveListNote(note: ListNote): Promise<void> {
	let query = 'UPDATE list_note_content SET item = ?, checked = ?, position = ? WHERE id = ?';
  const db = await getDbConnection();
	await Promise.all(
		note.items.map((item) => db.execute(query, [item.item, item.checked, item.position, item.id]))
	);

	query = 'UPDATE note SET title = ? WHERE id = ?';
	await db.execute(query, [note.title, note.id]);

	// Handle items to delete
	const itemIds = note.items.map((item) => item.id);
	if (itemIds.length > 0) {
		query = `DELETE FROM list_note_content WHERE note_id = ? AND id NOT IN (${itemIds.map(() => '?').join(', ')})`; // Note that this solution is janky and not secure
		await db.execute(query, [note.id, ...itemIds]);
	} else {
		query = `DELETE FROM list_note_content WHERE note_id = ?`;
		await db.execute(query, [note.id]);
	}

	// Handle new items
	const newItems = note.items.filter((item) => item.id === -1);
	await Promise.all(newItems.map((item) => addItemToListNote(note.id, item.item, item.position)));
}

async function saveTextNote(note: TextNote): Promise<void> {
  const db = await getDbConnection();
	await db.execute('UPDATE text_note_content SET content = ? WHERE note_id = ?', [
		note.content,
		note.id
	]);
}

export async function saveNote(note: Note): Promise<Note> {
	if (note.type === 'list') {
		await saveListNote(note as ListNote);
	} else if (note.type === 'text') {
		await saveTextNote(note as TextNote);
	}
  const db = await getDbConnection();

	await db.execute('UPDATE note SET updatedAt = NOW(), pinned = ? WHERE id = ?', [
		note.pinned ? 1 : 0,
		note.id
	]);

	note = (await getNote(note.id)) as Note;

	return note;
}

export async function deleteNote(id: Note['id']) {
  const db = await getDbConnection();
	// No need to delete all of the list items or text content because of the ON DELETE CASCADES constraint in the schema
	await db.execute('DELETE from note WHERE id = ?', [id]);
}
