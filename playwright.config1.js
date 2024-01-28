// @ts-check
const { defineConfig, devices } = require('@playwright/test');


/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  retries: 1,
  workers: 3,
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  projects: [
    {
      name: 'Safari',
      use: {
        browserName: 'webkit',
        headless: false,
        screenshot : 'only-on-failure',
        trace: 'retain-on-failure',
        ...devices['iPhone 11']
      }
    },
    {
      name : 'Chrome',
      use: {
        browserName: 'chromium',
        headless: false,
        screenshot : 'only-on-failure',
        video : 'retain-on-failure',
        ignoreHTTPSErrors: true,
        permissions: ['geolocation'],
        trace: 'retain-on-failure',
        viewport : {width:720, height:720}
      }
    }

  ]
});