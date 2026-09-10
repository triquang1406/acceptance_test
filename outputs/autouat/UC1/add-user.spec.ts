describe('Add User', () => {
  beforeEach(() => {
    // Log in as Admin before each test
    cy.loginAsAdmin();
    // Navigate to the Manage Users page
    cy.visit('/iTrust2/admin/users');
  });

  it('Successfully create a new user with valid data', () => {
    // Fill in the user name
    cy.get('#username').type('validUser1');
    // Fill in the password
    cy.get('#password').type('Password123');
    // Fill in the confirm password
    cy.get('#password2').type('Password123');
    // Select the role "Patient"
    cy.get('#Patient').check();
    // Set the enabled status to true
    cy.get('input[name="enabled"]').check();
    // Submit the form
    cy.get('#submit').click();
    // Assert success message is displayed
    cy.contains('User created successfully').should('be.visible');
  });

  it('Fail to create a user with a user name that is too short', () => {
    cy.get('#username').type('abc');
    cy.get('#password').type('Password123');
    cy.get('#password2').type('Password123');
    cy.get('#Patient').check();
    cy.get('input[name="enabled"]').check();
    cy.get('#submit').click();
    cy.contains('User name must be between 6 and 20 characters').should('be.visible');
  });

  it('Fail to create a user with a user name that is too long', () => {
    cy.get('#username').type('thisIsAVeryLongUserName');
    cy.get('#password').type('Password123');
    cy.get('#password2').type('Password123');
    cy.get('#Patient').check();
    cy.get('input[name="enabled"]').check();
    cy.get('#submit').click();
    cy.contains('User name must be between 6 and 20 characters').should('be.visible');
  });

  it('Fail to create a user with invalid characters in user name', () => {
    cy.get('#username').type('invalid@user');
    cy.get('#password').type('Password123');
    cy.get('#password2').type('Password123');
    cy.get('#Patient').check();
    cy.get('input[name="enabled"]').check();
    cy.get('#submit').click();
    cy.contains('User name can only contain alpha characters, - or _').should('be.visible');
  });

  it('Fail to create a user with a password that is too short', () => {
    cy.get('#username').type('validUser1');
    cy.get('#password').type('123');
    cy.get('#password2').type('123');
    cy.get('#Patient').check();
    cy.get('input[name="enabled"]').check();
    cy.get('#submit').click();
    cy.contains('Password must be between 6 and 20 characters').should('be.visible');
  });

  it('Fail to create a user with a password that is too long', () => {
    cy.get('#username').type('validUser1');
    cy.get('#password').type('thisPasswordIsWayTooLong123');
    cy.get('#password2').type('thisPasswordIsWayTooLong123');
    cy.get('#Patient').check();
    cy.get('input[name="enabled"]').check();
    cy.get('#submit').click();
    cy.contains('Password must be between 6 and 20 characters').should('be.visible');
  });

  it('Fail to create a user with mismatched passwords', () => {
    cy.get('#username').type('validUser1');
    cy.get('#password').type('Password123');
    cy.get('#password2').type('DifferentPassword');
    cy.get('#Patient').check();
    cy.get('input[name="enabled"]').check();
    cy.get('#submit').click();
    cy.contains('Passwords do not match').should('be.visible');
  });

  it('Fail to create a user without selecting a role', () => {
    cy.get('#username').type('validUser1');
    cy.get('#password').type('Password123');
    cy.get('#password2').type('Password123');
    cy.get('input[name="enabled"]').check();
    cy.get('#submit').click();
    cy.contains('Role is required').should('be.visible');
  });

  it('Fail to create a user with an invalid role', () => {
    cy.get('#username').type('validUser1');
    cy.get('#password').type('Password123');
    cy.get('#password2').type('Password123');
    cy.get('#InvalidRole').check(); // Attempt to check an invalid role
    cy.get('input[name="enabled"]').check();
    cy.get('#submit').click();
    cy.contains('Invalid role selected').should('be.visible');
  });
});