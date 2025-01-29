<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components';
	let { children } = $props();
</script>

<Toaster />

<div class="flex min-h-svh w-full flex-col">
	{@render children()}
</div>
