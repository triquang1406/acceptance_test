import { defineConfig } from 'cypress'

// Cypress chay toan bo spec do Step 2 sinh ra (outputs/autouat/UCn/*.spec.ts).
// Yeu cau: app iTrust2 dang chay o http://localhost:8080/iTrust2
// Dung 127.0.0.1 thay cho localhost: tren may nay "localhost" mat ~21s de phan giai.
export default defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:8080',
    specPattern: ['outputs/autouat/**/*.spec.ts'],
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: false,
    video: false,
    screenshotOnRunFailure: false,
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 30000,
    chromeWebSecurity: false,
    viewportWidth: 1280,
    viewportHeight: 800,
  },
})
