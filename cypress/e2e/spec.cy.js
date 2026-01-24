// cypress/e2e/notes-simple.cy.js

describe('The Notes - Complete CRUD Cycle', () => {
  
  before(() => {
    cy.log('🚀 Starting app...');
    cy.visit('/', { timeout: 120000, failOnStatusCode: false });
    cy.window({ timeout: 90000 }).should('exist');
    cy.get('body', { timeout: 60000 }).should('be.visible');
    cy.wait(5000);
  });

  it('should perform complete CRUD operations', () => {
    // ===== CREATE =====
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
    
    // ===== READ =====
    cy.log('2️⃣ READ - Reading note details...');
    cy.wait(3000);
    
    cy.contains('.card-title', 'CRUD Test Note')
      .parents('.card')
      .click();
    cy.wait(2000);
    
    cy.get('input[type="text"]').should('have.value', 'CRUD Test Note');
    cy.get('textarea').should('contain.value', 'This is a CRUD test');
    cy.log('✅ READ successful');
    
    // ===== UPDATE =====
    cy.log('3️⃣ UPDATE - Updating note...');
    cy.wait(3000);
    
    cy.get('input[type="text"]').clear().type('Updated CRUD Note');
    cy.get('textarea').clear().type('Updated CRUD content');
    cy.contains('button', 'Save').click();
    cy.wait(3000);
    
    cy.contains('.card-title', 'Updated CRUD Note').should('be.visible');
    cy.log('✅ UPDATE successful');
    
    // ===== DELETE =====
    cy.log('4️⃣ DELETE - Deleting note...');
    cy.wait(3000);
    
    cy.contains('.card-title', 'Updated CRUD Note')
      .parents('.card')
      .click();
    cy.wait(2000);
    
    cy.contains('button', 'Delete').click();
    cy.wait(3000);
    
    cy.contains('.card-title', 'Updated CRUD Note').should('not.exist');
    cy.log('✅ DELETE successful');
    
    cy.log('🎉 All CRUD operations completed successfully!');
  });
});