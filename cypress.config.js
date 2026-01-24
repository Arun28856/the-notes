// cypress.config.js
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // CHANGE THIS to your Render URL
    baseUrl: 'https://the-notes.onrender.com', // Replace with your actual Render URL
    
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