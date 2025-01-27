<script lang="ts">
	import { Button } from '$lib/components';
	import type { ListNote, ListNoteItem } from '$lib/types';
	import { Plus } from 'lucide-svelte';
	import { flip } from 'svelte/animate';
	import { slide } from 'svelte/transition';
	import ListNoteItemComponent from './list-note-item.svelte';
	import { quintOut } from 'svelte/easing';

	interface Props {
		note: ListNote;
		save: () => void;
	}

	let { note = $bindable(), save }: Props = $props();
	let focusLatest = $state(false);

	function addListItem(checked = false) {
		focusLatest = true;
		note.items.push({
			id: -1,
			item: '',
			checked: checked,
			position: note.items.length
		});
		save();
	}

	function deleteItem(item: ListNoteItem) {
		note.items = note.items.filter((i) => i.id !== item.id);
		save();
	}

	function handleDrop(draggedItemId: string, targetItemId: string) {
		if (draggedItemId && targetItemId) {
			const draggedItem = note.items.find((item) => item.id === parseInt(draggedItemId));
			const targetItem = note.items.find((item) => item.id === parseInt(targetItemId));

			if (draggedItem && targetItem) {
				const draggedIndex = note.items.indexOf(draggedItem);
				const targetIndex = note.items.indexOf(targetItem);

				// Reorder items
				note.items.splice(draggedIndex, 1);
				note.items.splice(targetIndex, 0, draggedItem);

				// Update positions
				note.items.forEach((item, index) => {
					item.position = index;
				});

				save();
			}
		}
	}
</script>

<svelte:head>
	<title>{note.title}</title>
</svelte:head>

<div class="flex h-full w-full grow flex-col gap-2 overflow-x-hidden">
	<!-- Unchecked Items -->
	<div class="flex flex-col">
		<!-- Heading -->
		<hr />

		<!-- Items -->
		<div class="flex flex-col gap-2 px-1">
			{#each note.items as item, i (item.id)}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					animate:flip={{ duration: 300, easing: quintOut }}
					in:slide={{ axis: 'y', duration: 400 }}
					out:slide={{ axis: 'y', duration: 200 }}
					ondragover={(e) => e.preventDefault()}
				>
					<ListNoteItemComponent
						focus={i === note.items.length - 1 && focusLatest}
						item={note.items[i]}
						ondrop={handleDrop}
						{deleteItem}
						{save}
					/>
				</div>
			{/each}
		</div>
	</div>

	<!-- Add item to list -->
	<Button variant="secondary" class="mt-4 w-full" onclick={() => addListItem(false)}>
		<Plus class="size-5" />
		Add Item
	</Button>
</div>
