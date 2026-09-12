import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    react: 'src/react.tsx',
  },
  format: ['cjs', 'esm'],
  target: 'es2022',
  dts: {
    compilerOptions: {
      incremental: false,
    },
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  banner: {
    js: '/* sound-library — procedural micro-UX sound effects */',
  },
});
