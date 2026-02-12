import type { UserConfig } from 'tsdown'
import react from '@vitejs/plugin-react'
import rawstyle from '@rawstyle/vite'

const isProd = process.argv.includes('--prod')

export default {
	platform: 'browser',
	entry: 'src/{content.tsx,background.ts}',
	copy: 'src/manifest.json',
	minify: isProd,
	sourcemap: isProd ? false : 'inline',
	inlineOnly: false,
	plugins: [react(), rawstyle()],
} satisfies UserConfig