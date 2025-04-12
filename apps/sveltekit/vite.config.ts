import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  ssr: {
    noExternal: ['react-components'] // replace with your actual package name
  },
  plugins: [sveltekit()]
})
