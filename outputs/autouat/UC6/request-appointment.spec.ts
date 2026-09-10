describe('Request Appointment', () => {
  beforeEach(() => {
    // Log in as a patient before each test
    cy.loginAsPatient();
    // Navigate to the appointment request page
    cy.visit('/iTrust2/patient/manageAppointmentRequest');
  });

  it('Successfully request an appointment with valid data', () => {
    // Enter valid HCP
    cy.get('#hcp').select('Dr. Smith');
    // Enter valid date
    cy.get('#date').type('2023-10-15');
    // Enter valid time
    cy.get('#time').type('10:00');
    // Enter comments
    cy.get('#comments').type('Looking forward to the appointment');
    // Select appointment type
    cy.get('select[name="type"]').select('General Checkup');
    // Click on the Request Appointment button
    cy.get('button[name="submitRequest"]').click();
    // Assert confirmation message is displayed
    cy.contains('Your appointment request has been submitted successfully.').should('be.visible');
  });

  it('Request appointment with missing HCP', () => {
    // Leave HCP empty
    cy.get('#hcp').select('');
    // Enter valid date
    cy.get('#date').type('2023-10-15');
    // Enter valid time
    cy.get('#time').type('10:00');
    // Enter comments
    cy.get('#comments').type('Looking forward to the appointment');
    // Select appointment type
    cy.get('select[name="type"]').select('General Checkup');
    // Click on the Request Appointment button
    cy.get('button[name="submitRequest"]').click();
    // Assert error message is displayed
    cy.contains('HCP is required.').should('be.visible');
  });

  it('Request appointment with invalid date format', () => {
    // Enter valid HCP
    cy.get('#hcp').select('Dr. Smith');
    // Enter invalid date format
    cy.get('#date').type('15-10-2023');
    // Enter valid time
    cy.get('#time').type('10:00');
    // Enter comments
    cy.get('#comments').type('Looking forward to the appointment');
    // Select appointment type
    cy.get('select[name="type"]').select('General Checkup');
    // Click on the Request Appointment button
    cy.get('button[name="submitRequest"]').click();
    // Assert error message is displayed
    cy.contains('Please enter a valid date format (YYYY-MM-DD).').should('be.visible');
  });

  it('Request appointment with missing time', () => {
    // Enter valid HCP
    cy.get('#hcp').select('Dr. Smith');
    // Enter valid date
    cy.get('#date').type('2023-10-15');
    // Leave time empty
    cy.get('#time').clear();
    // Enter comments
    cy.get('#comments').type('Looking forward to the appointment');
    // Select appointment type
    cy.get('select[name="type"]').select('General Checkup');
    // Click on the Request Appointment button
    cy.get('button[name="submitRequest"]').click();
    // Assert error message is displayed
    cy.contains('Time is required.').should('be.visible');
  });

  it('Request appointment with invalid time format', () => {
    // Enter valid HCP
    cy.get('#hcp').select('Dr. Smith');
    // Enter valid date
    cy.get('#date').type('2023-10-15');
    // Enter invalid time format
    cy.get('#time').type('25:00');
    // Enter comments
    cy.get('#comments').type('Looking forward to the appointment');
    // Select appointment type
    cy.get('select[name="type"]').select('General Checkup');
    // Click on the Request Appointment button
    cy.get('button[name="submitRequest"]').click();
    // Assert error message is displayed
    cy.contains('Please enter a valid time format (HH:MM AM/PM).').should('be.visible');
  });

  it('Request appointment with missing type', () => {
    // Enter valid HCP
    cy.get('#hcp').select('Dr. Smith');
    // Enter valid date
    cy.get('#date').type('2023-10-15');
    // Enter valid time
    cy.get('#time').type('10:00');
    // Enter comments
    cy.get('#comments').type('Looking forward to the appointment');
    // Leave type empty
    cy.get('select[name="type"]').select('');
    // Click on the Request Appointment button
    cy.get('button[name="submitRequest"]').click();
    // Assert error message is displayed
    cy.contains('Type of appointment is required.').should('be.visible');
  });
});