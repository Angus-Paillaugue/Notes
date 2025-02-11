import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';


export default defineConfig({
	plugins: [sveltekit(), compression()]
});
