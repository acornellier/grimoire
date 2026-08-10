import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { viteStaticCopy } from 'vite-plugin-static-copy'

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
      // spells.json ships as a sibling asset rather than being inlined. Inlining
      // embeds the whole database in a template literal, which V8 must lex as JS
      // source before it can even parse the JSON: 2400ms and 4.4GB peak RSS to
      // import, versus 258ms and 371MB as a native JSON module.
      external: (id) => id === 'fs' || id.endsWith('spells.json'),
    },
  },
  plugins: [
    dts({
      rollupTypes: true,
    }),
    viteStaticCopy({
      targets: [{ src: 'src/spells.json', dest: '.' }],
    }),
  ],
})
