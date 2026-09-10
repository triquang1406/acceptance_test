describe('Enter health metrics', () => {
  beforeEach(() => {
    // Log in as HCP before each test
    cy.loginAsHCP();
    // Navigate to Document Office Visit page
    cy.visit('/iTrust2/hcp/documentOfficeVisit');
  });

  it('should enter health metrics for a patient under three years of age', () => {
    // Simulate selecting a patient under three years of age
    cy.get('input[name="name"]').first().check(); // Assuming the first patient is under 3

    // Enter health metrics
    cy.get('input[name="height"]').type('75.5'); // Length for under 3
    cy.get('input[name="weight"]').type('10.2');
    cy.get('input[name="head"]').type('45.0');
    cy.get('input[name="houseSmokingStatus"]').check('1'); // Non-smoking household

    // Submit the form
    cy.get('button[name="submit"]').click();

    // Assert success message
    cy.get('div[name="success"]').should('contain', 'Health metrics saved successfully');
    // Assert saved information
    cy.get('input[name="height"]').should('have.value', '75.5');
    cy.get('input[name="weight"]').should('have.value', '10.2');
    cy.get('input[name="head"]').should('have.value', '45.0');
    cy.get('input[name="houseSmokingStatus"]:checked').should('have.value', '1');
  });

  it('should enter health metrics for a patient aged three to under twelve years', () => {
    // Simulate selecting a patient aged 3 to under 12
    cy.get('input[name="name"]').eq(1).check(); // Assuming the second patient is aged 3 to under 12

    // Enter health metrics
    cy.get('input[name="height"]').type('120.0');
    cy.get('input[name="weight"]').type('30.5');
    cy.get('input[name="systolic"]').type('110'); // Systolic blood pressure
    cy.get('input[name="diastolic"]').type('70'); // Diastolic blood pressure
    cy.get('input[name="houseSmokingStatus"]').check('2'); // Outdoor smokers

    // Submit the form
    cy.get('button[name="submit"]').click();

    // Assert success message
    cy.get('div[name="success"]').should('contain', 'Health metrics saved successfully');
    // Assert saved information
    cy.get('input[name="height"]').should('have.value', '120.0');
    cy.get('input[name="weight"]').should('have.value', '30.5');
    cy.get('input[name="systolic"]').should('have.value', '110');
    cy.get('input[name="diastolic"]').should('have.value', '70');
    cy.get('input[name="houseSmokingStatus"]:checked').should('have.value', '2');
  });

  it('should enter health metrics for a patient aged twelve years or older', () => {
    // Simulate selecting a patient aged 12 or older
    cy.get('input[name="name"]').eq(2).check(); // Assuming the third patient is aged 12 or older

    // Enter health metrics
    cy.get('input[name="height"]').type('160.0');
    cy.get('input[name="weight"]').type('50.5');
    cy.get('input[name="systolic"]').type('120'); // Systolic blood pressure
    cy.get('input[name="diastolic"]').type('80'); // Diastolic blood pressure
    cy.get('input[name="houseSmokingStatus"]').check('3'); // Indoor smokers
    cy.get('input[name="patientSmokingStatus"]').check('2'); // Former smoker
    cy.get('input[name="hdl"]').type('50');
    cy.get('input[name="ldl"]').type('100');
    cy.get('input[name="tri"]').type('150');

    // Submit the form
    cy.get('button[name="submit"]').click();

    // Assert success message
    cy.get('div[name="success"]').should('contain', 'Health metrics saved successfully');
    // Assert saved information
    cy.get('input[name="height"]').should('have.value', '160.0');
    cy.get('input[name="weight"]').should('have.value', '50.5');
    cy.get('input[name="systolic"]').should('have.value', '120');
    cy.get('input[name="diastolic"]').should('have.value', '80');
    cy.get('input[name="houseSmokingStatus"]:checked').should('have.value', '3');
    cy.get('input[name="patientSmokingStatus"]:checked').should('have.value', '2');
    cy.get('input[name="hdl"]').should('have.value', '50');
    cy.get('input[name="ldl"]').should('have.value', '100');
    cy.get('input[name="tri"]').should('have.value', '150');
  });

  it('should display error messages for invalid health metrics for a patient under three years of age', () => {
    // Simulate selecting a patient under three years of age
    cy.get('input[name="name"]').first().check();

    // Enter invalid health metrics
    cy.get('input[name="height"]').type('0'); // Invalid length
    cy.get('input[name="weight"]').type('-5'); // Invalid weight
    cy.get('input[name="head"]').type('45.0');
    cy.get('input[name="houseSmokingStatus"]').check('1');

    // Submit the form
    cy.get('button[name="submit"]').click();

    // Assert error messages
    cy.get('div[name="errorMsg"]').should('contain', 'Length must be greater than 0');
    cy.get('div[name="errorMsg"]').should('contain', 'Weight must be greater than 0');
  });

  it('should display error messages for invalid health metrics for a patient aged three to under twelve years', () => {
    // Simulate selecting a patient aged 3 to under 12
    cy.get('input[name="name"]').eq(1).check();

    // Enter invalid health metrics
    cy.get('input[name="height"]').type('150.5');
    cy.get('input[name="weight"]').type('0'); // Invalid weight
    cy.get('input[name="systolic"]').type('110');
    cy.get('input[name="diastolic"]').type('70');
    cy.get('input[name="houseSmokingStatus"]').check('2');

    // Submit the form
    cy.get('button[name="submit"]').click();

    // Assert error messages
    cy.get('div[name="errorMsg"]').should('contain', 'Weight must be greater than 0');
  });

  it('should display error messages for invalid health metrics for a patient aged twelve years or older', () => {
    // Simulate selecting a patient aged 12 or older
    cy.get('input[name="name"]').eq(2).check();

    // Enter invalid health metrics
    cy.get('input[name="height"]').type('160.0');
    cy.get('input[name="weight"]').type('50.5');
    cy.get('input[name="systolic"]').type('120');
    cy.get('input[name="diastolic"]').type('80');
    cy.get('input[name="houseSmokingStatus"]').check('3');
    cy.get('input[name="patientSmokingStatus"]').check('6'); // Invalid patient smoking status
    cy.get('input[name="hdl"]').type('100'); // Invalid HDL
    cy.get('input[name="ldl"]').type('700'); // Invalid LDL
    cy.get('input[name="tri"]').type('50'); // Valid triglycerides

    // Submit the form
    cy.get('button[name="submit"]').click();

    // Assert error messages
    cy.get('div[name="errorMsg"]').should('contain', 'Patient smoking status must be a valid option');
    cy.get('div[name="errorMsg"]').should('contain', 'HDL cholesterol must be between 0 and 90');
    cy.get('div[name="errorMsg"]').should('contain', 'LDL cholesterol must be between 0 and 600');
  });

  it('should display error messages for valid and invalid data', () => {
    // Simulate selecting a patient aged 12 or older
    cy.get('input[name="name"]').eq(2).check();

    // Enter valid and invalid health metrics
    cy.get('input[name="height"]').type('160.0');
    cy.get('input[name="weight"]').type('50.5');
    cy.get('input[name="systolic"]').type('120');
    cy.get('input[name="diastolic"]').type('80');
    cy.get('input[name="houseSmokingStatus"]').check('1');
    cy.get('input[name="patientSmokingStatus"]').check('3'); // Valid
    cy.get('input[name="hdl"]').type('80'); // Valid
    cy.get('input[name="ldl"]').type('200'); // Valid
    cy.get('input[name="tri"]').type('700'); // Invalid triglycerides

    // Submit the form
    cy.get('button[name="submit"]').click();

    // Assert error messages
    cy.get('div[name="errorMsg"]').should('contain', 'Triglycerides must be between 100 and 600');
  });
});