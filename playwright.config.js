// @ts-check
const { defineConfig, devices } = require('@playwright/test');


/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  retries: 2,

  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    browserName : 'chromium',
    headless : true,
    screenshot : 'only-on-failure',
    trace: 'retain-on-failure'
  },

});