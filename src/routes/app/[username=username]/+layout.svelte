<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import Sidebar from './sidebar.svelte';

	let { children }: { data: LayoutData; children: Snippet } = $props();

	let open = $state(false);
</script>

<Sidebar bind:open />

<main class="flex h-full min-h-svh w-full grow flex-col p-2">
	{@render children()}
</main>
