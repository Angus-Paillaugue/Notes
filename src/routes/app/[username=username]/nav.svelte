<script lang="ts">
	import { Button } from '$lib/components';
	import { ChevronLeft, User } from 'lucide-svelte';
	import Sidebar from './sidebar.svelte';
	import { page } from '$app/state';
	import { fly } from 'svelte/transition';
	import { backInOut } from 'svelte/easing';

	const showBackButton = ['/app/*/*'];
	const pathMatch = (path: string) => new RegExp(path.replace(/\*/g, '.*')).test(page.url.pathname);

	let sidebarOpen = $state(false);
	let backButtonShown = $derived(showBackButton.some((path) => pathMatch(path)));
</script>

<Sidebar bind:open={sidebarOpen} />

<div class="mx-auto w-full max-w-screen-xl shrink-0 p-2">
	<div class="bg-card h-12 w-full overflow-hidden rounded-lg border">
		<div class="flex h-full w-full flex-row items-center justify-between p-2">
			{#if backButtonShown}
				<span transition:fly={{ y: '100%', duration: 400, easing: backInOut }}>
					<Button
						variant="border"
						class="hover:bg-background size-8 rounded-full p-1.5"
						onclick={() => history.back()}
					>
						<ChevronLeft class="size-full" />
					</Button>
				</span>
			{:else}
				<div class="size-8"></div>
			{/if}

			<!-- Open sidebar menu -->
			<Button
				title="Open sidebar"
				variant={['icon', 'border']}
				class="hover:bg-background size-8 rounded-full p-1.5"
				onclick={() => (sidebarOpen = !sidebarOpen)}
			>
				<User class="size-6" />
			</Button>
		</div>
	</div>
</div>
