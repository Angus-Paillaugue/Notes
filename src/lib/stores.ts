import { writable } from 'svelte/store';

export const isSwiping = writable({ isSwiping: false, id: -1 });
