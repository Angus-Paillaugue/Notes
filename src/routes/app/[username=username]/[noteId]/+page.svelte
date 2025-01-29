<script lang="ts">
	import type { PageData } from './$types';
	import { Text as TextNoteComponent } from '$lib/components/core/note';
	import { List as ListNoteComponent } from '$lib/components/core/note';
	import type { TextNote, ListNote } from '$lib/types';
	import { Input, Modal } from '$lib/components';
	import { Pin, PinOff, Share, Trash2 } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { navNoteStates } from '$lib/stores';

	let { data }: { data: PageData } = $props();
	const { user } = data;
	let note = $state(data.note);
	let isSaving = $state(false);
	let isMounted = $state(false);
	let saveAbortController = $state(new AbortController());
	let isDeletingNote = $state<boolean>(false);
	let shareModalOpen = $state(false);

	$effect(() => {
		$navNoteStates.isSaving = isSaving;
	});

	async function save() {
		if (isSaving || !isMounted) return;
		isSaving = true;

		// Abort any ongoing save request
		saveAbortController.abort();
		saveAbortController = new AbortController();

		const url = `/api/note/${note.type}/save`;
		const res = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				note
			}),
			signal: saveAbortController.signal
		});
		if (!res.ok) {
			console.error('Failed to save note');
			return;
		}

		const { note: noteFromServer } = await res.json();
		if (note.type === 'list') {
			// Set id's to the list items because we set them to `-1` on the client.
			(note as ListNote).items.map((item, i) => {
				item.id = noteFromServer.items[i].id;
			});
		}
		isSaving = false;
	}

	onMount(() => {
		isMounted = true;
	});

	async function deleteNote() {
		if (isDeletingNote) return;
		isDeletingNote = true;

		const res = await fetch('/api/note/delete', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ noteId: note.id })
		});
		const data = await res.json();
		if (!res.ok) {
			console.error(data.message);
			return;
		}
		goto('/app/' + user.username);
	}

	function pinNote() {
		note.pinned = !note.pinned;
		save();
	}
</script>

<svelte:head>
	<title>{note.title}</title>
</svelte:head>

<Modal bind:open={shareModalOpen} onclose={() => ($navNoteStates.editModalOpen = false)}>
	<Modal.Heading>Share note</Modal.Heading>
</Modal>

<Modal bind:open={$navNoteStates.editModalOpen}>
	<Modal.Heading>Edit note</Modal.Heading>
	<div class="flex w-full flex-col gap-2">
		<button
			class="hover:bg-card-foreground flex w-full flex-row items-center justify-start gap-2 rounded px-3 py-1 text-start transition-colors"
			onclick={() => {
				shareModalOpen = true;
				$navNoteStates.editModalOpen = false;
			}}
		>
			<Share class="size-4" />
			Share
		</button>
		<button
			class="hover:bg-card-foreground flex w-full flex-row items-center justify-start gap-2 rounded px-3 py-1 text-start transition-colors"
			onclick={pinNote}
		>
			{#if note.pinned}
				<PinOff class="size-4" />
			{:else}
				<Pin class="size-4" />
			{/if}
			{note.pinned ? 'Unpin' : ' Pin'}
		</button>

		<button
			class="bg-danger/20 hover:bg-danger flex w-full flex-row items-center justify-start gap-2 rounded px-3 py-1 text-start transition-colors"
			onclick={deleteNote}
		>
			<Trash2 class="size-4" />
			Delete Note
		</button>
	</div>
</Modal>

<div class="mx-auto flex w-full max-w-screen-md grow flex-col gap-1">
	<!-- Note title input -->
	<Input
		bind:value={note.title}
		id="noteTitle"
		debounce={500}
		onValueChange={save}
		placeholder="Title"
		class="bg-transparant h-12 text-3xl font-medium"
	/>

	<!-- Main note components -->
	<div class="flex grow flex-col overflow-y-auto">
		{#if note.type === 'text'}
			<TextNoteComponent bind:note={note as TextNote} {save} />
		{:else if note.type === 'list'}
			<ListNoteComponent bind:note={note as ListNote} {save} />
		{/if}
	</div>
</div>
