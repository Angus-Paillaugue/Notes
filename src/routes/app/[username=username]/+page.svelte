<script lang="ts">
	import { Button, Card, Input, Select } from '$lib/components';
	import { List, Send, Text } from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';

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
		class="relative mb-10 flex w-full flex-row gap-2"
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

	<div class="flex flex-col gap-8">
		{#each user.notes as note}
			<Card class="mb-4" href="/app/{user.username}/{note.id}">
				<Card.Heading>{note.title}</Card.Heading>
			</Card>
		{/each}
	</div>
</div>
