<script lang="ts">
	import { page } from '$app/state';
	import { Button, Modal } from '$lib/components';
	import { LogOut, User, X } from 'lucide-svelte';
	import { backInOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	interface Props {
		open?: boolean;
	}

	let { open = $bindable(false) }: Props = $props();

	const TRANSITION_DURATION = 400;
</script>

<Modal.Backdrop bind:open />

{#if open}
	<div class="pointer-events-none fixed inset-0 z-40 flex flex-row justify-end p-2">
		<div
			class="bg-card pointer-events-auto flex h-full w-full max-w-[400px] flex-col rounded-lg border p-4"
			transition:fly={{ duration: TRANSITION_DURATION, x: '100%', easing: backInOut }}
		>
			<!-- Header -->
			<div class="flex shrink-0 flex-row items-center justify-between">
				<div class="flex flex-col gap-1">
					<span class="font-sans text-base font-medium">{page.data.user.username}</span>
				</div>
				<Button
					variant={['icon', 'border']}
					aria-label="Close sidebar"
					onclick={() => (open = false)}
				>
					<X class="size-full" />
				</Button>
			</div>

			<hr />

			<!-- Body -->
			<div class="flex w-full grow flex-col">
				<button
					class="text-muted hover:bg-secondary flex h-8 w-full flex-row items-center justify-start gap-2 rounded p-2 text-start transition"
				>
					<User class="h-full" />
					Your Profile
				</button>
			</div>

			<hr class="mt-auto" />
			<a
				href="/app/{page.data.user.username}/log-out"
				class="text-muted hover:bg-secondary flex h-8 w-full flex-row items-center justify-start gap-2 rounded p-2 text-start transition"
			>
				<LogOut class="h-full" />
				Sign-out
			</a>
		</div>
	</div>
{/if}
