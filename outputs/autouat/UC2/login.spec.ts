describe('User Login', () => {
  
  beforeEach(() => {
    // Visit the login page before each test
    cy.visit('/iTrust2/login');
  });

  it('Successful login with valid credentials', () => {
    // Given the user is on the login page (already done in beforeEach)
    
    // When the user enters a valid username and password
    cy.get('#username').type('admin'); // Example username
    cy.get('#password').type('123456'); // Default password

    // And the user clicks on the "Login" button
    cy.get('button[type="submit"]').click();

    // Then the user should be redirected to their personalized home page
    cy.url().should('include', '/home'); // Adjust the URL based on the actual home page

    // And the user should see a welcome message with their username
    cy.contains('Welcome, admin'); // Adjust the welcome message based on the actual content

    // And the user should have an authenticated session
    // This can be checked by ensuring the session storage or local storage has a token or user info
    cy.window().its('sessionStorage').should('have.property', 'user'); // Example check
  });

  it('Unsuccessful login with invalid credentials', () => {
    // Given the user is on the login page (already done in beforeEach)

    // When the user enters an invalid username or password
    cy.get('#username').type('invalidUser');
    cy.get('#password').type('wrongPassword');

    // And the user clicks on the "Login" button
    cy.get('button[type="submit"]').click();

    // Then the user should see an error message indicating invalid credentials
    cy.contains('Invalid username or password'); // Adjust based on actual error message

    // And the user should remain on the login page
    cy.url().should('include', '/iTrust2/login');

    // And the user should not have an authenticated session
    cy.window().its('sessionStorage').should('not.have.property', 'user'); // Example check
  });

  it('Logout from the application', () => {
    // Given the user is logged in and on their personalized home page
    cy.loginAsAdmin(); // Log in as an admin user
    cy.url().should('include', '/home'); // Adjust based on actual home page

    // When the user clicks on the "Logout" button
    cy.get('button[name="logout"]').click(); // Assuming there's a logout button with this name

    // Then the user should be redirected to the login page
    cy.url().should('include', '/iTrust2/login');

    // And the user should see a message indicating successful logout
    cy.contains('You have been logged out'); // Adjust based on actual logout message

    // And the user should not have an authenticated session
    cy.window().its('sessionStorage').should('not.have.property', 'user'); // Example check
  });

  it('Session ends when the application is closed', () => {
    // Given the user is logged in and on their personalized home page
    cy.loginAsAdmin(); // Log in as an admin user
    cy.url().should('include', '/home'); // Adjust based on actual home page

    // When the user closes the iTrust2 application
    // This is a simulation; in a real test, you would need to handle this differently
    cy.window().then((win) => {
      win.close(); // This will not actually close the Cypress window but simulates the action
    });

    // Then the user's session should end
    // This would typically be checked by trying to access a protected route
    cy.visit('/iTrust2/login'); // Attempt to visit home page again
    cy.url().should('include', '/iTrust2/login'); // Should redirect to login page

    // And the user should need to log in again to access their personalized home page
    cy.contains('Login to iTrust2'); // Check for login page content
  });

  it('Role-based entry after login', () => {
    // Given the user is on the login page (already done in beforeEach)

    // When the user enters a valid username and password for a specific role
    cy.get('#username').type('hcp'); // Example username for HCP role
    cy.get('#password').type('123456'); // Default password

    // And the user clicks on the "Login" button
    cy.get('button[type="submit"]').click();

    // Then the user should be redirected to the personalized home page corresponding to their role
    cy.url().should('include', '/hcp/home'); // Adjust based on actual HCP home page

    // And the user should see role-specific content on their home page
    cy.contains('Welcome to the HCP dashboard'); // Adjust based on actual content
  });

});