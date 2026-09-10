describe('View Diagnoses', () => {
  beforeEach(() => {
    // Log in as a patient before each test
    cy.loginAsPatient();
  });

  it('should view current diagnoses', () => {
    // Navigate to the My Diagnoses section
    cy.visit('/iTrust2/patient/officeVisit/viewDiagnoses');

    // Assert that the current diagnoses are displayed
    cy.get('h2').contains('Diagnoses');
    cy.get('tbody tr[name="diagnosis"]').should('have.length.greaterThan', 0); // Ensure there are diagnoses listed

    // Check for specific current diagnoses
    cy.get('tbody tr[name="diagnosis"]').eq(0).within(() => {
      cy.get('td[name="date"]').should('contain', '2023-01-15');
      cy.get('td[name="description"]').should('contain', 'High blood pressure');
    });

    cy.get('tbody tr[name="diagnosis"]').eq(1).within(() => {
      cy.get('td[name="date"]').should('contain', '2022-11-10');
      cy.get('td[name="description"]').should('contain', 'Insulin resistance');
    });
  });

  it('should view past diagnoses', () => {
    // Navigate to the My Diagnoses section
    cy.visit('/iTrust2/patient/officeVisit/viewDiagnoses');

    // Assert that past diagnoses are displayed
    cy.get('h2').contains('Diagnoses');
    cy.get('tbody tr[name="diagnosis"]').should('have.length.greaterThan', 0); // Ensure there are diagnoses listed

    // Check for specific past diagnoses
    cy.get('tbody tr[name="diagnosis"]').eq(2).within(() => {
      cy.get('td[name="date"]').should('contain', '2020-05-20');
      cy.get('td[name="description"]').should('contain', 'Chronic respiratory condition');
    });

    cy.get('tbody tr[name="diagnosis"]').eq(3).within(() => {
      cy.get('td[name="date"]').should('contain', '2019-03-15');
      cy.get('td[name="description"]').should('contain', 'Allergic reactions');
    });
  });

  it('should view details of a specific diagnosis', () => {
    // Navigate to the My Diagnoses section
    cy.visit('/iTrust2/patient/officeVisit/viewDiagnoses');

    // Select a diagnosis from the current diagnoses list
    cy.get('tbody tr[name="diagnosis"]').eq(0).click(); // Assuming the first diagnosis is selected

    // Assert that detailed information is displayed
    cy.get('h2').contains('Diagnosis Details'); // Assuming there's a heading for details
    cy.get('td[name="diagnosis"]').should('contain', 'Hypertension');
    cy.get('td[name="date"]').should('contain', '2023-01-15');
    cy.get('td[name="description"]').should('contain', 'High blood pressure');
    cy.get('td[name="treatmentPlan"]').should('contain', 'Lifestyle changes, medication');
    cy.get('td[name="followUpDate"]').should('contain', '2023-06-15');
  });

  it('should display message when no diagnoses are available', () => {
    // Log out and log in as a patient with no diagnoses
    cy.logout();
    cy.loginAsRegisteredPatient(); // Assuming this patient has no diagnoses

    // Navigate to the My Diagnoses section
    cy.visit('/iTrust2/patient/officeVisit/viewDiagnoses');

    // Assert that the message is displayed
    cy.get('h4').should('contain', 'No diagnoses available');
  });

  it('should redirect to login page when not logged in', () => {
    // Log out to ensure user is not logged in
    cy.logout();

    // Attempt to navigate to the My Diagnoses section
    cy.visit('/iTrust2/patient/officeVisit/viewDiagnoses');

    // Assert that the user is redirected to the login page
    cy.url().should('include', '/iTrust2/login');
    cy.get('h4').should('contain', 'Please log in to view your diagnoses');
  });
});