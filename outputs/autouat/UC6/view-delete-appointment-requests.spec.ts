describe('View and delete appointment requests', () => {
  
  beforeEach(() => {
    // Log in as a patient before each test
    cy.loginAsPatient();
  });

  it('View appointment requests', () => {
    // Navigate to the "My Appointment Requests" page
    cy.visit('/iTrust2/patient/manageAppointmentRequest');
    
    // Assert that a list of appointment requests is visible
    cy.get('ul').should('exist'); // Check if the list exists
    cy.get('li').should('have.length.greaterThan', 0); // Ensure there is at least one request
    // Check that each request displays the appointment date, time, and status
    cy.get('li').each(($el) => {
      cy.wrap($el).contains('Date:');
      cy.wrap($el).contains('Time:');
      cy.wrap($el).contains('Status:');
    });
  });

  it('Delete an appointment request', () => {
    // Navigate to the "My Appointment Requests" page
    cy.visit('/iTrust2/patient/manageAppointmentRequest');
    
    // Select an appointment request to delete
    cy.get('input[name="appt"]').first().check(); // Select the first appointment request
    
    // Click the delete button
    cy.get('button[name="deleteRequest"]').click();
    
    // Confirm deletion
    cy.on('window:confirm', () => true); // Automatically confirm the deletion
    
    // Assert that the appointment request is removed from the list
    cy.get('li').should('have.length.lessThan', 1); // Ensure the list has less than one request
    // Assert confirmation message
    cy.get('.text-success').should('contain', 'Appointment request deleted successfully.');
  });

  it('Attempt to delete a non-existent appointment request', () => {
    // Log out and log in as a patient with no requests
    cy.logout();
    cy.loginAsRegisteredPatient(); // Assuming this patient has no requests
    
    // Navigate to the "My Appointment Requests" page
    cy.visit('/iTrust2/patient/manageAppointmentRequest');
    
    // Assert that the message for no appointment requests is displayed
    cy.get('div').contains('No appointment requests found.').should('exist');
  });

  it('Cancel deletion of an appointment request', () => {
    // Navigate to the "My Appointment Requests" page
    cy.visit('/iTrust2/patient/manageAppointmentRequest');
    
    // Select an appointment request to delete
    cy.get('input[name="appt"]').first().check(); // Select the first appointment request
    
    // Click the delete button
    cy.get('button[name="deleteRequest"]').click();
    
    // Cancel deletion
    cy.on('window:confirm', () => false); // Automatically cancel the deletion
    
    // Assert that the appointment request remains in the list
    cy.get('li').should('have.length.greaterThan', 0); // Ensure the list still has requests
    // Assert cancellation message
    cy.get('.text-danger').should('contain', 'Deletion cancelled.');
  });

  it('View appointment requests with no requests', () => {
    // Log out and log in as a patient with no requests
    cy.logout();
    cy.loginAsRegisteredPatient(); // Assuming this patient has no requests
    
    // Navigate to the "My Appointment Requests" page
    cy.visit('/iTrust2/patient/manageAppointmentRequest');
    
    // Assert that the message for having no appointment requests is displayed
    cy.get('div').contains('You have no appointment requests.').should('exist');
  });
});