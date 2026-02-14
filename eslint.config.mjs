import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import nextPlugin from '@next/eslint-plugin-next'
import reactPlugin from 'eslint-plugin-react'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', '.next/'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        project: undefined,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@next/next': nextPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@next/next/no-html-link-for-pages': 'error',
      'react/jsx-uses-react': 'off', // Next.js 14+ me React import automatic
      'react/react-in-jsx-scope': 'off',
      'jsx-a11y/anchor-is-valid': 'warn', // <a> tags valid hone chahiye
      'jsx-a11y/alt-text': 'warn', // images me alt attribute
      '@typescript-eslint/strict-boolean-expressions': 'off', // boolean expressions strict
      'react-hooks/rules-of-hooks': 'error', // hooks rules follow karo
      'react-hooks/exhaustive-deps': 'warn', // useEffect dependencies
    },
  },
]
