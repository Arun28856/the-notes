// cypress/e2e/spec.cy.js

// ============================================
// FIREBASE AUTHENTICATION TESTS
// ============================================

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
      cy.contains('The Notes').should('be.visible');
      cy.get('input[id="email"]').should('be.visible');
      cy.get('input[id="password"]').should('be.visible');
      cy.toggleAuthMode('signup');
      cy.contains('Create your account').should('be.visible');
    });

    it('should successfully sign up a new user', () => {
      cy.signUp(testEmail, testPassword);
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.verifyLoggedIn();
    });

    it('should show error for invalid email format', () => {
      cy.goToAuth();
      cy.toggleAuthMode('signup');
      cy.get('input[id="email"]').clear().type(invalidEmail);
      cy.get('input[id="password"]').clear().type(testPassword);
      cy.contains('button', 'Sign Up').click();
      cy.wait(2000);
      cy.get('input[id="email"]:invalid').should('exist');
    });

    it('should show error for password less than 6 characters', () => {
      cy.goToAuth();
      cy.toggleAuthMode('signup');
      cy.get('input[id="email"]').clear().type(`test-${Date.now()}@example.com`);
      cy.get('input[id="password"]').clear().type(shortPassword);
      cy.contains('button', 'Sign Up').click();
      cy.wait(2000);
      cy.get('body').should('contain', 'Password must be at least 6 characters');
    });
  });

  describe('Login Flow', () => {
    beforeEach(() => {
      cy.signUp(testEmail, testPassword);
      cy.logout();
    });

    it('should display login form correctly', () => {
      cy.goToAuth();
      cy.contains('Welcome back!').should('be.visible');
      cy.get('input[id="email"]').should('be.visible');
      cy.get('input[id="password"]').should('be.visible');
    });

    it('should successfully log in with valid credentials', () => {
      cy.login(testEmail, testPassword);
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.verifyLoggedIn();
    });

    it('should show error for incorrect password', () => {
      cy.goToAuth();
      cy.get('input[id="email"]').clear().type(testEmail);
      cy.get('input[id="password"]').clear().type('wrongpassword');
      cy.contains('button', 'Sign In').click();
      cy.wait(3000);
      cy.get('body').should('contain', 'Incorrect password');
    });
  });

  describe('Logout Flow', () => {
    beforeEach(() => {
      cy.signUp(testEmail, testPassword);
    });

    it('should successfully log out user', () => {
      cy.verifyLoggedIn();
      cy.logout();
      cy.verifyLoggedOut();
    });
  });
});

// ============================================
// NOTES CRUD TESTS
// ============================================

describe('The Notes - Complete CRUD Cycle', () => {
  before(() => {
    cy.log('🚀 Starting app...');
    cy.visit('/', { timeout: 120000, failOnStatusCode: false });
    cy.window({ timeout: 90000 }).should('exist');
    cy.get('body', { timeout: 60000 }).should('be.visible');
    cy.wait(5000);
  });

  it('should perform complete CRUD operations', () => {
    cy.log('1️⃣ CREATE - Creating new note...');
    cy.wait(3000);
    cy.contains('a', 'New Note').click();
    cy.wait(2000);
    cy.get('input[placeholder="Untitled"]').type('CRUD Test Note');
    cy.get('textarea[placeholder="Start writing here..."]').type('This is a CRUD test');
    cy.contains('button', 'Save').click();
    cy.wait(3000);
    cy.contains('.card-title', 'CRUD Test Note').should('be.visible');
    cy.log('✅ CREATE successful');
    
    cy.log('2️⃣ READ - Reading note details...');
    cy.wait(3000);
    cy.contains('.card-title', 'CRUD Test Note').parents('.card').click();
    cy.wait(2000);
    cy.get('input[type="text"]').should('have.value', 'CRUD Test Note');
    cy.get('textarea').should('contain.value', 'This is a CRUD test');
    cy.log('✅ READ successful');
    
    cy.log('3️⃣ UPDATE - Updating note...');
    cy.wait(3000);
    cy.get('input[type="text"]').clear().type('Updated CRUD Note');
    cy.get('textarea').clear().type('Updated CRUD content');
    cy.contains('button', 'Save').click();
    cy.wait(3000);
    cy.contains('.card-title', 'Updated CRUD Note').should('be.visible');
    cy.log('✅ UPDATE successful');
    
    cy.log('4️⃣ DELETE - Deleting note...');
    cy.wait(3000);
    cy.contains('.card-title', 'Updated CRUD Note').parents('.card').click();
    cy.wait(2000);
    cy.contains('button', 'Delete').click();
    cy.wait(3000);
    cy.contains('.card-title', 'Updated CRUD Note').should('not.exist');
    cy.log('✅ DELETE successful');
    cy.log('🎉 All CRUD operations completed successfully!');
  });
});
