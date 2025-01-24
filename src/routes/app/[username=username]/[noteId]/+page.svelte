<script lang="ts">
	import type { PageData } from './$types';
	import { Text as TextNoteComponent} from '$lib/components/core/note';
	import { List as ListNoteComponent} from '$lib/components/core/note';
	import type { TextNote, ListNote } from '$lib/types';
	import { Input, Card } from '$lib/components';
	import { ChevronLeft, Cloud, RefreshCcw } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button/Button.svelte';

	let { data }: { data: PageData } = $props();

	let note = $state(data.note);
	let isSaving = $state(false);
	let isMounted = $state(false);

	async function save() {
		if (isSaving || !isMounted) return;
		isSaving = true;
		console.log('Saving note');
		const url = `/api/note/${note.type}/save`;
		const res = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				note
			})
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
</script>

<div class="mx-auto flex w-full max-w-screen-md grow flex-col gap-1">
	<div class="flex flex-row gap-2">
		<Button href="/app" variant={['secondary', 'icon']} class="size-12 shrink-0 p-2">
			<ChevronLeft class="size-full" />
		</Button>
		<Input
			bind:value={note.title}
			id="noteTitle"
			debounce={500}
			onValueChange={save}
			placeholder="Title"
			class="h-12 grow text-2xl font-medium"
		/>
	</div>
	<div class="flex grow flex-col overflow-y-auto">
		{#if note.type === 'text'}
			<TextNoteComponent bind:note={note as TextNote} {save} />
		{:else if note.type === 'list'}
			<ListNoteComponent bind:note={note as ListNote} {save} />
		{/if}
	</div>

	<Card class="w-full shrink-0">
		<div class="size-5">
			{#if isSaving}
				<RefreshCcw class="size-full" />
			{:else}
				<Cloud class="size-full" />
			{/if}
		</div>
	</Card>
</div>
