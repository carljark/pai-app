// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    // Reglas de la casa (AGENTS.md §4 y §5)
    files: ['**/*.ts'],
    ignores: ['**/*.spec.ts'],
    rules: {
      'max-lines-per-function': ['error', { max: 25, skipBlankLines: true, skipComments: true }],
      // Parámetros que exige una firma pública pero no se usan: prefijo `_`
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@angular-eslint/component-max-inline-declarations': ['error', { template: 0, styles: 0 }],
    },
  },
  {
    // Los mocks de test usan `any` y funciones vacías de forma legítima
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/label-has-associated-control': [
        'error',
        { controlComponents: ['app-select'] },
      ],
    },
  },
]);
