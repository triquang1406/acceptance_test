describe('Patient edits own demographics', () => {
  
  beforeEach(() => {
    // Log in as a patient before each test
    cy.loginAsPatient();
  });

  it('Successfully edit demographic information', () => {
    // Navigate to the Edit Demographics page
    cy.visit('/iTrust2/patient/editDemographics');

    // Enter valid demographic information
    cy.get('#firstName').clear().type('John'); // First Name
    cy.get('#lastName').clear().type('Doe'); // Last Name
    cy.get('#dateOfBirth').clear().type('1990-01-01'); // Date of Birth
    cy.get('#email').clear().type('john.doe@example.com'); // Email
    cy.get('#phone').clear().type('123-456-7890'); // Phone Number

    // Click the Save button
    cy.get('button[name="submit"]').click();

    // Assert success message
    cy.contains('Demographic information updated successfully').should('be.visible');
  });

  it('Attempt to edit demographic information with missing required fields', () => {
    // Navigate to the Edit Demographics page
    cy.visit('/iTrust2/patient/editDemographics');

    // Leave First Name field empty and enter valid values for other fields
    cy.get('#firstName').clear(); // First Name
    cy.get('#lastName').clear().type('Doe'); // Last Name
    cy.get('#dateOfBirth').clear().type('1990-01-01'); // Date of Birth
    cy.get('#email').clear().type('john.doe@example.com'); // Email
    cy.get('#phone').clear().type('123-456-7890'); // Phone Number

    // Click the Save button
    cy.get('button[name="submit"]').click();

    // Assert error message for missing First Name
    cy.contains('First Name is required').should('be.visible');
  });

  it('Attempt to edit demographic information with invalid email format', () => {
    // Navigate to the Edit Demographics page
    cy.visit('/iTrust2/patient/editDemographics');

    // Enter an invalid email format
    cy.get('#firstName').clear().type('John'); // First Name
    cy.get('#lastName').clear().type('Doe'); // Last Name
    cy.get('#dateOfBirth').clear().type('1990-01-01'); // Date of Birth
    cy.get('#email').clear().type('john.doe@com'); // Invalid Email
    cy.get('#phone').clear().type('123-456-7890'); // Phone Number

    // Click the Save button
    cy.get('button[name="submit"]').click();

    // Assert error message for invalid email format
    cy.contains('Email format is invalid').should('be.visible');
  });

  it('Attempt to edit demographic information with invalid phone number format', () => {
    // Navigate to the Edit Demographics page
    cy.visit('/iTrust2/patient/editDemographics');

    // Enter an invalid phone number format
    cy.get('#firstName').clear().type('John'); // First Name
    cy.get('#lastName').clear().type('Doe'); // Last Name
    cy.get('#dateOfBirth').clear().type('1990-01-01'); // Date of Birth
    cy.get('#email').clear().type('john.doe@example.com'); // Email
    cy.get('#phone').clear().type('123456'); // Invalid Phone Number

    // Click the Save button
    cy.get('button[name="submit"]').click();

    // Assert error message for invalid phone number format
    cy.contains('Phone Number format is invalid').should('be.visible');
  });

  it('Attempt to edit demographic information with future date of birth', () => {
    // Navigate to the Edit Demographics page
    cy.visit('/iTrust2/patient/editDemographics');

    // Enter a future date for Date of Birth
    cy.get('#firstName').clear().type('John'); // First Name
    cy.get('#lastName').clear().type('Doe'); // Last Name
    cy.get('#dateOfBirth').clear().type('2025-01-01'); // Future Date of Birth
    cy.get('#email').clear().type('john.doe@example.com'); // Email
    cy.get('#phone').clear().type('123-456-7890'); // Phone Number

    // Click the Save button
    cy.get('button[name="submit"]').click();

    // Assert error message for future date of birth
    cy.contains('Date of Birth cannot be in the future').should('be.visible');
  });

  afterEach(() => {
    // Log out after each test
    cy.logout();
  });
});