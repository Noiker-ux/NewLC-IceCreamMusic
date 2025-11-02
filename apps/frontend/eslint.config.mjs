// @ts-check
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import reactYouMightNotNeedAnEffect from 'eslint-plugin-react-you-might-not-need-an-effect';
import { defineConfig, globalIgnores } from 'eslint/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends('next/core', 'next/core-web-vitals', 'next/typescript'),
	reactYouMightNotNeedAnEffect.configs.recommended,

	{
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'react-hooks/exhaustive-deps': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
		},
	},
	globalIgnores(['./.next/**']),
];

export default eslintConfig;
