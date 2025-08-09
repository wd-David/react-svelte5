import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
    open: "/svelte-migration-slides.html",
  },
  build: {
    rollupOptions: {
      input: {
        slides: "svelte-migration-slides.html",
      },
    },
  },
});
