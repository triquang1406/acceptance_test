describe('Edit Patient Demographics', () => {
  
  beforeEach(() => {
    // Log in as HCP before each test
    cy.loginAsHCP();
    // Access the patient list
    cy.visit('/iTrust2/hcp/editPatientDemographics');
  });

  it('Successfully edit patient demographics', () => {
    // Select a patient from the list
    cy.get('input[name="patient"]').first().check();
    
    // Edit the patient's demographics with valid data
    cy.get('input[name="firstName"]').clear().type('John');
    cy.get('input[name="lastName"]').clear().type('Doe');
    cy.get('input[name="email"]').clear().type('john.doe@example.com');
    
    // Submit the form
    cy.get('button[name="submit"]').click();
    
    // Assert success message
    cy.contains('Data has been updated').should('be.visible');
    
    // Assert that the patient's demographics reflect the updated information
    cy.get('input[name="firstName"]').should('have.value', 'John');
    cy.get('input[name="lastName"]').should('have.value', 'Doe');
    cy.get('input[name="email"]').should('have.value', 'john.doe@example.com');
  });

  it('Attempt to submit with invalid data', () => {
    // Select a patient from the list
    cy.get('input[name="patient"]').first().check();
    
    // Edit the patient's demographics with invalid data (e.g., invalid email)
    cy.get('input[name="email"]').clear().type('invalid-email');
    
    // Submit the form
    cy.get('button[name="submit"]').click();
    
    // Assert error message
    cy.contains('Data entered is invalid').should('be.visible');
    
    // Assert that the invalid field is highlighted
    cy.get('input[name="email"]').should('have.class', 'ng-invalid');
  });

  it('Attempt to submit with missing required fields', () => {
    // Select a patient from the list
    cy.get('input[name="patient"]').first().check();
    
    // Leave required fields empty
    cy.get('input[name="firstName"]').clear();
    cy.get('input[name="lastName"]').clear();
    
    // Submit the form
    cy.get('button[name="submit"]').click();
    
    // Assert error message for missing required fields
    cy.contains('Required fields are missing').should('be.visible');
    
    // Assert that the missing required fields are highlighted
    cy.get('input[name="firstName"]').should('have.class', 'ng-invalid');
    cy.get('input[name="lastName"]').should('have.class', 'ng-invalid');
  });

  it('Cancel editing patient demographics', () => {
    // Select a patient from the list
    cy.get('input[name="patient"]').first().check();
    
    // Make changes to the patient's demographics
    cy.get('input[name="firstName"]').clear().type('Jane');
    
    // Press the Cancel button (assuming it exists)
    // Note: The Cancel button is not present in the provided HTML, so this is a placeholder
    cy.get('button[name="cancel"]').click(); // This button should be defined in the actual HTML
    
    // Assert redirection back to the patient list
    cy.url().should('include', '/iTrust2/hcp/editPatientDemographics');
    
    // Assert that the patient's demographics remain unchanged
    cy.get('input[name="firstName"]').should('not.have.value', 'Jane');
  });

  it('Edit demographics of a patient not in the list', () => {
    // Attempt to select a patient that is not in the list
    // This scenario is not directly testable with the current HTML structure
    // Assuming we have a way to input a username directly
    cy.get('input[name="search"]').type('nonexistentPatient');
    cy.get('button[name="search"]').click(); // Assuming a search button exists
    
    // Assert error message indicating the patient cannot be found
    cy.contains('Patient cannot be found').should('be.visible');
  });

});