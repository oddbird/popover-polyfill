/* eslint-disable import/no-named-as-default-member */

import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      '.git/*',
      '.vscode/*',
      'coverage/*',
      'dist/*',
      'node_modules/*',
      'playwright-report/*',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  prettier,
  {
    files: ['**/*.{js,mjs,cjs,ts,cts,mts}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: { 'simple-import-sort': simpleImportSort },
    settings: {
      'import/resolver': {
        typescript: {
          project: 'tsconfig.json',
        },
      },
    },
    rules: {
      'no-warning-comments': ['warn', { terms: ['todo', 'fixme', '@@@'] }],
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      'import/first': 'warn',
      'import/newline-after-import': 'warn',
      'import/no-duplicates': ['error', { 'prefer-inline': true }],
      'import/order': 'off',
    },
  },
  {
    files: ['src/**/*.{js,mjs,cjs,ts,cts,mts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
  },
];
