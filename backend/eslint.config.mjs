import eslintCodeGuideline from '@code-guideline/eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files:           ['**/*.{js,mjs,cjs}'],
    languageOptions: { parserOptions: { project: null } },
  },
  {
    files:           ['**/*.{ts,tsx}'],
    languageOptions: { parserOptions: {
      projectService:  true,
      tsconfigRootDir: import.meta.dirname,
    } },
  },
  { ignores: ['packages/database/client/**'] },
  ...eslintCodeGuideline('nestjs'),
]);
