<script lang="ts">
	import type { TextNote } from '$lib/types';
	import { debounce } from '$lib/utils';
	import { onMount } from 'svelte';

	interface Props {
		note: TextNote;
		save: () => void;
	}

	let { note = $bindable(), save }: Props = $props();

	let textarea = $state<HTMLTextAreaElement>();

	onMount(() => {
		textarea?.focus();
	});
</script>

<textarea
	bind:this={textarea}
	bind:value={note.content}
	use:debounce={{ callback: save, delay: 500 }}
	class="h-full w-full grow resize-none bg-background text-foreground outline-none focus:outline-none"
></textarea>
