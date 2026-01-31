// cypress/support/commands.js

// ============================================
// CUSTOM COMMANDS FOR NOTES APP CRUD OPERATIONS
// ============================================

/**
 * Create a new note
 * @param {string} title - Note title
 * @param {string} content - Note content
 * @example cy.createNote('My Note', 'Note content here')
 */
/**
 * Wake up Render app (handles cold starts)
 * @example cy.wakeUpRender()
 */
Cypress.Commands.add('wakeUpRender', () => {
  cy.log('⏳ Waking up Render app (this may take 30-60 seconds)...');
  
  cy.visit('/', { 
    timeout: 120000,           // 2 minute timeout
    failOnStatusCode: false,   // Don't fail on 503
    retryOnStatusCodeFailure: true,
    retryOnNetworkFailure: true
  });
  
  // Wait for window to exist
  cy.window({ timeout: 90000 }).should('exist');
  
  // Wait for body to be visible
  cy.get('body', { timeout: 60000 }).should('be.visible');
  
  // Extra buffer for app initialization
  cy.wait(3000);
  
  cy.log('✅ Render app is fully awake and ready!');
});

// ============================================
// RATE LIMIT HANDLING
// ============================================

/**
 * Wait to avoid rate limiting
 * @param {number} ms - Milliseconds to wait (default: 1000)
 */
Cypress.Commands.add('waitForRateLimit', (ms = 1000) => {
  cy.wait(ms);
  cy.log(`⏳ Waiting ${ms}ms to avoid rate limit`);
});


Cypress.Commands.add('createNote', (title, content) => {
  // Click create/add button
  cy.get('[data-cy="add-note-btn"]').click();
  
  // Fill in the form
  cy.get('[data-cy="note-title"]').clear().type(title);
  cy.get('[data-cy="note-content"]').clear().type(content);
  
  // Submit the form
  cy.get('[data-cy="save-note-btn"]').click();
  
  // Wait for note to appear in list
  cy.contains('[data-cy="note-item"]', title).should('be.visible');
  
  // Log for debugging
  cy.log(`✅ Created note: "${title}"`);
});

/**
 * Read/verify a note exists
 * @param {string} title - Note title to search for
 * @example cy.readNote('My Note')
 */
Cypress.Commands.add('readNote', (title) => {
  cy.contains('[data-cy="note-item"]', title)
    .should('be.visible')
    .click();
  
  // Verify note details are displayed
  cy.get('[data-cy="note-detail-title"]').should('contain', title);
  
  cy.log(`✅ Read note: "${title}"`);
});

/**
 * Update/edit an existing note
 * @param {string} oldTitle - Current note title
 * @param {string} newTitle - New title
 * @param {string} newContent - New content
 * @example cy.updateNote('Old Title', 'New Title', 'New content')
 */
Cypress.Commands.add('updateNote', (oldTitle, newTitle, newContent) => {
  // Find and click the note
  cy.contains('[data-cy="note-item"]', oldTitle).click();
  
  // Click edit button
  cy.get('[data-cy="edit-note-btn"]').click();
  
  // Update fields
  cy.get('[data-cy="note-title"]').clear().type(newTitle);
  cy.get('[data-cy="note-content"]').clear().type(newContent);
  
  // Save changes
  cy.get('[data-cy="save-note-btn"]').click();
  
  // Verify update
  cy.contains('[data-cy="note-item"]', newTitle).should('be.visible');
  
  cy.log(`✅ Updated note: "${oldTitle}" → "${newTitle}"`);
});

/**
 * Delete a note
 * @param {string} title - Note title to delete
 * @example cy.deleteNote('My Note')
 */
Cypress.Commands.add('deleteNote', (title) => {
  // Find and click the note
  cy.contains('[data-cy="note-item"]', title).click();
  
  // Click delete button
  cy.get('[data-cy="delete-note-btn"]').click();
  
  // Confirm deletion (if there's a confirmation dialog)
  cy.get('[data-cy="confirm-delete-btn"]').click();
  
  // Verify note is removed
  cy.contains('[data-cy="note-item"]', title).should('not.exist');
  
  cy.log(`✅ Deleted note: "${title}"`);
});

/**
 * Delete all notes (cleanup)
 * @example cy.deleteAllNotes()
 */
Cypress.Commands.add('deleteAllNotes', () => {
  cy.get('body').then(($body) => {
    // Check if any notes exist
    if ($body.find('[data-cy="note-item"]').length > 0) {
      // Get all notes and delete them
      cy.get('[data-cy="note-item"]').each(($note) => {
        cy.wrap($note).click();
        cy.get('[data-cy="delete-note-btn"]').click();
        cy.get('[data-cy="confirm-delete-btn"]').click();
      });
    }
  });
  
  // Verify all notes are gone
  cy.get('[data-cy="note-item"]').should('not.exist');
  
  cy.log('✅ Deleted all notes');
});

/**
 * Search for notes
 * @param {string} searchTerm - Term to search for
 * @example cy.searchNotes('important')
 */
Cypress.Commands.add('searchNotes', (searchTerm) => {
  cy.get('[data-cy="search-input"]').clear().type(searchTerm);
  
  // Wait for search results
  cy.wait(500); // Debounce delay
  
  cy.log(`✅ Searched for: "${searchTerm}"`);
});

/**
 * Verify note count
 * @param {number} expectedCount - Expected number of notes
 * @example cy.verifyNoteCount(5)
 */
Cypress.Commands.add('verifyNoteCount', (expectedCount) => {
  if (expectedCount === 0) {
    cy.get('[data-cy="note-item"]').should('not.exist');
  } else {
    cy.get('[data-cy="note-item"]').should('have.length', expectedCount);
  }
  
  cy.log(`✅ Verified note count: ${expectedCount}`);
});

/**
 * Create multiple notes from array
 * @param {Array} notes - Array of note objects [{title, content}]
 * @example cy.createMultipleNotes([{title: 'Note 1', content: 'Content 1'}])
 */
Cypress.Commands.add('createMultipleNotes', (notes) => {
  notes.forEach((note) => {
    cy.createNote(note.title, note.content);
  });
  
  cy.log(`✅ Created ${notes.length} notes`);
});

/**
 * Verify note exists with specific content
 * @param {string} title - Note title
 * @param {string} content - Expected content
 * @example cy.verifyNoteContent('My Note', 'Expected content')
 */
Cypress.Commands.add('verifyNoteContent', (title, content) => {
  cy.contains('[data-cy="note-item"]', title).click();
  cy.get('[data-cy="note-detail-title"]').should('contain', title);
  cy.get('[data-cy="note-detail-content"]').should('contain', content);
  
  cy.log(`✅ Verified content for: "${title}"`);
});

/**
 * Toggle note favorite/pin status
 * @param {string} title - Note title
 * @example cy.toggleNoteFavorite('My Note')
 */
Cypress.Commands.add('toggleNoteFavorite', (title) => {
  cy.contains('[data-cy="note-item"]', title).click();
  cy.get('[data-cy="favorite-btn"]').click();
  
  cy.log(`✅ Toggled favorite for: "${title}"`);
});

/**
 * Filter notes by category/tag
 * @param {string} category - Category to filter by
 * @example cy.filterByCategory('Work')
 */
Cypress.Commands.add('filterByCategory', (category) => {
  cy.get('[data-cy="category-filter"]').select(category);
  
  cy.log(`✅ Filtered by category: "${category}"`);
});

/**
 * Sort notes
 * @param {string} sortBy - Sort option (date, title, etc.)
 * @example cy.sortNotes('title')
 */
Cypress.Commands.add('sortNotes', (sortBy) => {
  cy.get('[data-cy="sort-select"]').select(sortBy);
  
  cy.log(`✅ Sorted by: "${sortBy}"`);
});

// ============================================
// UTILITY COMMANDS
// ============================================

/**
 * Wait for API call to complete
 * @param {string} alias - Request alias
 * @example cy.waitForAPI('@createNote')
 */
Cypress.Commands.add('waitForAPI', (alias) => {
  cy.wait(alias).its('response.statusCode').should('eq', 200);
});

/**
 * Take screenshot with custom name
 * @param {string} name - Screenshot name
 * @example cy.takeScreenshot('after-create')
 */
Cypress.Commands.add('takeScreenshot', (name) => {
  cy.screenshot(name);
});

/**
 * Check for error messages
 * @param {string} expectedError - Expected error message
 * @example cy.checkError('Note title is required')
 */
Cypress.Commands.add('checkError', (expectedError) => {
  cy.get('[data-cy="error-message"]').should('contain', expectedError);
});

/**
 * Clear all local storage and cookies (full reset)
 * @example cy.fullReset()
 */
Cypress.Commands.add('fullReset', () => {
  cy.clearLocalStorage();
  cy.clearCookies();
  
  // Delete all notes via UI
  cy.visit('/');
  cy.deleteAllNotes();
  
  cy.log('✅ Full reset completed');
});

/**
 * Close note detail view (go back to list)
 * @example cy.closeNoteDetail()
 */
Cypress.Commands.add('closeNoteDetail', () => {
  cy.get('[data-cy="close-note-btn"]').click();
  cy.log('✅ Closed note detail view');
});

/**
 * Check if note exists in list
 * @param {string} title - Note title to check
 * @example cy.noteExists('My Note')
 */
Cypress.Commands.add('noteExists', (title) => {
  cy.contains('[data-cy="note-item"]', title).should('exist');
  cy.log(`✅ Verified note exists: "${title}"`);
});

/**
 * Check if note does NOT exist in list
 * @param {string} title - Note title to check
 * @example cy.noteNotExists('Deleted Note')
 */
Cypress.Commands.add('noteNotExists', (title) => {
  cy.contains('[data-cy="note-item"]', title).should('not.exist');
  cy.log(`✅ Verified note does not exist: "${title}"`);
});

/**
 * Cancel note creation/editing
 * @example cy.cancelNoteForm()
 */
Cypress.Commands.add('cancelNoteForm', () => {
  cy.get('[data-cy="cancel-btn"]').click();
  cy.log('✅ Cancelled note form');
});

/**
 * Verify empty state is shown
 * @example cy.verifyEmptyState()
 */
Cypress.Commands.add('verifyEmptyState', () => {
  cy.get('[data-cy="empty-state"]').should('be.visible');
  cy.get('[data-cy="empty-state"]').should('contain', 'No notes');
  cy.log('✅ Verified empty state is shown');
});

/**
 * Get note by index from list
 * @param {number} index - Index of note (0-based)
 * @example cy.getNoteByIndex(0)
 */
Cypress.Commands.add('getNoteByIndex', (index) => {
  cy.get('[data-cy="note-item"]').eq(index);
  cy.log(`✅ Got note at index: ${index}`);
});

// ============================================
// FIREBASE AUTHENTICATION COMMANDS
// ============================================

/**
 * Sign up a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @example cy.signUp('test@example.com', 'password123')
 */
Cypress.Commands.add('signUp', (email, password) => {
  cy.visit('/auth');
  cy.get('input[id="email"]', { timeout: 15000 }).should('be.visible');
  
  // Check if we're on signup mode, if not, toggle to signup
  cy.get('body').then(($body) => {
    if ($body.text().includes("Welcome back!")) {
      cy.contains('button', 'Sign Up').click();
      cy.contains('Create your account').should('be.visible');
    }
  });
  
  cy.get('input[id="email"]').clear().type(email);
  cy.get('input[id="password"]').clear().type(password);
  cy.contains('button', 'Sign Up').click();
  cy.wait(3000);
  
  cy.get('body').should('not.contain', 'Processing...');
  cy.url().should('eq', Cypress.config().baseUrl + '/');
  
  cy.log(`✅ Signed up user: ${email}`);
});

/**
 * Log in an existing user
 * @param {string} email - User email
 * @param {string} password - User password
 * @example cy.login('test@example.com', 'password123')
 */
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/auth');
  cy.get('input[id="email"]', { timeout: 15000 }).should('be.visible');
  
  // Check if we're on login mode, if not, toggle to login
  cy.get('body').then(($body) => {
    if ($body.text().includes("Create your account")) {
      cy.contains('button', 'Sign In').click();
      cy.contains('Welcome back!').should('be.visible');
    }
  });
  
  cy.get('input[id="email"]').clear().type(email);
  cy.get('input[id="password"]').clear().type(password);
  cy.contains('button', 'Sign In').click();
  cy.wait(3000);
  
  cy.get('body').should('not.contain', 'Processing...');
  cy.url().should('eq', Cypress.config().baseUrl + '/');
  
  cy.log(`✅ Logged in user: ${email}`);
});

/**
 * Log out the current user
 * @example cy.logout()
 */
Cypress.Commands.add('logout', () => {
  cy.get('body').then(($body) => {
    if ($body.text().includes('Logout')) {
      cy.contains('button', 'Logout').click({ force: true });
      cy.wait(2000);
      cy.contains('a', 'Login').should('be.visible');
      cy.log('✅ Logged out successfully');
    } else {
      cy.log('ℹ️ User already logged out');
    }
  });
});

/**
 * Clear Firebase auth state (localStorage, sessionStorage, and IndexedDB).
 * Firebase Auth persists in IndexedDB; without clearing it, the app stays "logged in"
 * and /auth redirects to home, so tests never see the auth form.
 * @example cy.clearAuth()
 */
Cypress.Commands.add('clearAuth', () => {
  cy.visit('/', { failOnStatusCode: false });
  cy.window().then((win) => {
    win.sessionStorage?.clear();
    win.localStorage?.clear();
    const clearIndexedDB = () => {
      if (!win.indexedDB) return Promise.resolve();
      if (win.indexedDB.databases) {
        return win.indexedDB.databases().then((dbs) =>
          Promise.all(
            (dbs || []).map(
              (db) =>
                new Promise((resolve) => {
                  const req = win.indexedDB.deleteDatabase(db.name);
                  req.onsuccess = () => resolve();
                  req.onerror = () => resolve();
                  req.onblocked = () => resolve();
                })
            )
          )
        );
      }
      // Fallback: delete known Firebase persistence DB names
      const firebaseDbNames = ['firebaseLocalStorageDb', 'firebase-heartbeat-database'];
      return Promise.all(
        firebaseDbNames.map(
          (name) =>
            new Promise((resolve) => {
              const req = win.indexedDB.deleteDatabase(name);
              req.onsuccess = () => resolve();
              req.onerror = () => resolve();
              req.onblocked = () => resolve();
            })
        )
      );
    };
    return clearIndexedDB();
  });
  cy.clearLocalStorage();
  cy.clearCookies();
  cy.reload();
  cy.log('✅ Cleared auth state (including IndexedDB)');
});

/**
 * Verify user is logged in
 * @example cy.verifyLoggedIn()
 */
Cypress.Commands.add('verifyLoggedIn', () => {
  cy.contains('button', 'Logout').should('be.visible');
  cy.contains('a', 'New Note').should('be.visible');
  cy.log('✅ Verified user is logged in');
});

/**
 * Verify user is logged out
 * @example cy.verifyLoggedOut()
 */
Cypress.Commands.add('verifyLoggedOut', () => {
  cy.contains('a', 'Login').should('be.visible');
  cy.contains('button', 'Logout').should('not.exist');
  cy.log('✅ Verified user is logged out');
});

/**
 * Navigate to auth page and wait for the form to be ready
 * @example cy.goToAuth()
 */
Cypress.Commands.add('goToAuth', () => {
  cy.visit('/auth');
  cy.contains('The Notes').should('be.visible');
  cy.get('input[id="email"]', { timeout: 15000 }).should('be.visible');
  cy.log('✅ Navigated to auth page');
});

/**
 * Toggle between login and signup modes
 * @param {string} mode - 'login' or 'signup'
 * @example cy.toggleAuthMode('signup')
 */
Cypress.Commands.add('toggleAuthMode', (mode) => {
  if (mode === 'signup') {
    cy.get('body').then(($body) => {
      if ($body.text().includes("Welcome back!")) {
        cy.contains('button', 'Sign Up').click();
        cy.wait(1000);
        cy.contains('Create your account').should('be.visible');
      }
    });
  } else if (mode === 'login') {
    cy.get('body').then(($body) => {
      if ($body.text().includes("Create your account")) {
        cy.contains('button', 'Sign In').click();
        cy.wait(1000);
        cy.contains('Welcome back!').should('be.visible');
      }
    });
  }
  cy.log(`✅ Toggled to ${mode} mode`);
});