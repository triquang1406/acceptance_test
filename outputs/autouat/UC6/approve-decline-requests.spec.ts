describe('Approve/Decline Appointment Requests', () => {
  
  beforeEach(() => {
    // Log in as HCP before each test
    cy.loginAsHCP();
  });

  it('Approve an appointment request', () => {
    // Assuming there is at least one appointment request available
    cy.visit('/iTrust2/hcp/appointmentRequests');

    // Select the first appointment request
    cy.get('input[name="appointment"]').first().check();

    // Change the status to approve
    cy.get('#changeStatus').select('Approved');

    // Submit the approval
    cy.get('button[name="submit"]').click();

    // Assert that the confirmation message is displayed
    cy.get('div[name="success"]').should('contain', 'Appointment request approved');

    // Assert that the appointment request is no longer visible
    cy.get('input[name="appointment"]').should('not.exist');
  });

  it('Decline an appointment request', () => {
    // Assuming there is at least one appointment request available
    cy.visit('/iTrust2/hcp/appointmentRequests');

    // Select the first appointment request
    cy.get('input[name="appointment"]').first().check();

    // Change the status to decline
    cy.get('#changeStatus').select('Declined');

    // Submit the decline
    cy.get('button[name="submit"]').click();

    // Assert that the confirmation message is displayed
    cy.get('div[name="success"]').should('contain', 'Appointment request declined');

    // Assert that the appointment request is no longer visible
    cy.get('input[name="appointment"]').should('not.exist');
  });

  it('No appointment requests available', () => {
    // Log in as HCP and ensure there are no appointment requests
    cy.visit('/iTrust2/hcp/appointmentRequests');

    // Assert that the message for no requests is displayed
    cy.get('div[name="errorMsg1"]').should('contain', 'No appointment requests available');
  });

  it('Attempt to approve a non-existent appointment request', () => {
    // Log in as HCP and ensure there are no appointment requests
    cy.visit('/iTrust2/hcp/appointmentRequests');

    // Attempt to approve a non-existent appointment request
    cy.get('button[name="submit"]').click();

    // Assert that the error message is displayed
    cy.get('div[name="errorMsg"]').should('contain', 'No appointment request found');
  });

  it('Attempt to decline a non-existent appointment request', () => {
    // Log in as HCP and ensure there are no appointment requests
    cy.visit('/iTrust2/hcp/appointmentRequests');

    // Attempt to decline a non-existent appointment request
    cy.get('button[name="submit"]').click();

    // Assert that the error message is displayed
    cy.get('div[name="errorMsg"]').should('contain', 'No appointment request found');
  });

});