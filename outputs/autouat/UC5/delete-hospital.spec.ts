describe('Delete Hospital', () => {
  beforeEach(() => {
    // Log in as Admin before each test
    cy.loginAsAdmin();
    // Navigate to the hospital management page
    cy.visit('/iTrust2/admin/hospitals');
  });

  it('Successfully delete a hospital', () => {
    // Select the hospital "City Hospital" from the list
    cy.contains('City Hospital').parents('tr').find('button.delete-hospital').click(); // Assuming there is a delete button
    // Confirm the deletion
    cy.get('button.confirm-delete').click(); // Assuming there is a confirm button
    // Assert that the hospital is no longer listed
    cy.contains('City Hospital').should('not.exist');
    // Assert success message
    cy.contains('Hospital deleted successfully.').should('be.visible');
  });

  it('Attempt to delete a hospital that does not exist', () => {
    // Select the hospital "Nonexistent Hospital" from the list
    cy.contains('Nonexistent Hospital').parents('tr').find('button.delete-hospital').click(); // Assuming there is a delete button
    // Confirm the deletion
    cy.get('button.confirm-delete').click(); // Assuming there is a confirm button
    // Assert error message
    cy.contains('Hospital not found.').should('be.visible');
  });

  it('Cancel deletion of a hospital', () => {
    // Select the hospital "City Hospital" from the list
    cy.contains('City Hospital').parents('tr').find('button.delete-hospital').click(); // Assuming there is a delete button
    // Cancel the deletion
    cy.get('button.cancel-delete').click(); // Assuming there is a cancel button
    // Assert that the hospital is still listed
    cy.contains('City Hospital').should('be.visible');
    // Assert cancellation message
    cy.contains('Deletion cancelled.').should('be.visible');
  });

  it('Attempt to delete a hospital without confirmation', () => {
    // Select the hospital "City Hospital" from the list
    cy.contains('City Hospital').parents('tr').find('button.delete-hospital').click(); // Assuming there is a delete button
    // Do not confirm the deletion
    // Assert that the hospital is still listed
    cy.contains('City Hospital').should('be.visible');
    // Assert message for not confirming
    cy.contains('Deletion not confirmed.').should('be.visible');
  });

  it('Verify that the hospital list updates correctly after deletion', () => {
    // Ensure both hospitals are listed
    cy.contains('City Hospital').should('be.visible');
    cy.contains('Town Clinic').should('be.visible');
    // Select "City Hospital" from the list
    cy.contains('City Hospital').parents('tr').find('button.delete-hospital').click(); // Assuming there is a delete button
    // Confirm the deletion
    cy.get('button.confirm-delete').click(); // Assuming there is a confirm button
    // Assert that the hospital list only includes "Town Clinic"
    cy.contains('City Hospital').should('not.exist');
    cy.contains('Town Clinic').should('be.visible');
    // Assert success message
    cy.contains('Hospital deleted successfully.').should('be.visible');
  });
});