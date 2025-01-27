<script lang="ts">
	import { Button } from '$lib/components';
	import { ChevronLeft, Cloud, NotebookText, Pencil, RefreshCcw, User } from 'lucide-svelte';
	import Sidebar from './sidebar.svelte';
	import { page } from '$app/state';
	import { fly } from 'svelte/transition';
	import { backInOut } from 'svelte/easing';
	import { navNoteStates } from '$lib/stores';

	const showBackButton = ['/app/*/*'];
	const pathMatch = (path: string) => new RegExp(path.replace(/\*/g, '.*')).test(page.url.pathname);

	let sidebarOpen = $state(false);
	let backButtonShown = $derived(showBackButton.some((path) => pathMatch(path)));
	let isNotePage = $derived(new RegExp(/\/app\/.*\/\d+/).test(page.url.pathname));
</script>

<Sidebar bind:open={sidebarOpen} />

<div class="h-16 shrink-0 px-2 pb-2">
	<div
		class="bg-card mx-auto flex h-full w-full max-w-screen-md flex-row items-center justify-between overflow-hidden rounded-full p-2"
	>
		<div class="relative aspect-square h-full shrink-0">
			{#if backButtonShown}
				<span
					transition:fly={{ y: '-100%', duration: 400, easing: backInOut }}
					class="absolute inset-0"
				>
					<Button
						variant="foreground"
						class="size-full shrink-0 rounded-full p-2"
						onclick={() => history.back()}
					>
						<ChevronLeft class="size-full" />
					</Button>
				</span>
			{:else}
				<span
					transition:fly={{ y: '100%', duration: 400, easing: backInOut }}
					class="absolute inset-0"
				>
					<Button
						variant="foreground"
						class="size-full shrink-0 rounded-full p-2"
						href="/app/{page.data.user.username}"
					>
						<NotebookText class="size-full" />
					</Button>
				</span>
			{/if}
		</div>
		{#if isNotePage}
			<span
				transition:fly={{ y: '-100%', duration: 400, easing: backInOut }}
				class="aspect-square h-full shrink-0"
			>
				<Button
					variant="foreground"
					class="aspect-square size-full rounded-full p-2.5"
					onclick={() => ($navNoteStates.editModalOpen = true)}
				>
					<Pencil class="size-full" />
				</Button>
			</span>
		{/if}
		<div class="relative aspect-square h-full shrink-0">
			{#if isNotePage}
				<div
					class="absolute inset-0 p-2"
					transition:fly={{ y: '-100%', duration: 400, easing: backInOut }}
				>
					{#if $navNoteStates.isSaving}
						<RefreshCcw class="size-full" />
					{:else}
						<Cloud class="size-full" />
					{/if}
				</div>
			{:else}
				<div
					transition:fly={{ y: '100%', duration: 400, easing: backInOut }}
					class="absolute inset-0"
				>
					<Button
						title="Open sidebar"
						variant="foreground"
						class="aspect-square h-full w-auto shrink-0 rounded-full p-2"
						onclick={() => (sidebarOpen = !sidebarOpen)}
					>
						<User class="size-6" />
					</Button>
				</div>
			{/if}
		</div>
	</div>
</div>
