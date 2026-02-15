const js = require('@eslint/js')
const prettier = require('eslint-plugin-prettier')
const prettierConfig = require('eslint-config-prettier')
const globals = require('globals')

module.exports = [
	{
		ignores: ['pkg/**'],
	},
	js.configs.recommended,
	prettierConfig,
	{
		plugins: {
			prettier: prettier,
		},
		languageOptions: {
			ecmaVersion: 2021,
			sourceType: 'commonjs',
			globals: {
				...globals.node,
			},
		},
		rules: {
			'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'prettier/prettier': 'error',
		},
	},
]
