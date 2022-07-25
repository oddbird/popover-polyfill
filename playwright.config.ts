const port = process.env.PORT || 3000
export default {
  timeout: process.env.CI ? undefined : 3000, // Max execution time of any single test
  expect: {
    timeout: 1000, // Max execution time of single expect() calls
  },
  webServer: {
    command: `PORT=${port} LEVEL=warning yarn preview`,
    url: `http://localhost:${port}/`,
    timeout: 10 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: `http://localhost:${port}`,
    browserName: 'chromium',
    headless: true,
    forbidOnly: process.env.CI,
  },
}
