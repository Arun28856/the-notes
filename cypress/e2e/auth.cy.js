// cypress/e2e/auth.cy.js

// ============================================
// FIREBASE AUTHENTICATION TESTS
// ============================================
// This file contains comprehensive Firebase authentication tests
// including signup, login, logout, and form validation tests

describe('Firebase Authentication Tests', () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'testpassword123';
  const invalidEmail = 'invalid-email';
  const shortPassword = '12345';

  beforeEach(() => {
    cy.clearAuth();
    cy.log('🧹 Cleared auth state');
  });

  describe('Sign Up Flow', () => {
    it('should display signup form correctly', () => {
      cy.goToAuth();
      
      // Verify form elements are visible
      cy.contains('The Notes').should('be.visible');
      cy.get('input[id="email"]').should('be.visible');
      cy.get('input[id="password"]').should('be.visible');
      cy.contains('button', 'Sign In').should('be.visible');
      
      // Toggle to signup mode
      cy.toggleAuthMode('signup');
      cy.contains('Create your account').should('be.visible');
      cy.contains('button', 'Sign Up').should('be.visible');
      cy.contains('button', 'Sign In').should('exist'); // Toggle link
    });

    it('should successfully sign up a new user', () => {
      cy.signUp(testEmail, testPassword);
      
      // Verify successful signup - should be redirected to home
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.verifyLoggedIn();
      
      // Verify toast notification (if visible)
      cy.wait(2000);
      cy.get('body').should('not.contain', 'Processing...');
    });

    it('should show error for invalid email format', () => {
      cy.goToAuth();
      cy.toggleAuthMode('signup');
      
      cy.get('input[id="email"]').clear().type(invalidEmail);
      cy.get('input[id="password"]').clear().type(testPassword);
      cy.contains('button', 'Sign Up').click();
      cy.wait(1500);
      
      // Should show validation error toast (custom validation)
      cy.get('body').should('contain', 'valid email');
    });

    it('should show error for password less than 6 characters', () => {
      cy.goToAuth();
      cy.toggleAuthMode('signup');
      
      cy.get('input[id="email"]').clear().type(`test-${Date.now()}@example.com`);
      cy.get('input[id="password"]').clear().type(shortPassword);
      cy.contains('button', 'Sign Up').click();
      cy.wait(1500);
      
      // Should show error toast (min 6 chars and/or alphanumeric)
      cy.get('body').should('contain', '6 character');
    });

    it('should show error when email already exists', () => {
      // First, create an account
      cy.signUp(testEmail, testPassword);
      cy.logout();
      
      // Try to sign up again with same email
      cy.goToAuth();
      cy.toggleAuthMode('signup');
      cy.get('input[id="email"]').clear().type(testEmail);
      cy.get('input[id="password"]').clear().type(testPassword);
      cy.contains('button', 'Sign Up').click();
      cy.wait(3000);
      
      // Should show error about email already registered
      cy.get('body').should('contain', 'already registered');
    });

    it('should toggle between signup and login modes', () => {
      cy.goToAuth();
      
      // Should start in login mode
      cy.contains('Welcome back!').should('be.visible');
      
      // Toggle to signup
      cy.toggleAuthMode('signup');
      cy.contains('Create your account').should('be.visible');
      cy.contains('button', 'Sign Up').should('be.visible');
      
      // Toggle back to login
      cy.toggleAuthMode('login');
      cy.contains('Welcome back!').should('be.visible');
      cy.contains('button', 'Sign In').should('be.visible');
    });
  });

  describe('Login Flow', () => {
    beforeEach(() => {
      // Create a user account before login tests
      cy.signUp(testEmail, testPassword);
      cy.logout();
    });

    it('should display login form correctly', () => {
      cy.goToAuth();
      
      // Verify form elements
      cy.contains('Welcome back!').should('be.visible');
      cy.get('input[id="email"]').should('be.visible');
      cy.get('input[id="password"]').should('be.visible');
      cy.contains('button', 'Sign In').should('be.visible');
    });

    it('should successfully log in with valid credentials', () => {
      cy.login(testEmail, testPassword);
      
      // Verify successful login
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.verifyLoggedIn();
    });

    it('should show error for incorrect password', () => {
      cy.goToAuth();
      
      cy.get('input[id="email"]').clear().type(testEmail);
      cy.get('input[id="password"]').clear().type('wrongpassword');
      cy.contains('button', 'Sign In').click();
      cy.wait(3000);
      
      // Should show error
      cy.get('body').should('contain', 'Incorrect password');
    });

    it('should show error for non-existent user', () => {
      cy.goToAuth();
      
      cy.get('input[id="email"]').clear().type(`nonexistent-${Date.now()}@example.com`);
      cy.get('input[id="password"]').clear().type(testPassword);
      cy.contains('button', 'Sign In').click();
      cy.wait(3000);
      
      // Should show error
      cy.get('body').should('contain', 'No account found');
    });

    it('should show error for empty fields', () => {
      cy.goToAuth();
      
      // Try to submit with empty fields
      cy.contains('button', 'Sign In').click();
      cy.wait(1000);
      
      // Browser validation should prevent submission
      cy.get('input[id="email"]:invalid').should('exist');
    });
  });

  describe('Logout Flow', () => {
    beforeEach(() => {
      cy.signUp(testEmail, testPassword);
    });

    it('should successfully log out user', () => {
      cy.verifyLoggedIn();
      
      cy.logout();
      
      // Verify logout
      cy.verifyLoggedOut();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('should redirect to home after logout', () => {
      cy.visit('/create');
      cy.wait(2000);
      
      cy.logout();
      
      // Should be on home page
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  describe('Navigation and UI', () => {
    it('should show login button when user is logged out', () => {
      cy.visit('/');
      cy.wait(2000);
      
      cy.verifyLoggedOut();
      cy.contains('a', 'Login').should('be.visible').click();
      cy.url().should('include', '/auth');
    });

    it('should show logout and new note buttons when user is logged in', () => {
      cy.signUp(testEmail, testPassword);
      
      cy.verifyLoggedIn();
      cy.contains('a', 'New Note').should('be.visible');
      cy.contains('button', 'Logout').should('be.visible');
    });

    it('should navigate to home after successful authentication', () => {
      cy.goToAuth();
      cy.toggleAuthMode('signup');
      
      const newEmail = `test-${Date.now()}@example.com`;
      cy.get('input[id="email"]').clear().type(newEmail);
      cy.get('input[id="password"]').clear().type(testPassword);
      cy.contains('button', 'Sign Up').click();
      cy.wait(3000);
      
      // Should be redirected to home
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  describe('Form Validation', () => {
    it('should validate email format', () => {
      cy.goToAuth();
      
      cy.get('input[id="email"]').clear().type('notanemail');
      cy.get('input[id="password"]').clear().type(testPassword);
      cy.contains('button', 'Sign In').click();
      cy.wait(1500);
      
      // Either browser validation (:invalid) or custom/Firebase error message
      cy.get('body').then(($body) => {
        const hasInvalid = $body.find('input[id="email"]:invalid').length > 0;
        const hasError = $body.text().includes('valid email') || $body.text().includes('Invalid email');
        expect(hasInvalid || hasError).to.be.true;
      });
    });

    it('should require password field', () => {
      cy.goToAuth();
      
      cy.get('input[id="email"]').clear().type(`test-${Date.now()}@example.com`);
      cy.contains('button', 'Sign In').click();
      
      // Browser should show validation error
      cy.get('input[id="password"]:invalid').should('exist');
    });

    it('should show loading state during authentication', () => {
      cy.goToAuth();
      cy.toggleAuthMode('signup');
      
      const newEmail = `test-${Date.now()}@example.com`;
      cy.get('input[id="email"]').clear().type(newEmail);
      cy.get('input[id="password"]').clear().type(testPassword);
      cy.contains('button', 'Sign Up').click();
      
      // Should show loading state briefly
      cy.contains('Processing...').should('exist');
      cy.wait(3000);
      cy.contains('Processing...').should('not.exist');
    });
  });

  describe('Complete Auth Flow', () => {
    it('should complete full authentication cycle: signup -> login -> logout', () => {
      const flowEmail = `flow-${Date.now()}@example.com`;
      
      // Sign up
      cy.signUp(flowEmail, testPassword);
      cy.verifyLoggedIn();
      
      // Logout
      cy.logout();
      cy.verifyLoggedOut();
      
      // Login again
      cy.login(flowEmail, testPassword);
      cy.verifyLoggedIn();
      
      // Logout again
      cy.logout();
      cy.verifyLoggedOut();
      
      cy.log('✅ Complete auth flow test passed');
    });
  });
});
