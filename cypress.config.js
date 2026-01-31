// cypress.config.js
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // Use localhost for local development, or Render URL for production testing
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:5173',
    
    // Spec file pattern
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    
    // Important for public hosting
    chromeWebSecurity: false, // Allows testing cross-origin content
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});