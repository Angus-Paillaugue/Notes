<script lang="ts">
	import { Button, Card, Input, Select } from '$lib/components';
	import { List, Send, Text } from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import Checkbox from '$lib/components/Checkbox/Checkbox.svelte';

	let { data }: { data: PageData; form: ActionData } = $props();
	const { user } = data;

	let isCreatingNote = $state(false);
	const noteTypes = [
		{
			icon: Text,
			name: 'Text',
			value: 'text'
		},
		{
			icon: List,
			name: 'List',
			value: 'list'
		}
	];
</script>

<div class="mx-auto w-full max-w-xl grow">
	<form
		method="POST"
		action="?/createNote"
		class="relative flex w-full flex-row gap-2"
		use:enhance={() => {
			isCreatingNote = true;
			return async ({ update }) => {
				await update({ reset: false });
				isCreatingNote = false;
			};
		}}
	>
		<Select id="newNoteType" name="newNoteType" class="rounded-lg" required>
			{#each noteTypes as type}
				<Select.Option value={type.value}>{type.name}</Select.Option>
			{/each}
		</Select>
		<Input id="newNoteTitle" placeholder="Create a new note" class="rounded-lg px-4 py-2" />
		<Button
			variant="icon"
			loading={isCreatingNote}
			class="absolute bottom-1.5 right-1.5 top-1.5 aspect-square size-auto p-1.5 hover:bg-card"
		>
			<Send class="size-full" />
		</Button>
	</form>

  <hr>

	<div class="flex flex-col gap-2">
		{#each user.notes as note}
			<Card class="mb-4" href="/app/{user.username}/{note.id}">
				<Card.Heading>{note.title}</Card.Heading>
        {#if note.type === 'text'}
          <p class="text-muted line-clamp-3 whitespace-pre-wrap">{note.content}</p>
        {:else if note.type === 'list'}
          <div class="max-h-[4.5rem] overflow-y-hidden relative">
            {#each note.items as item}
              <div class="flex flex-row gap-2 items-center h-6">
                <Checkbox id="listNotePrevireCheckbox-{note.id}-{item.position}" checked={item.checked} disabled={true} />
                <span class="text-muted">{item.item}</span>
              </div>
            {/each}
            {#if note.items.length > 3}
              <div class="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-transparent to-card"></div>
            {/if}
          </div>
        {/if}
			</Card>
		{/each}
	</div>
</div>
