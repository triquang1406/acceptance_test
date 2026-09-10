describe('Delete User', () => {
  
  beforeEach(() => {
    // Log in as Admin before each test
    cy.loginAsAdmin();
    // Navigate to the user management page
    cy.visit('/iTrust2/admin/users');
  });

  it('Successfully delete a user', () => {
    // Select a user from the list (assuming the first user in the list)
    cy.get('tr[name="userTableRow"]').first().within(() => {
      cy.get('button[name="deleteUser"]').click(); // Click the delete button
    });
    
    // Confirm the deletion
    cy.get('button[name="confirmDelete"]').click(); // Assuming there's a confirm button

    // Assert that the user is removed from the list
    cy.get('tr[name="userTableRow"]').should('not.exist'); // Check that the user no longer exists
  });

  it('Attempt to delete a user without confirmation', () => {
    // Select a user from the list
    cy.get('tr[name="userTableRow"]').first().within(() => {
      cy.get('button[name="deleteUser"]').click(); // Click the delete button
    });
    
    // Do not confirm the deletion
    cy.get('button[name="cancelDelete"]').click(); // Assuming there's a cancel button

    // Assert that the user remains in the list
    cy.get('tr[name="userTableRow"]').should('exist'); // Check that the user still exists
  });

  it('Attempt to delete a non-existent user', () => {
    // Attempt to delete a user that does not exist
    cy.get('button[name="deleteUserNonExistent"]').click(); // Assuming there's a button for a non-existent user

    // Assert that an error message is shown
    cy.get('#error').should('contain', 'User not found'); // Check for the error message
    cy.get('tr[name="userTableRow"]').should('exist'); // Check that the user list remains unchanged
  });

  it('Delete multiple users', () => {
    // Select multiple users from the list (assuming the first two users)
    cy.get('tr[name="userTableRow"]').first().find('input[type="checkbox"]').check();
    cy.get('tr[name="userTableRow"]').eq(1).find('input[type="checkbox"]').check();

    // Confirm the deletion
    cy.get('button[name="confirmDelete"]').click(); // Assuming there's a confirm button

    // Assert that the selected users are removed from the list
    cy.get('tr[name="userTableRow"]').should('have.length', 0); // Check that the users no longer exist
  });

  it('Verify that deleted user cannot log in', () => {
    // Select a user from the list
    const deletedUser = 'testUser'; // Replace with actual username
    cy.get('tr[name="userTableRow"]').contains(deletedUser).within(() => {
      cy.get('button[name="deleteUser"]').click(); // Click the delete button
    });

    // Confirm the deletion
    cy.get('button[name="confirmDelete"]').click(); // Assuming there's a confirm button

    // Attempt to log in as the deleted user
    cy.logout(); // Log out as Admin
    cy.login(deletedUser); // Attempt to log in as the deleted user

    // Assert that the login fails
    cy.get('#error').should('contain', 'Access denied'); // Check for the access denied message
  });

});