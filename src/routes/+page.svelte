<script>
	import { Button } from "$lib/components";

</script>

<div class="w-full fixed left-0 right-0 top-0 p-4 z-30">
  <div class="max-w-screen-xl mx-auto p-2 flex flex-row items-center rounded bg-background">
    <div class="flex flex-row items-center gap-2 ml-auto">
      <Button href="/auth/log-in" variant="border">Log in</Button>
      <Button href="/auth/sign-up" variant="primary" class="bg-white text-black border border-white">Sign up</Button>
    </div>
  </div>
</div>

<div class="h-svh flex flex-col items-center justify-center py-12 px-2">
  <div class="max-w-screen-2xl w-full mx-auto h-[90%] flex flex-col items-center justify-between rounded-3xl relative overflow-hidden p-12 px-4 gap-8">
    <div class="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10 brightness-75" style="background-image: url(https://www.cursor.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgradient-hero-prerender.3af0e196.webp&w=3840&q=75);"></div>

    <div class="absolute inset-0 bg-gradient-to-b -z-10 from-transparent to-background/80 from-20%"></div>

    <div class="flex flex-col gap-8 w-1/2 mx-auto items-center justify-center">
      <h1 class="font-sans text-8xl text-white text-center font-bold">Notes</h1>
      <h2 class="font-mono text-neutral-100 text-2xl text-balance text-center">A minimalist note-taking app that helps you focus on what matters.</h2>
      <a href="/auth/log-in" class="px-5 py-2 rounded bg-white text-black text-lg font-mono outline-1 hover:outline-2 outline-offset-4 outline-white/50 transition-all hover:outline-white">
        Get started
      </a>
    </div>
  </div>
</div>
