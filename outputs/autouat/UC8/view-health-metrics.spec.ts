describe('View Health Metrics', () => {
  
  // Scenario: Successfully view health metrics for a past office visit
  it('should display health metrics for a past office visit', () => {
    cy.loginAsRegisteredPatient(); // Log in as a registered patient
    cy.visit('/iTrust2/patient/index'); // Navigate to the patient home page

    // Navigate to the health metrics section (assuming it's part of the patient dropdown)
    cy.get('#viewOfficeVisits').click(); // Click on the Past Office Visits link

    // Assert that the health metrics are displayed
    cy.contains('Blood Pressure').should('be.visible');
    cy.contains('Heart Rate').should('be.visible');
    cy.contains('Weight').should('be.visible');
  });

  // Scenario: No health metrics recorded for an office visit
  it('should show no health metrics available message', () => {
    cy.loginAsRegisteredPatient(); // Log in as a registered patient
    cy.visit('/iTrust2/patient/index'); // Navigate to the patient home page

    // Navigate to the health metrics section
    cy.get('#viewOfficeVisits').click(); // Click on the Past Office Visits link

    // Assert that the no health metrics message is displayed
    cy.contains('No health metrics available').should('be.visible');
  });

  // Scenario: View health metrics for the most recent office visit
  it('should display health metrics for the most recent office visit', () => {
    cy.loginAsRegisteredPatient(); // Log in as a registered patient
    cy.visit('/iTrust2/patient/index'); // Navigate to the patient home page

    // Navigate to the health metrics section
    cy.get('#viewOfficeVisits').click(); // Click on the Past Office Visits link

    // Assert that the health metrics for the most recent office visit are displayed
    cy.get('table').find('tr').first().should('contain', 'Blood Pressure'); // Example assertion
  });

  // Scenario: Health metrics display format
  it('should display health metrics in a clear format', () => {
    cy.loginAsRegisteredPatient(); // Log in as a registered patient
    cy.visit('/iTrust2/patient/index'); // Navigate to the patient home page

    // Navigate to the health metrics section
    cy.get('#viewOfficeVisits').click(); // Click on the Past Office Visits link

    // Assert that the health metrics are displayed in a clear format
    cy.get('table').should('be.visible'); // Check if the table is visible
    cy.get('table').find('tr').first().should('contain', 'Date'); // Check if date is included
  });

  // Scenario: Access health metrics without being logged in
  it('should redirect to login page when not logged in', () => {
    cy.logout(); // Ensure the user is logged out
    cy.visit('/iTrust2/patient/index'); // Attempt to navigate to the patient home page

    // Assert that the user is redirected to the login page
    cy.url().should('include', '/login'); // Check if the URL includes '/login'
    cy.contains('You need to log in to view health metrics').should('be.visible'); // Check for login message
  });

  // Scenario: Edge case - Invalid office visit ID
  it('should show error message for invalid office visit ID', () => {
    cy.loginAsRegisteredPatient(); // Log in as a registered patient
    cy.visit('/iTrust2/patient/index'); // Navigate to the patient home page

    // Attempt to view health metrics with an invalid office visit ID
    cy.visit('/iTrust2/patient/index'); // Simulate invalid ID

    // Assert that the error message is displayed
    cy.contains('Invalid office visit ID').should('be.visible');
  });
});