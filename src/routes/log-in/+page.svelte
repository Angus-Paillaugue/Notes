<script>
	import { Card, Button, Input } from '$lib/components';
	import { enhance } from '$app/forms';

	let { form } = $props();

	let isSubmitting = $state(false);
</script>

<div class="mx-auto w-full max-w-xl grow">
	<Card class="mt-[150px] w-full">
		<Card.Heading>Log-in</Card.Heading>

		<form
			action="?/logIn"
			method="POST"
			class="mt-6 flex flex-col gap-2 w-full"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					await update({ reset: false });
					isSubmitting = false;
				};
			}}
		>
			<Input.Floating label="Username" id="username" />
			<Input.Floating type="password" label="Password" id="password" />

			<Button type="submit" loading={isSubmitting} class="mt-4 w-full" variant="primary"
				>Log-in</Button
			>

			{#if form && form.message}
				<p class="mt-2 text-sm text-red-500">{form.message}</p>
			{/if}
		</form>
	</Card>
</div>
