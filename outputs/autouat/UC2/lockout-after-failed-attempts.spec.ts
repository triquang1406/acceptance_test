describe('Lockout after failed attempts', () => {
  const username = 'validUsername'; // Replace with a valid username for testing
  const password = '123456'; // Default password

  beforeEach(() => {
    cy.visit('/iTrust2/login'); // Visit the login page before each test
  });

  it('User exceeds maximum login attempts', () => {
    // Attempt to log in with incorrect password 3 times
    for (let i = 0; i < 3; i++) {
      cy.get('#username').type(username);
      cy.get('#password').type('wrongPassword'); // Incorrect password
      cy.get('button[type="submit"]').click();
      cy.contains('Login failed').should('be.visible'); // Adjust message as per actual implementation
    }

    // Check if the account is locked
    cy.contains('Your account is locked for 60 minutes').should('be.visible'); // Adjust message as per actual implementation
  });

  it('User exceeds IP address login attempts', () => {
    // Attempt to log in from the same IP address with incorrect credentials 6 times
    for (let i = 0; i < 6; i++) {
      cy.get('#username').type(username);
      cy.get('#password').type('wrongPassword'); // Incorrect password
      cy.get('button[type="submit"]').click();
      cy.contains('Login failed').should('be.visible'); // Adjust message as per actual implementation
    }

    // Check if the IP address is locked
    cy.contains('Your IP address is locked for 60 minutes').should('be.visible'); // Adjust message as per actual implementation
  });

  it('User attempts to log in after account lockout period', () => {
    // Simulate waiting for the lockout period to expire
    cy.wait(3600000); // Wait for 60 minutes (3600000 ms)

    // Attempt to log in again
    cy.get('#username').type(username);
    cy.get('#password').type(password); // Correct password
    cy.get('button[type="submit"]').click();

    // Check if the user can log in
    cy.url().should('not.include', '/iTrust2/login'); // Ensure the user is redirected away from the login page
  });

  it('User attempts to log in after IP address lockout period', () => {
    // Simulate waiting for the lockout period to expire
    cy.wait(3600000); // Wait for 60 minutes (3600000 ms)

    // Attempt to log in again
    cy.get('#username').type(username);
    cy.get('#password').type(password); // Correct password
    cy.get('button[type="submit"]').click();

    // Check if the user can log in
    cy.url().should('not.include', '/iTrust2/login'); // Ensure the user is redirected away from the login page
  });

  it('User attempts to log in with correct credentials after lockout', () => {
    // Simulate waiting for the lockout period to expire
    cy.wait(3600000); // Wait for 60 minutes (3600000 ms)

    // Attempt to log in with correct credentials
    cy.get('#username').type(username);
    cy.get('#password').type(password); // Correct password
    cy.get('button[type="submit"]').click();

    // Check if the user is successfully logged in
    cy.url().should('not.include', '/iTrust2/login'); // Ensure the user is redirected away from the login page
  });

  it('User attempts to log in with incorrect credentials after lockout', () => {
    // Simulate waiting for the lockout period to expire
    cy.wait(3600000); // Wait for 60 minutes (3600000 ms)

    // Attempt to log in with incorrect password
    cy.get('#username').type(username);
    cy.get('#password').type('wrongPassword'); // Incorrect password
    cy.get('button[type="submit"]').click();

    // Check if the login failed
    cy.contains('Login failed').should('be.visible'); // Adjust message as per actual implementation
  });

  it('User attempts to log in with incorrect credentials after multiple failed attempts', () => {
    // Simulate 2 failed attempts
    for (let i = 0; i < 2; i++) {
      cy.get('#username').type(username);
      cy.get('#password').type('wrongPassword'); // Incorrect password
      cy.get('button[type="submit"]').click();
      cy.contains('Login failed').should('be.visible'); // Adjust message as per actual implementation
    }

    // Attempt to log in with incorrect password again
    cy.get('#username').type(username);
    cy.get('#password').type('wrongPassword'); // Incorrect password
    cy.get('button[type="submit"]').click();

    // Check if the login failed
    cy.contains('Login failed').should('be.visible'); // Adjust message as per actual implementation
  });

  it('User attempts to log in with incorrect credentials after reaching maximum attempts', () => {
    // Simulate 3 failed attempts
    for (let i = 0; i < 3; i++) {
      cy.get('#username').type(username);
      cy.get('#password').type('wrongPassword'); // Incorrect password
      cy.get('button[type="submit"]').click();
      cy.contains('Login failed').should('be.visible'); // Adjust message as per actual implementation
    }

    // Check if the account is locked
    cy.contains('Your account is locked for 60 minutes').should('be.visible'); // Adjust message as per actual implementation
  });
});