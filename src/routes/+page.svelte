<script>
	import { Button } from '$lib/components';
</script>

<div class="fixed top-0 right-0 left-0 z-30 w-full p-4">
	<div class="bg-background mx-auto flex max-w-screen-xl flex-row items-center rounded p-2">
		<div class="ml-auto flex flex-row items-center gap-2">
			<Button href="/auth/log-in" variant="foreground">Log in</Button>
			<Button href="/auth/sign-up" variant="primary" class="border border-white bg-white text-black"
				>Sign up</Button
			>
		</div>
	</div>
</div>

<div class="flex h-svh flex-col items-center justify-center px-2 py-12">
	<div
		class="relative mx-auto flex h-[90%] w-full max-w-screen-2xl flex-col items-center justify-between gap-8 overflow-hidden rounded-3xl p-12 px-4"
	>
		<div
			class="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat brightness-75"
			style="background-image: url(https://www.cursor.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgradient-hero-prerender.3af0e196.webp&w=3840&q=75);"
		></div>

		<div
			class="to-background/80 absolute inset-0 -z-10 bg-linear-to-b from-transparent from-20%"
		></div>

		<div class="mx-auto flex w-1/2 flex-col items-center justify-center gap-8">
			<h1 class="text-center font-sans text-8xl font-bold text-white">Notes</h1>
			<h2 class="text-center font-mono text-2xl text-balance text-neutral-100">
				A minimalist note-taking app that helps you focus on what matters.
			</h2>
			<a
				href="/auth/log-in"
				class="rounded bg-white px-5 py-2 font-mono text-lg text-black outline-1 outline-offset-4 outline-white/50 transition-all hover:outline-2 hover:outline-white"
			>
				Get started
			</a>
		</div>
	</div>
</div>
