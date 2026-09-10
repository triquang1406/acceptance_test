describe('Manage ICD-10 Codes', () => {
  
  beforeEach(() => {
    // Log in as Admin before each test
    cy.loginAsAdmin();
    cy.visit('/iTrust2/admin/manageICDCodes');
  });

  it('Successfully adding a valid ICD-10 code and description', () => {
    // Enter a valid ICD-10 code and description
    cy.get('input[name="code"]').type('A00'); // Enter ICD-10 code
    cy.get('textarea[name="description"]').type('Cholera'); // Enter description
    cy.get('button[name="submit"]').click(); // Click on Add Diagnosis button

    // Assert success message
    cy.contains('Diagnosis added successfully').should('be.visible');
    // Assert that the diagnosis list includes the new entry
    cy.contains('A00 - Cholera').should('be.visible');
  });

  it('Adding an ICD-10 code with an invalid format', () => {
    // Enter an invalid ICD-10 code and description
    cy.get('input[name="code"]').type('123'); // Enter invalid ICD-10 code
    cy.get('textarea[name="description"]').type('Invalid Code'); // Enter description
    cy.get('button[name="submit"]').click(); // Click on Add Diagnosis button

    // Assert error message
    cy.contains("ICD-10 code must be in the format 'A00'").should('be.visible');
  });

  it('Adding a diagnosis without a description', () => {
    // Enter a valid ICD-10 code and leave description blank
    cy.get('input[name="code"]').type('B01'); // Enter ICD-10 code
    cy.get('textarea[name="description"]').clear(); // Leave description blank
    cy.get('button[name="submit"]').click(); // Click on Add Diagnosis button

    // Assert error message
    cy.contains('Description cannot be empty').should('be.visible');
  });

  it('Successfully removing a diagnosis', () => {
    // First, add a diagnosis to remove
    cy.get('input[name="code"]').type('A00'); // Enter ICD-10 code
    cy.get('textarea[name="description"]').type('Cholera'); // Enter description
    cy.get('button[name="submit"]').click(); // Click on Add Diagnosis button

    // Now remove the diagnosis
    cy.contains('A00 - Cholera').parent().find('input[type="button"]').click(); // Click on Remove button
    cy.on('window:confirm', () => true); // Confirm deletion

    // Assert success message
    cy.contains('Diagnosis removed successfully').should('be.visible');
    // Assert that the diagnosis list does not include the removed entry
    cy.contains('A00 - Cholera').should('not.exist');
  });

  it('Attempting to remove a diagnosis that does not exist', () => {
    // Attempt to remove a non-existent diagnosis
    cy.contains('XYZ - Nonexistent Diagnosis').parent().find('input[type="button"]').click(); // Click on Remove button
    cy.on('window:confirm', () => true); // Confirm deletion

    // Assert error message
    cy.contains('Diagnosis not found').should('be.visible');
  });

  it('Checking the diagnosis list after multiple additions and deletions', () => {
    // Add multiple diagnoses
    cy.get('input[name="code"]').type('A00'); // Enter ICD-10 code
    cy.get('textarea[name="description"]').type('Cholera'); // Enter description
    cy.get('button[name="submit"]').click(); // Click on Add Diagnosis button

    cy.get('input[name="code"]').type('B01'); // Enter another ICD-10 code
    cy.get('textarea[name="description"]').type('Influenza'); // Enter description
    cy.get('button[name="submit"]').click(); // Click on Add Diagnosis button

    // Remove one diagnosis
    cy.contains('A00 - Cholera').parent().find('input[type="button"]').click(); // Click on Remove button
    cy.on('window:confirm', () => true); // Confirm deletion

    // Assert that the diagnosis list includes the remaining diagnosis
    cy.contains('B01 - Influenza').should('be.visible');
    // Assert that the diagnosis list does not include the removed diagnosis
    cy.contains('A00 - Cholera').should('not.exist');
  });

});