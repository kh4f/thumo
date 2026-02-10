import type { UserConfig } from 'tsdown'
import rawstyle from '@rawstyle/vite'

const isProd = process.argv.includes('--prod')

export default {
	platform: 'browser',
	minify: isProd,
	sourcemap: isProd ? false : 'inline',
	fixedExtension: false,
	plugins: [rawstyle()],
} satisfies UserConfig