describe('View Prescriptions', () => {
  beforeEach(() => {
    // Log in as a patient before each test
    cy.loginAsPatient();
  });

  it('Successfully viewing current and past prescriptions', () => {
    // Navigate to the prescriptions page
    cy.visit('/iTrust2/patient/officeVisit/viewPrescriptions');

    // Assert that the current prescriptions table is visible
    cy.get('table').should('be.visible');
    cy.get('caption').contains('My Prescriptions:');

    // Assert that the table headers are present
    cy.get('th').contains('Drug');
    cy.get('th').contains('Dosage (mg)');
    cy.get('th').contains('Start Date');
    cy.get('th').contains('End Date');
    cy.get('th').contains('Renewals');

    // Assert that the table is properly formatted
    cy.get('table').should('have.class', 'table-bordered');
  });

  it('No current prescriptions available', () => {
    // Simulate no current prescriptions
    cy.intercept('GET', '/api/prescriptions/current', []).as('getCurrentPrescriptions');
    cy.visit('/iTrust2/patient/officeVisit/viewPrescriptions');

    // Assert that the message for no current prescriptions is displayed
    cy.contains('You have no current prescriptions.').should('be.visible');
  });

  it('No past prescriptions available', () => {
    // Simulate no past prescriptions
    cy.intercept('GET', '/api/prescriptions/past', []).as('getPastPrescriptions');
    cy.visit('/iTrust2/patient/officeVisit/viewPrescriptions');

    // Assert that the message for no past prescriptions is displayed
    cy.contains('You have no past prescriptions.').should('be.visible');
  });

  it('No current or past prescriptions available', () => {
    // Simulate no current or past prescriptions
    cy.intercept('GET', '/api/prescriptions/current', []).as('getCurrentPrescriptions');
    cy.intercept('GET', '/api/prescriptions/past', []).as('getPastPrescriptions');
    cy.visit('/iTrust2/patient/officeVisit/viewPrescriptions');

    // Assert that the error message is displayed
    cy.contains('You have no current or past prescriptions.').should('be.visible');
  });

  it('Viewing details of a specific prescription', () => {
    // Simulate having a current prescription
    const prescription = {
      id: 1,
      drug: { name: 'Aspirin' },
      dosage: '100',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      renewals: 2,
      notes: 'Take with food.'
    };

    cy.intercept('GET', '/api/prescriptions/current', [prescription]).as('getCurrentPrescriptions');
    cy.visit('/iTrust2/patient/officeVisit/viewPrescriptions');

    // Click on the prescription in the table
    cy.get('tr[name="prescriptionTableRow"]').first().click();

    // Assert that detailed information about the prescription is displayed
    cy.contains('Prescription Name').should('be.visible');
    cy.contains('Dosage').should('be.visible');
    cy.contains('Start Date').should('be.visible');
    cy.contains('End Date').should('be.visible');
    cy.contains('Status').should('be.visible');
    cy.contains('Doctor\'s Notes').should('be.visible');
  });
});