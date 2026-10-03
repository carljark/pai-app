import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Los tests existentes cubren el flujo con Gemini; los de Gemini desactivado cambian la variable
    env: { GEMINI_ENABLED: 'true' },
    fileParallelism: false,
    sequence: {
      concurrent: false
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['src/migrations/**', 'src/tests/**'],
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90
      }
    }
  }
});
