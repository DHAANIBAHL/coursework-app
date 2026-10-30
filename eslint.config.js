import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Course content comes from the catalog API, not the hardcoded files.
    files: ['src/**/*.{js,jsx}'],
    ignores: ['src/data/**'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['@/data/*', '**/data/courses', '**/data/courses.js', '**/data/course-content/*'],
          message: 'Course content comes from the catalog API: use useCatalog() or useCourse() from @/lib/catalog, not src/data/.',
        }],
      }],
    },
  },
])
