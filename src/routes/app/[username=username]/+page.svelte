<script lang="ts">
	import { Button, Card, Input, Select, Checkbox } from '$lib/components';
	import { List, Pin, Send, Text } from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import type { Note } from '$lib/types';

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

{#snippet notePreview(note: Note)}
	{@const textColor = note.pinned ? 'text-foreground' : 'text-muted'}
	<Card
		href="/app/{user.username}/{note.id}"
		class={(note.pinned ? 'bg-primary' : '') + ' relative overflow-hidden'}
	>
		<Card.Heading>{note.title}</Card.Heading>
		{#if note.type === 'text' && note.content}
			<div class="relative max-h-20 overflow-hidden">
				<div
					class="{note.pinned
						? 'to-primary'
						: 'to-card'} absolute right-0 bottom-0 left-0 h-1/2 bg-linear-to-b from-transparent"
				></div>
				<p class="{textColor} mt-2 line-clamp-4 whitespace-pre-wrap">{note.content}</p>
			</div>
		{:else if note.type === 'list' && note.items.length > 0}
			<div class="relative mt-2 flex max-h-20 flex-col gap-1 overflow-y-hidden">
				{#each note.items.slice(0, 3) as item}
					<div class="flex h-6 flex-row items-center gap-2">
						<Checkbox
							inverted={note.pinned}
							id="listNotePrevireCheckbox-{note.id}-{item.position}"
							checked={item.checked}
							disabled={true}
						/>
						<span class={textColor}>{item.item}</span>
					</div>
				{/each}
				{#if note.items.length > 3}
					<div
						class="{note.pinned
							? 'to-primary'
							: 'to-card'} absolute right-0 bottom-0 left-0 h-1/2 bg-linear-to-b from-transparent"
					></div>
				{/if}
			</div>
		{/if}
	</Card>
{/snippet}

<div class="mx-auto flex w-full max-w-screen-md grow flex-col">
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
		<Select id="newNoteType" name="newNoteType" required>
			{#each noteTypes as type}
				<Select.Option value={type.value}>{type.name}</Select.Option>
			{/each}
		</Select>
		<Input id="newNoteTitle" placeholder="Create a new note" class="rounded px-4 py-2" />
		<Button
			variant="icon"
			loading={isCreatingNote}
			class="bg-card-foreground absolute top-[6px] right-[6px] bottom-[6px] aspect-square size-auto rounded-[.6rem] p-1.5"
		>
			<Send class="size-full" />
		</Button>
	</form>

	<!-- Pinned notes section -->
	{#if user.notes.filter((note) => note.pinned).length > 0}
		<div class="text-muted mt-6 mb-2 flex w-full flex-row items-center gap-2">
			<div class="grow border"></div>
			<Pin class="size-6" />
			<p>Pinned Notes</p>
			<div class="grow border"></div>
		</div>

		<!-- Pinned Notes -->
		<div class="flex flex-col gap-2">
			{#each user.notes.filter((note) => note.pinned) as note}
				{@render notePreview(note)}
			{/each}
		</div>
	{/if}

	<!-- Normal notes -->
	{#if user.notes.filter((note) => !note.pinned).length > 0}
		<div class="my-6 w-full border-b"></div>

		<!-- Pinned Notes -->
		<div class="flex flex-col gap-2">
			{#each user.notes.filter((note) => !note.pinned) as note}
				{@render notePreview(note)}
			{/each}
		</div>
	{/if}

	<!-- If no notes -->
	{#if user.notes.length === 0}
		<div class="my-6 w-full border-b"></div>
		<Card><Card.Heading>No notes found</Card.Heading>You can create one above</Card>
	{/if}
</div>
