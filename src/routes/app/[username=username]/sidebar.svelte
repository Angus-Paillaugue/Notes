<script lang="ts">
	import { Button } from '$lib/components';
	import { X } from 'lucide-svelte';
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
		class="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm"
		onclick={() => (open = false)}
		transition:fade={{ duration: TRANSITION_DURATION }}
	></div>

	<div class="pointer-events-none fixed inset-0 z-40 flex flex-row justify-end p-2">
		<div
			class="pointer-events-auto flex h-full w-full max-w-[400px] flex-col rounded-lg border border-border bg-card p-2"
			transition:fly={{ duration: TRANSITION_DURATION, x: '100%', easing: backInOut }}
		>
			<!-- Header -->
			<div class="flex shrink-0 flex-row items-center justify-between">
				<Button variant="icon" aria-label="Close sidebar" onclick={() => (open = false)}>
					<X class="size-full" />
				</Button>
			</div>

			<!-- Body -->
			<div class="flex w-full grow flex-col"></div>
		</div>
	</div>
{/if}
