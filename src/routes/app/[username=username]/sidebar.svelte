<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components';
	import { LogOut, User, X } from 'lucide-svelte';
	import { backInOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	interface Props {
		open?: boolean;
	}

	let { open = $bindable(false) }: Props = $props();

	const TRANSITION_DURATION = 400;
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		aria-label="Close sidebar"
		class="bg-background/50 fixed inset-0 z-40 backdrop-blur-xs"
		onclick={() => (open = false)}
		transition:fade={{ duration: TRANSITION_DURATION }}
	></div>

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
        <button class="h-8 text-start flex flex-row gap-2 items-center rounded transition text-muted justify-start w-full hover:bg-secondary p-2">
          <User class="h-full" />
          Your Profile
        </button>
      </div>

      <hr class="mt-auto" />
      <a href="/app/{page.data.user.username}/log-out" class="h-8 text-start flex flex-row gap-2 items-center rounded transition text-muted justify-start w-full hover:bg-secondary p-2">
        <LogOut class="h-full" />
        Sign-out
      </a>
		</div>
	</div>
{/if}
