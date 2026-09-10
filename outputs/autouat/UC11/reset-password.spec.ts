describe('Reset Password', () => {
  
  // Scenario: Successful password reset request
  it('should send a temporary password and reset link for a valid username', () => {
    cy.loginAsRegisteredPatient();
    cy.visit('/iTrust2/login'); // Assuming the user is registered
    cy.get('#passwordResetRequest').click(); // Click on the "Forgot Password" link
    cy.get('#username').type('validUsername'); // Replace with a valid username
    cy.get('form').submit(); // Submit the form
    // Assert that a temporary password and reset link are sent (this would depend on the implementation)
    cy.contains('A temporary password has been sent to your email.').should('be.visible');
  });

  // Scenario: Username not recognized
  it('should show an error message for an unrecognized username', () => {
    cy.visit('/iTrust2/login');
    cy.get('#passwordResetRequest').click(); // Click on the "Forgot Password" link
    cy.get('#username').type('unrecognizedUsername'); // Replace with an unrecognized username
    cy.get('form').submit(); // Submit the form
    cy.contains('No user found with provided username.').should('be.visible'); // Assert error message
  });

  // Scenario: Account without a valid email
  it('should show an error message for an account without a valid email', () => {
    cy.loginAsPatient();
    cy.visit('/iTrust2/login'); // Assuming the user has an account without a valid email
    cy.get('#passwordResetRequest').click(); // Click on the "Forgot Password" link
    cy.get('#username').type('usernameWithoutEmail'); // Replace with a valid username without email
    cy.get('form').submit(); // Submit the form
    cy.contains('Unable to reset this account. Please contact an administrator').should('be.visible'); // Assert error message
  });

  // Scenario: Successful password change with temporary password
  it('should successfully change the password using a temporary password', () => {
    cy.loginAsRegisteredPatient();
    cy.visit('/iTrust2/login'); // Assuming the user has received a temporary password
    cy.get('#passwordResetRequest').click(); // Click on the "Forgot Password" link
    cy.get('#username').type('validUsername'); // Replace with a valid username
    cy.get('form').submit(); // Submit the form
    // Simulate receiving a temporary password
    const temporaryPassword = 'tempPassword123'; // Replace with the actual temporary password received
    cy.get('#currentPassword').type(temporaryPassword); // Assuming there's a field for current password
    cy.get('#newPassword').type('newSecurePassword'); // Enter a new password
    cy.get('form').submit(); // Submit the form
    cy.contains('Your password has been successfully changed.').should('be.visible'); // Assert success message
  });

  // Scenario: Temporary password expired
  it('should show an error message for an expired temporary password', () => {
    cy.loginAsRegisteredPatient();
    cy.visit('/iTrust2/login'); // Assuming the user has received an expired temporary password
    cy.get('#passwordResetRequest').click(); // Click on the "Forgot Password" link
    cy.get('#username').type('validUsername'); // Replace with a valid username
    cy.get('form').submit(); // Submit the form
    // Simulate receiving an expired temporary password
    const expiredTemporaryPassword = 'expiredTempPassword'; // Replace with the actual expired temporary password
    cy.get('#currentPassword').type(expiredTemporaryPassword); // Enter the expired temporary password
    cy.get('form').submit(); // Submit the form
    cy.contains('Your temporary password has expired. Please request another one').should('be.visible'); // Assert error message
  });

});