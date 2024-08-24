import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: true,
      mangle: true,
    },
    sourcemap: false,
    lib: {
      formats: ['es'],
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
    },
    rollupOptions: {
      external: ['fs'],
    },
  },
  plugins: [
    dts({
      rollupTypes: true,
    }),
  ],
})
