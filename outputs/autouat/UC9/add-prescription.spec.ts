describe('Add prescription to office visit', () => {
  beforeEach(() => {
    // Log in as HCP before each test
    cy.loginAsHCP();
    // Navigate to the office visit page
    cy.visit('/iTrust2/hcp/documentOfficeVisit');
  });

  it('Successfully adding a valid prescription', () => {
    // Select a prescription name from the list
    cy.get('input[name="Drug"]').first().check(); // Assuming the first drug is valid
    // Enter a dose of 500 milligrams
    cy.get('input[name="dosageEntry"]').type('500');
    // Enter a start date of "2023-10-01"
    cy.get('input[name="startEntry"]').type('2023-10-01');
    // Enter an end date of "2023-10-31"
    cy.get('input[name="endEntry"]').type('2023-10-31');
    // Enter 2 renewals
    cy.get('input[name="renewalEntry"]').type('2');
    // Click on the "Add Prescription" button
    cy.get('button[name="fillPrescription"]').click();
    // Assert that the confirmation message is displayed
    cy.get('.text-success').should('contain', 'Prescription added successfully.');
  });

  it('Attempting to add a prescription with an invalid name', () => {
    // Select a prescription name that is not in the list
    cy.get('input[name="Drug"]').last().check(); // Assuming the last drug is invalid
    // Enter a dose of 250 milligrams
    cy.get('input[name="dosageEntry"]').type('250');
    // Enter a start date of "2023-10-01"
    cy.get('input[name="startEntry"]').type('2023-10-01');
    // Enter an end date of "2023-10-15"
    cy.get('input[name="endEntry"]').type('2023-10-15');
    // Enter 1 renewal
    cy.get('input[name="renewalEntry"]').type('1');
    // Click on the "Add Prescription" button
    cy.get('button[name="fillPrescription"]').click();
    // Assert that the error message is displayed
    cy.get('.text-danger').should('contain', 'Invalid prescription name.');
  });

  it('Attempting to add a prescription with invalid dose', () => {
    // Select a prescription name from the list
    cy.get('input[name="Drug"]').first().check();
    // Enter a dose of -100 milligrams
    cy.get('input[name="dosageEntry"]').type('-100');
    // Enter a start date of "2023-10-01"
    cy.get('input[name="startEntry"]').type('2023-10-01');
    // Enter an end date of "2023-10-15"
    cy.get('input[name="endEntry"]').type('2023-10-15');
    // Enter 1 renewal
    cy.get('input[name="renewalEntry"]').type('1');
    // Click on the "Add Prescription" button
    cy.get('button[name="fillPrescription"]').click();
    // Assert that the error message is displayed
    cy.get('.text-danger').should('contain', 'Dose must be a positive number.');
  });

  it('Attempting to add a prescription with an invalid date range', () => {
    // Select a prescription name from the list
    cy.get('input[name="Drug"]').first().check();
    // Enter a dose of 100 milligrams
    cy.get('input[name="dosageEntry"]').type('100');
    // Enter a start date of "2023-10-15"
    cy.get('input[name="startEntry"]').type('2023-10-15');
    // Enter an end date of "2023-10-01"
    cy.get('input[name="endEntry"]').type('2023-10-01');
    // Enter 1 renewal
    cy.get('input[name="renewalEntry"]').type('1');
    // Click on the "Add Prescription" button
    cy.get('button[name="fillPrescription"]').click();
    // Assert that the error message is displayed
    cy.get('.text-danger').should('contain', 'End date must be after the start date.');
  });

  it('Adding multiple prescriptions to the visit', () => {
    // Add first prescription
    cy.get('input[name="Drug"]').first().check();
    cy.get('input[name="dosageEntry"]').type('100');
    cy.get('input[name="startEntry"]').type('2023-10-01');
    cy.get('input[name="endEntry"]').type('2023-10-15');
    cy.get('input[name="renewalEntry"]').type('1');
    cy.get('button[name="fillPrescription"]').click();

    // Add second prescription
    cy.get('input[name="Drug"]').eq(1).check(); // Assuming the second drug is valid
    cy.get('input[name="dosageEntry"]').clear().type('200');
    cy.get('input[name="startEntry"]').clear().type('2023-10-01');
    cy.get('input[name="endEntry"]').clear().type('2023-10-31');
    cy.get('input[name="renewalEntry"]').clear().type('3');
    cy.get('button[name="fillPrescription"]').click();

    // Assert that both prescriptions are added
    cy.get('.text-success').should('contain', 'Prescriptions added successfully.');
  });

  it('Adding a prescription with zero renewals', () => {
    // Select a prescription name from the list
    cy.get('input[name="Drug"]').first().check();
    // Enter a dose of 150 milligrams
    cy.get('input[name="dosageEntry"]').type('150');
    // Enter a start date of "2023-10-01"
    cy.get('input[name="startEntry"]').type('2023-10-01');
    // Enter an end date of "2023-10-15"
    cy.get('input[name="endEntry"]').type('2023-10-15');
    // Enter 0 renewals
    cy.get('input[name="renewalEntry"]').type('0');
    // Click on the "Add Prescription" button
    cy.get('button[name="fillPrescription"]').click();
    // Assert that the confirmation message is displayed
    cy.get('.text-success').should('contain', 'Prescription added successfully.');
  });
});