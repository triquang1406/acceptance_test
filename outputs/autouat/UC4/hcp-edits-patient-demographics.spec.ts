describe('Edit Patient Demographics', () => {
  beforeEach(() => {
    // Log in as HCP before each test
    cy.loginAsHCP();
    // Navigate to the edit patient demographics page
    cy.visit('/iTrust2/hcp/editPatientDemographics');
  });

  it('Successfully edit patient demographics with valid data', () => {
    // Enter the MID of the patient
    cy.get('input[name="search"]').type('123456');
    // Select the patient from the list
    cy.get('input[name="patient"]').first().check();
    // Fill in the patient's demographic information
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('Doe');
    cy.get('input[name="dateOfBirth"]').type('01/15/1985'); // MM/DD/YYYY format
    cy.get('input[name="address1"]').type('123 Main St, Anytown, USA');
    // Submit the demographic information
    cy.get('button[name="submit"]').click();
    // Assert that the confirmation message is displayed
    cy.contains('Patient demographics updated successfully.').should('be.visible');
  });

  it('Attempt to edit patient demographics with missing required fields', () => {
    // Enter the MID of the patient
    cy.get('input[name="search"]').type('123456');
    // Select the patient from the list
    cy.get('input[name="patient"]').first().check();
    // Leave the patient's name blank
    cy.get('input[name="firstName"]').clear();
    cy.get('input[name="dateOfBirth"]').type('01/15/1985');
    cy.get('input[name="address1"]').type('123 Main St, Anytown, USA');
    // Submit the demographic information
    cy.get('button[name="submit"]').click();
    // Assert that the error message is displayed
    cy.contains('Name is a required field.').should('be.visible');
  });

  it('Attempt to edit patient demographics with invalid date format', () => {
    // Enter the MID of the patient
    cy.get('input[name="search"]').type('123456');
    // Select the patient from the list
    cy.get('input[name="patient"]').first().check();
    // Fill in the patient's demographic information with an invalid date format
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('Doe');
    cy.get('input[name="dateOfBirth"]').type('15/01/1985'); // Invalid format
    cy.get('input[name="address1"]').type('123 Main St, Anytown, USA');
    // Submit the demographic information
    cy.get('button[name="submit"]').click();
    // Assert that the error message is displayed
    cy.contains('Date of birth must be in MM/DD/YYYY format.').should('be.visible');
  });

  it('Attempt to edit patient demographics with an invalid MID', () => {
    // Enter an invalid MID
    cy.get('input[name="search"]').type('abc123');
    // Submit the demographic information
    cy.get('button[name="submit"]').click();
    // Assert that the error message is displayed
    cy.contains('Invalid MID. Please enter a valid MID.').should('be.visible');
  });

  it('Attempt to edit patient demographics with all fields blank', () => {
    // Enter the MID of the patient
    cy.get('input[name="search"]').type('123456');
    // Select the patient from the list
    cy.get('input[name="patient"]').first().check();
    // Leave all fields blank
    cy.get('input[name="firstName"]').clear();
    cy.get('input[name="lastName"]').clear();
    cy.get('input[name="dateOfBirth"]').clear();
    cy.get('input[name="address1"]').clear();
    // Submit the demographic information
    cy.get('button[name="submit"]').click();
    // Assert that the error messages for all required fields are displayed
    cy.contains('Name is a required field.').should('be.visible');
    cy.contains('Date of birth is a required field.').should('be.visible');
    cy.contains('Address is a required field.').should('be.visible');
  });
});