import type { User, UserWithoutNotes } from '$lib/types';
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import {getDbConnection} from '.';
import { getUsersNote } from './note';

export async function createUser(username: User['username'], password: User['password']) {
  const db = await getDbConnection();
	await db.execute<ResultSetHeader>('INSERT INTO user (username, password) VALUES (?, ?)', [
		username,
		password
	]);
}

export async function getUser(id: User['id']) {
  const db = await getDbConnection();
	const [rows] = await db.execute<RowDataPacket[]>('SELECT * FROM user WHERE id = ? LIMIT 1', [id]);
	if (rows.length === 0) return null;
	const user = rows[0] as UserWithoutNotes;
	return user;
}

// this method is quite janky and should be refactored
export async function getUserById(id: User['id']) {
	const user = (await getUser(id)) as User;
	if (!user) return null;

	const notes = await getUsersNote(user.id);
	user.notes = notes;
	return user;
}

export async function getUserByUsername(username: User['username']) {
  const db = await getDbConnection();
	const [rows] = await db.execute<RowDataPacket[]>(
		'SELECT * FROM user WHERE username = ? LIMIT 1',
		[username]
	);
	if (rows.length === 0) return null;

	const user = rows[0] as User;
	const notes = await getUsersNote(user.id);
	user.notes = notes;
	return user;
}
