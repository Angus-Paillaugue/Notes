import type { Note, User } from '$lib/types';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteNote, getNote } from '$lib/server/db/note';

export const DELETE: RequestHandler = async ({ request, locals: { user } }) => {
	const { noteId }: { noteId: Note['id'] } = await request.json();
	const userId = user?.id as User['id'];

  const note = await getNote(noteId);
  if(note?.user.id !== userId) {
    throw error(403, 'I know what you are trying to do and it\'s bad. Stop!')
  }

  await deleteNote(noteId);

	return json({});
};
