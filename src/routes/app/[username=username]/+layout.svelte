<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import Nav from './nav.svelte';
	import { afterNavigate } from '$app/navigation';
	import { navNoteStates } from '$lib/stores';

	let { children }: { data: LayoutData; children: Snippet } = $props();

	afterNavigate(() => {
		$navNoteStates.editModalOpen = false;
		$navNoteStates.isSaving = false;
	});
</script>

<div class="flex min-h-svh w-full grow flex-col">
	<main class="flex h-full w-full grow flex-col p-2">
		{@render children()}
	</main>
	<Nav />
</div>
