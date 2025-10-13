module.exports = {
	extends: ['eslint:recommended', 'prettier'],
	plugins: ['prettier'],
	env: {
		node: true,
		es2021: true,
	},
	rules: {
		'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'prettier/prettier': 'error',
	},
}
