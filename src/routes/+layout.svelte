<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="flex min-h-svh w-full flex-col">
	{@render children()}
</div>
