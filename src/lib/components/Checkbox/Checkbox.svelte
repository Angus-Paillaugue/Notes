<script lang="ts">
	import type { RequiredFields } from '$lib/types';
	import { cn } from '$lib/utils';
	import { Check } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { scale } from 'svelte/transition';

	let {
		checked = $bindable(),
		id,
		class: className,
		...restProps
	}: RequiredFields<SvelteHTMLElements['input'], 'id'> = $props();
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});
</script>

<!-- No fucking idea why, but on mount, the checked value is randomly toggled -->
<!-- So, wrapping it into a non SSR component seems to fix it. -->
<!-- Will need to investigate more thoroughly when I have time -->
{#if mounted}
	<div class="inline-flex items-center">
		<label class="relative flex cursor-pointer items-center" for={id}>
			<input
				{id}
				type="checkbox"
				class={cn(
					'checked:bg-card peer size-5 cursor-pointer appearance-none rounded border transition-all disabled:opacity-70',
					className
				)}
				bind:checked
				{...restProps}
			/>
			{#if checked}
				<span
					class="text-foreground pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform peer-disabled:opacity-70"
					transition:scale={{ duration: 150 }}
				>
					<Check class="size-3.5" strokeWidth={3} />
				</span>
			{/if}
		</label>
	</div>
{:else}
	<div class={cn('bg-card size-5 animate-pulse rounded border', className)}></div>
{/if}
