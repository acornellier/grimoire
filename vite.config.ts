import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  build: {
    minify: 'terser',
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
    viteStaticCopy({
      targets: [
        {
          src: resolve(__dirname, 'src/data/spells.json'),
          dest: '.',
        },
      ],
    }),
  ],
})
