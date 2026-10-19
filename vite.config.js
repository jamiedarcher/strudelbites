import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// base './' makes the build work from any folder, including
// GitHub Pages at https://jamiedarcher.github.io/strudelbites/
export default defineConfig({
  base: './',
  plugins: [svelte()],
});
