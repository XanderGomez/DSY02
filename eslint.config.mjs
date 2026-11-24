import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import importPlugin from 'eslint-plugin-import-x';
import globals from 'globals';

const typescriptFiles = ['**/*.{ts,tsx}'];

export default [
  // Ignore generated output everywhere, including future backend build folders.
  { ignores: ['**/node_modules/**', '**/.vite/**', '**/dist/**', '**/out/**', '**/coverage/**'] },
  {
    ...js.configs.recommended,
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
  },
  ...tsPlugin.configs['flat/recommended'].map((config) => ({
    ...config,
    files: typescriptFiles,
  })),
  {
    ...importPlugin.flatConfigs.recommended,
    files: typescriptFiles,
  },
  {
    ...importPlugin.flatConfigs.typescript,
    files: typescriptFiles,
    settings: {
      ...importPlugin.flatConfigs.typescript.settings,
      'import-x/core-modules': ['electron'],
      'import-x/resolver-next': [createTypeScriptImportResolver({ project: './tsconfig.json' })],
    },
  },
  {
    files: ['src/renderer/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: [
      'src/main/**/*.ts',
      'src/backend/**/*.ts',
      'config/**/*.ts',
      'forge.config.ts',
      'eslint.config.mjs',
      'tests/**/*.{js,mjs,cjs,ts}',
    ],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['src/preload/**/*.ts'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
];
