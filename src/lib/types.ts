export interface UserWithoutNotes {
	id: number;
	username: string;
	password: string;
	createdAt: Date;
}

export interface User extends UserWithoutNotes {
	notes: Note[];
}

type NoteType = 'text' | 'list';

export interface CoreNote {
	id: number;
	title: string;
	type: NoteType;
	createdAt: Date;
	updatedAt: Date;
	user: User;
	pinned: boolean;
}

export interface TextNote extends CoreNote {
	type: 'text';
	content: string;
}

export interface ListNoteItem {
	id: number;
	item: string;
	checked: boolean;
	position: number;
}

export interface ListNote extends CoreNote {
	type: 'list';
	items: ListNoteItem[];
}

export type Note = TextNote | ListNote;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
