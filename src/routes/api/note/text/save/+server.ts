import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { TextNote } from '$lib/types';
import { saveNote } from '$lib/server/db/note';

export const PUT: RequestHandler = async ({ request }) => {
	let { note }: { note: TextNote } = await request.json();

	note = (await saveNote(note)) as TextNote;

	return json({ success: true, note });
};
