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
					'size-5 cursor-pointer appearance-none rounded border border-border disabled:opacity-70 transition-all checked:bg-card peer',
					className
				)}
				bind:checked
				{...restProps}
			/>
			{#if checked}
				<span
					class="pointer-events-none peer-disabled:opacity-70 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-foreground"
					transition:scale={{ duration: 150 }}
				>
					<Check class="size-3.5" strokeWidth={3} />
				</span>
			{/if}
		</label>
	</div>
{:else}
	<div class={cn('size-5 animate-pulse rounded border border-border bg-card', className)}></div>
{/if}
