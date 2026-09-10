describe('Record Diagnosis', () => {
  
  beforeEach(() => {
    // Log in as a healthcare provider before each test
    cy.loginAsHCP();
    // Navigate to the Document Office Visit page
    cy.visit('/iTrust2/hcp/documentOfficeVisit');
  });

  it('Successfully record a diagnosis with valid data', () => {
    // Select diagnosis with ICD-10 code "A00" and description "Cholera"
    cy.get('input[id="A00"]').check();
    
    // Enter the date of the office visit
    cy.get('input[id="date"]').type('2023-10-01');
    
    // Enter the HCP name
    cy.get('input[name="hcpName"]').type('Dr. Smith');
    
    // Enter notes
    cy.get('input[name="notesEntry"]').type('Patient shows symptoms consistent with cholera.');
    
    // Press the Save Diagnosis button
    cy.get('button[name="fillDiagnosis"]').click();
    
    // Assert that the success message is displayed
    cy.get('div[name="success"]').should('contain', 'Diagnosis documented successfully.');
  });

  it('Attempt to record a diagnosis with notes exceeding character limit', () => {
    // Select diagnosis with ICD-10 code "A00" and description "Cholera"
    cy.get('input[id="A00"]').check();
    
    // Enter the date of the office visit
    cy.get('input[id="date"]').type('2023-10-01');
    
    // Enter the HCP name
    cy.get('input[name="hcpName"]').type('Dr. Smith');
    
    // Enter notes exceeding 500 characters
    const longNote = 'This is a very long note that exceeds the character limit of five hundred characters. '.repeat(20);
    cy.get('input[name="notesEntry"]').type(longNote);
    
    // Press the Save Diagnosis button
    cy.get('button[name="fillDiagnosis"]').click();
    
    // Assert that the error message is displayed
    cy.get('div[name="errorMsg"]').should('contain', 'Notes must not exceed 500 characters.');
  });

  it('Attempt to record a diagnosis without selecting a diagnosis', () => {
    // Do not select a diagnosis
    
    // Enter the date of the office visit
    cy.get('input[id="date"]').type('2023-10-01');
    
    // Enter the HCP name
    cy.get('input[name="hcpName"]').type('Dr. Smith');
    
    // Enter notes
    cy.get('input[name="notesEntry"]').type('Patient shows symptoms consistent with cholera.');
    
    // Press the Save Diagnosis button
    cy.get('button[name="fillDiagnosis"]').click();
    
    // Assert that the error message is displayed
    cy.get('div[name="errorMsg"]').should('contain', 'Diagnosis must be selected.');
  });

  it('Attempt to record a diagnosis with an invalid date format', () => {
    // Select diagnosis with ICD-10 code "A00" and description "Cholera"
    cy.get('input[id="A00"]').check();
    
    // Enter an invalid date format
    cy.get('input[id="date"]').type('01-10-2023');
    
    // Enter the HCP name
    cy.get('input[name="hcpName"]').type('Dr. Smith');
    
    // Enter notes
    cy.get('input[name="notesEntry"]').type('Patient shows symptoms consistent with cholera.');
    
    // Press the Save Diagnosis button
    cy.get('button[name="fillDiagnosis"]').click();
    
    // Assert that the error message is displayed
    cy.get('div[name="errorMsg"]').should('contain', 'Date must be in the format YYYY-MM-DD.');
  });

  it('Attempt to record a diagnosis without entering HCP name', () => {
    // Select diagnosis with ICD-10 code "A00" and description "Cholera"
    cy.get('input[id="A00"]').check();
    
    // Enter the date of the office visit
    cy.get('input[id="date"]').type('2023-10-01');
    
    // Do not enter the HCP name
    
    // Enter notes
    cy.get('input[name="notesEntry"]').type('Patient shows symptoms consistent with cholera.');
    
    // Press the Save Diagnosis button
    cy.get('button[name="fillDiagnosis"]').click();
    
    // Assert that the error message is displayed
    cy.get('div[name="errorMsg"]').should('contain', 'HCP name must be provided.');
  });

});