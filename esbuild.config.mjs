import esbuild from 'esbuild'

export default esbuild.build({
  entryPoints: ['src/index.mts'],
  bundle: true,
  minify: true,
  format: 'esm',
  packages: 'external',
  outfile: 'dist/index.min.mjs',
  target: 'es2020'
})