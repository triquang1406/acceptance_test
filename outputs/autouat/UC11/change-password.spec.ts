describe('Change Password', () => {
  const currentPassword = '123456'; // Default password for all accounts
  const validNewPassword = 'newPass1'; // Example of a valid new password
  const shortPassword = '123'; // Example of a short password
  const longPassword = 'aVeryLongPasswordThatExceedsTwentyChars'; // Example of a long password
  const exactSixCharPassword = 'abcdef'; // Exactly 6 characters
  const exactTwentyCharPassword = 'abcdefghijabcdefghij'; // Exactly 20 characters

  beforeEach(() => {
    // Log in as a user before each test
    cy.login('user'); // Replace 'user' with the appropriate username
    cy.visit('/iTrust2/admin/users'); // Navigate to the change password page
  });

  it('Successfully change password with valid inputs', () => {
    cy.get('input[name="currentPassword"]').type(currentPassword); // Enter current password
    cy.get('input[name="newPassword"]').type(validNewPassword); // Enter valid new password
    cy.get('input[name="confirmPassword"]').type(validNewPassword); // Confirm new password
    cy.get('input[type="submit"]').click(); // Submit the form

    // Assert success message
    cy.get('#success').should('contain', 'Your password has been changed'); // Adjust message as per actual implementation
  });

  it('Attempt to change password to the current password', () => {
    cy.get('input[name="currentPassword"]').type(currentPassword); // Enter current password
    cy.get('input[name="newPassword"]').type(currentPassword); // Enter current password as new password
    cy.get('input[name="confirmPassword"]').type(currentPassword); // Confirm with current password
    cy.get('input[type="submit"]').click(); // Submit the form

    // Assert error message
    cy.get('#error').should('contain', 'The new password must be different');
  });

  it('New password and confirmation do not match', () => {
    cy.get('input[name="currentPassword"]').type(currentPassword); // Enter current password
    cy.get('input[name="newPassword"]').type(validNewPassword); // Enter valid new password
    cy.get('input[name="confirmPassword"]').type('differentPassword'); // Enter a different password in confirm field
    cy.get('input[type="submit"]').click(); // Submit the form

    // Assert error message
    cy.get('#error').should('contain', 'Please repeat the new password in the input field');
  });

  it('New password is too short', () => {
    cy.get('input[name="currentPassword"]').type(currentPassword); // Enter current password
    cy.get('input[name="newPassword"]').type(shortPassword); // Enter short new password
    cy.get('input[name="confirmPassword"]').type(shortPassword); // Confirm with the same short password
    cy.get('input[type="submit"]').click(); // Submit the form

    // Assert error message
    cy.get('#error').should('contain', 'The new password must be between 6 and 20 characters');
  });

  it('New password is too long', () => {
    cy.get('input[name="currentPassword"]').type(currentPassword); // Enter current password
    cy.get('input[name="newPassword"]').type(longPassword); // Enter long new password
    cy.get('input[name="confirmPassword"]').type(longPassword); // Confirm with the same long password
    cy.get('input[type="submit"]').click(); // Submit the form

    // Assert error message
    cy.get('#error').should('contain', 'The new password must be between 6 and 20 characters');
  });

  it('New password is exactly 6 characters long', () => {
    cy.get('input[name="currentPassword"]').type(currentPassword); // Enter current password
    cy.get('input[name="newPassword"]').type(exactSixCharPassword); // Enter new password of exactly 6 characters
    cy.get('input[name="confirmPassword"]').type(exactSixCharPassword); // Confirm with the same password
    cy.get('input[type="submit"]').click(); // Submit the form

    // Assert success message
    cy.get('#success').should('contain', 'Your password has been changed');
  });

  it('New password is exactly 20 characters long', () => {
    cy.get('input[name="currentPassword"]').type(currentPassword); // Enter current password
    cy.get('input[name="newPassword"]').type(exactTwentyCharPassword); // Enter new password of exactly 20 characters
    cy.get('input[name="confirmPassword"]').type(exactTwentyCharPassword); // Confirm with the same password
    cy.get('input[type="submit"]').click(); // Submit the form

    // Assert success message
    cy.get('#success').should('contain', 'Your password has been changed');
  });
});