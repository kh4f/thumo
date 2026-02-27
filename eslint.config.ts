import { defineConfig, globalIgnores } from 'eslint/config'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintReact from '@eslint-react/eslint-plugin'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import rawstyle from 'rawstyle-eslint'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
	globalIgnores(['dist'], 'Global Ignores'),
	{
		name: 'Base Rules',
		files: ['**/*.ts?(x)'],
		extends: [eslint.configs.recommended],
		rules: { 'no-case-declarations': 'off' },
	},
	{
		name: 'Type-Aware Rules',
		files: ['**/*.ts?(x)'],
		extends: [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
		languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname } },
		rules: {
			'@typescript-eslint/restrict-template-expressions': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-confusing-void-expression': 'off',
		},
	},
	{
		name: 'React Rules',
		files: ['**/*.ts?(x)'],
		settings: { react: { version: 'detect' } },
		extends: [
			jsxA11y.flatConfigs.strict,
			reactPlugin.configs.flat.recommended,
			reactPlugin.configs.flat['jsx-runtime'],
			reactHooks.configs.flat.recommended,
			eslintReact.configs['recommended-type-checked'],
			rawstyle.configs.recommended,
		],
		rules: {
			'@eslint-react/no-array-index-key': 'off',
			'@eslint-react/hooks-extra/no-direct-set-state-in-use-effect': 'off',
		},
	},
	{
		name: 'Stylistic Rules',
		files: ['**/*.ts?(x)'],
		extends: [stylistic.configs.recommended],
		rules: {
			'@stylistic/no-tabs': 'off',
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/indent-binary-ops': ['error', 'tab'],
			'@stylistic/brace-style': ['error', '1tbs'],
			'@stylistic/arrow-parens': ['error', 'as-needed'],
			'@stylistic/eol-last': ['error', 'never'],
			'@stylistic/max-statements-per-line': 'off',
			'@stylistic/multiline-ternary': 'off',
			'@stylistic/comma-dangle': ['error', 'only-multiline'],
			'@stylistic/jsx-indent-props': ['error', 'tab'],
			'@stylistic/jsx-one-expression-per-line': 'off',
			'@stylistic/jsx-tag-spacing': ['error', { beforeClosing: 'never', beforeSelfClosing: 'never' }],
			'@stylistic/jsx-wrap-multilines': 'off',
			'@stylistic/jsx-closing-tag-location': 'off',
			'@stylistic/jsx-closing-bracket-location': 'off',
		},
	},
])