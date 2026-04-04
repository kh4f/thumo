import type { UserConfig } from 'tsdown'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import rawstyle from '@rawstyle/vite'

const isProd = process.argv.includes('--prod')

export default {
	platform: 'browser',
	entry: 'src/{content.tsx,background.ts}',
	copy: ['src/manifest.json', 'src/assets'],
	minify: isProd,
	sourcemap: isProd ? false : 'inline',
	deps: { onlyBundle: false },
	plugins: [react(), babel({ presets: [reactCompilerPreset()] }), rawstyle()],
} satisfies UserConfig