//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  { ignores: ['eslint.config.js', 'prettier.config.js', 'vite.config.js'] },
  ...tanstackConfig,
  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    },
  },
]
