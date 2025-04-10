import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'node:url';
import importPlugin from 'eslint-plugin-import';
import path from 'node:path';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unicorn from 'eslint-plugin-unicorn';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: ['src/components/ui/**/*'],
  },
  {
    plugins: {
      unicorn,
      import: importPlugin,
      playwright,
      prettier,
      'simple-import-sort': simpleImportSort,
    },
  },
  {
    rules: {
      ...unicorn.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...playwright.configs.recommended.rules,
      ...prettier.configs.recommended.rules,
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/prevent-abbreviations': [
        'error',
        {
          allowList: {
            e2e: true,
          },
          replacements: {
            props: false,
            ref: false,
            params: false,
          },
        },
      ],
    },
  },
  {
    files: ['*.js'],
    rules: {
      'unicorn/prefer-module': 'off',
    },
  },
];

export default eslintConfig;
