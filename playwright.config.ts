import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: 'test-results',
  reporter: 'list',
  workers: 2,
  globalSetup: './tests/e2e/global-setup.ts',
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  expect: {
    timeout: 10000,
  },
  webServer: {
    command: 'npm run dev -- -p 3001',
    url: 'http://localhost:3001/api/health',
    reuseExistingServer: false,
    timeout: 60000,
    env: {
      TURSO_URL: 'file:./test.db',
      TURSO_AUTH_TOKEN: '',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
