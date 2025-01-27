import { writable } from 'svelte/store';

export const isSwiping = writable({ isSwiping: false, id: -1 });

export const navNoteStates = writable({
	isSaving: false,
	editModalOpen: false
});
