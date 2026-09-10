describe('Warning on switching patient', () => {
  beforeEach(() => {
    // Log in as a healthcare professional (HCP)
    cy.loginAsHCP();
    // Navigate to the edit patient demographics page
    cy.visit('/iTrust2/hcp/editPatientDemographics');
  });

  it('Display warning when switching patients with unsaved changes', () => {
    // Simulate editing a patient's information
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('Doe');

    // Select a different patient
    cy.get('input[name="patient"]').first().click();

    // Assert that a warning message is displayed
    cy.on('window:confirm', (str) => {
      expect(str).to.equal('Unsaved changes will be lost. Do you want to continue?');
    });
  });

  it('Confirming the switch to a different patient', () => {
    // Simulate editing a patient's information
    cy.get('input[name="firstName"]').type('Jane');
    cy.get('input[name="lastName"]').type('Smith');

    // Select a different patient and confirm the switch
    cy.get('input[name="patient"]').first().click();
    cy.on('window:confirm', () => true); // Confirm the switch

    // Assert that the current patient's unsaved changes are discarded
    cy.get('input[name="firstName"]').should('have.value', '');
    cy.get('input[name="lastName"]').should('have.value', '');
  });

  it('Canceling the switch to a different patient', () => {
    // Simulate editing a patient's information
    cy.get('input[name="firstName"]').type('Alice');
    cy.get('input[name="lastName"]').type('Johnson');

    // Select a different patient and cancel the switch
    cy.get('input[name="patient"]').first().click();
    cy.on('window:confirm', () => false); // Cancel the switch

    // Assert that the current patient's unsaved changes remain intact
    cy.get('input[name="firstName"]').should('have.value', 'Alice');
    cy.get('input[name="lastName"]').should('have.value', 'Johnson');
  });

  it('Switching patients without unsaved changes', () => {
    // Select a different patient without making any changes
    cy.get('input[name="patient"]').first().click();

    // Assert that the new patient's data is loaded without any warning
    cy.get('h3').should('contain', 'Username:'); // Check for the new patient's username
  });

  it('Repeating the action after confirming the switch', () => {
    // Simulate editing a patient's information
    cy.get('input[name="firstName"]').type('Bob');
    cy.get('input[name="lastName"]').type('Brown');

    // Select a different patient and confirm the switch
    cy.get('input[name="patient"]').first().click();
    cy.on('window:confirm', () => true); // Confirm the switch

    // Select another different patient
    cy.get('input[name="patient"]').last().click();

    // Assert that the new patient's data is loaded without any warning
    cy.get('h3').should('contain', 'Username:'); // Check for the new patient's username
  });
});