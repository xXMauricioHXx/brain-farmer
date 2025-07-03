import js from '@eslint/js';
import parser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,

  {
    files: ['**/*.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
      globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
      import: importPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...prettier.rules,

      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'no-unused-vars': 'off',
      'no-await-in-loop': 'off',
      'no-empty-function': 'off',
      '@typescript-eslint/no-use-before-define': ['error'],
      'import/extensions': ['error', 'ignorePackages', { ts: 'never' }],
      'prettier/prettier': 'error',
      'import/prefer-default-export': 'off',
      'no-console': 'off',
      'lines-between-class-members': 'off',
      'class-methods-use-this': 'off',
      camelcase: 'off',
      'no-useless-constructor': 'off',
      'no-underscore-dangle': 'off',
      'import/no-extraneous-dependencies': 'off',
      'array-callback-return': 'off',
      'no-param-reassign': 'off',
      'no-restricted-syntax': 'off',
      'no-case-declarations': 'off',
      'no-plusplus': 'off',
      'no-promise-executor-return': 'off',
      'no-extend-native': 'off',
      'func-names': 'off',
      'no-undef': 'off',
      'no-continue': 'off',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: {},
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
];
