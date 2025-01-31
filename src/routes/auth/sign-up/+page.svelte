<script>
	import { Card, Button, Input, Link } from '$lib/components';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores';

	let { form } = $props();

	let isSubmitting = $state(false);

  $effect(() => {
		if(form && form.message) {
      toast.error(form.message);
    }
	})
</script>

<div class="mx-auto w-full max-w-xl grow">
	<Card class="mt-[150px] w-full">
		<Card.Heading>Sign-up</Card.Heading>

		<form
			action="?/signUp"
			method="POST"
			class="mt-6 flex flex-col gap-2"
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
				>Sign-up</Button
			>
		</form>

		<p class="mt-4 text-sm">
			Already have an account?
			<Link href="/auth/log-in">Log-in</Link>
		</p>
	</Card>
</div>
