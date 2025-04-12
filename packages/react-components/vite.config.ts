import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import tsconfigPaths from 'vite-tsconfig-paths'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    dts({
      include: ['src'],
      exclude: ['node_modules', 'dist']
    }),
    tsconfigPaths()
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'react-components',
      formats: ['es']
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime.js'],
      output: {
        format: 'es',
        // Ensure exports are handled properly
        exports: 'named',
        preserveModulesRoot: 'src',
        // Ensure proper entry filenames
        entryFileNames: ({ name: fileName }) => {
          return `${fileName}.js`
        },
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime.js': 'jsx'
        }
      }
    },
    outDir: 'dist',
    // Ensure clean build
    emptyOutDir: true
  }
})
