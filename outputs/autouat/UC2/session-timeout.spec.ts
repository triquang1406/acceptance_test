describe('Session Timeout', () => {
  
  // Scenario: User session times out after ten minutes of inactivity
  it('User session times out after ten minutes of inactivity', () => {
    cy.login('hcp'); // Log in as a healthcare provider
    cy.wait(600000); // Wait for 10 minutes (600000 ms)
    
    // Check if the user is redirected to the login page
    cy.url().should('include', '/iTrust2/login');
    cy.contains('Your session has timed out due to inactivity').should('be.visible');
  });

  // Scenario: User attempts to access a protected resource after session timeout
  it('User attempts to access a protected resource after session timeout', () => {
    cy.visit('/iTrust2/login'); // Attempt to access a protected resource
    cy.url().should('include', '/iTrust2/login'); // Should be redirected to login page
    cy.contains('Please log in to continue').should('be.visible'); // Check for the message
  });

  // Scenario: User session remains active with activity within ten minutes
  it('User session remains active with activity within ten minutes', () => {
    cy.login('hcp'); // Log in as a healthcare provider
    cy.wait(540000); // Wait for 9 minutes (540000 ms)
    cy.get('#passwordResetRequest').click(); // Perform an action (clicking a button)
    
    // Check that the user is still logged in and not redirected
    cy.url().should('not.include', '/iTrust2/login');
  });

  // Scenario: User session resets authentication after ten minutes of inactivity
  it('User session resets authentication after ten minutes of inactivity', () => {
    cy.login('hcp'); // Log in as a healthcare provider
    cy.wait(600000); // Wait for 10 minutes (600000 ms)
    
    // Attempt to perform an action after timeout
    cy.get('#passwordResetRequest').click(); // Attempt to click a button
    cy.contains('Your session has timed out. Please log in again.').should('be.visible'); // Check for timeout message
  });

  // Scenario: User session timeout notification before termination
  it('User session timeout notification before termination', () => {
    cy.login('hcp'); // Log in as a healthcare provider
    cy.wait(540000); // Wait for 9 minutes (540000 ms)
    
    // Check for the timeout notification
    cy.contains('Your session will expire in 1 minute due to inactivity').should('be.visible');
  });

  // Scenario: User logs back in after session timeout
  it('User logs back in after session timeout', () => {
    cy.login('hcp'); // Log in as a healthcare provider
    cy.wait(600000); // Wait for 10 minutes (600000 ms)
    
    // Log in again after timeout
    cy.get('#username').type('hcp'); // Enter username
    cy.get('#password').type('123456'); // Enter password
    cy.get('button[type="submit"]').click(); // Submit the login form
    
    // Check if redirected to homepage
    cy.url().should('not.include', '/iTrust2/login');
    cy.contains('Welcome back!').should('be.visible'); // Check for welcome message
  });

  // Scenario: User session timeout with multiple tabs open
  it('User session timeout with multiple tabs open', () => {
    cy.login('hcp'); // Log in as a healthcare provider
    cy.wait(600000); // Wait for 10 minutes (600000 ms)
    
    // Open a new tab and check if the session is still active
    cy.visit('/iTrust2/login'); // Attempt to access a protected resource in a new tab
    cy.url().should('include', '/iTrust2/login'); // Should be redirected to login page
  });
});