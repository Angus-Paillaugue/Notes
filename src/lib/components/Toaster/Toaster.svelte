<script lang="ts">
	import { toasts } from '$lib/stores';
	import Toast from './Toast.svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';

	// interface MyProps {}
	// let {}: MyProps = $props();
</script>

<div class="fixed left-0 right-0 flex flex-col items-center justify-center top-2 z-50 h-auto">
	<div class="flex w-full max-w-[500px] flex-col gap-2 max-2xl:mx-auto 2xl:ml-auto">
		{#each $toasts.slice(0, 3) as toast (toast.id)}
			<div animate:flip transition:fly={{ x: '100%' }} class="w-full">
				<Toast {toast} />
			</div>
		{/each}
	</div>
</div>
