import type { UserConfig } from 'tsdown'

const isProd = process.argv.includes('--prod')

export default {
	platform: 'browser',
	minify: isProd,
	sourcemap: isProd ? false : 'inline',
	fixedExtension: false,
} satisfies UserConfig