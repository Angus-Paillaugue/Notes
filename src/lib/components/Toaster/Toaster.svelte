<script lang="ts">
	import { toasts } from '$lib/stores';
	import Toast from './Toast.svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';

	// interface MyProps {}
	// let {}: MyProps = $props();
</script>

<div class="fixed right-2 bottom-20 left-2 z-40 h-auto 2xl:bottom-2">
	<div class="flex w-full max-w-[500px] flex-col gap-2 max-2xl:mx-auto 2xl:ml-auto">
		{#each $toasts.slice(0, 3) as toast (toast.id)}
			<div animate:flip transition:fly={{ x: '100%' }} class="w-full">
				<Toast {toast} />
			</div>
		{/each}
	</div>
</div>
