import { getNote } from '$lib/server/db/note';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params: { noteId }, locals }) => {
	const note = await getNote(Number(noteId));

	if (!note) {
		throw error(404, 'Note not found');
	}

  if(!note.public && (!locals.user || note.user.id !== locals.user.id)) {
    throw error(403, 'Unauthorized');
  }

	return { note, isOwner: (!!locals?.user && note.user.id === locals.user.id) };
}) satisfies PageServerLoad;
