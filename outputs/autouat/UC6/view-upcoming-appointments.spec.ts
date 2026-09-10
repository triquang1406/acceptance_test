describe('View Upcoming Appointments', () => {
  
  beforeEach(() => {
    // Log in as a Healthcare Professional (HCP)
    cy.loginAsHCP();
  });

  it('Successfully viewing upcoming approved appointments', () => {
    // Navigate to the Upcoming Appointments section
    cy.visit('/iTrust2/hcp/appointmentRequests');

    // Assert that a list of upcoming approved appointments is displayed
    cy.get('h3').contains('Upcoming Medical Appointment');
    cy.get('ul').children().should('have.length.greaterThan', 0); // Ensure there are appointments listed

    // Assert that each appointment displays the required details
    cy.get('ul li').each(($el) => {
      cy.wrap($el).should('contain.text', 'Type:');
      cy.wrap($el).should('contain.text', 'Date:');
      cy.wrap($el).should('contain.text', 'Time:');
      cy.wrap($el).should('contain.text', 'Patient:');
    });
  });

  it('No upcoming approved appointments', () => {
    // Navigate to the Upcoming Appointments section
    cy.visit('/iTrust2/hcp/appointmentRequests');

    // Simulate no appointments by ensuring the list is empty
    cy.get('ul').children().should('have.length', 0);

    // Assert that the appropriate message is displayed
    cy.get('.text-danger').should('contain.text', 'No upcoming appointments');
  });

  it('Viewing details of an upcoming approved appointment', () => {
    // Navigate to the Upcoming Appointments section
    cy.visit('/iTrust2/hcp/appointmentRequests');

    // Assume there are upcoming approved appointments
    cy.get('ul li').first().click(); // Select the first appointment

    // Assert that the detailed view of the appointment is displayed
    cy.get('h3').contains('Update Medical Appointment Requests');
    cy.get('label').should('contain.text', 'Type:');
    cy.get('label').should('contain.text', 'Date:');
    cy.get('label').should('contain.text', 'Time:');
    cy.get('label').should('contain.text', 'Patient:');
    cy.get('label').should('contain.text', 'Status:');
    cy.get('label').should('contain.text', 'Notes:'); // Assuming notes are part of the details
  });

  it('Upcoming appointments are sorted by date and time', () => {
    // Navigate to the Upcoming Appointments section
    cy.visit('/iTrust2/hcp/appointmentRequests');

    // Get the list of appointments and assert they are sorted
    let dates = [];
    cy.get('ul li').each(($el) => {
      const dateText = $el.text().match(/Date: (\d{2}\/\d{2}\/\d{4})/)[1];
      dates.push(new Date(dateText));
    }).then(() => {
      const sortedDates = [...dates].sort((a, b) => a - b);
      expect(dates).to.deep.equal(sortedDates);
    });
  });

  it('Filtering upcoming appointments by date', () => {
    // Navigate to the Upcoming Appointments section
    cy.visit('/iTrust2/hcp/appointmentRequests');

    // Assume we have a filter input (not shown in HTML, but assuming it exists)
    const specificDate = '12/25/2023'; // Example date
    cy.get('input[name="filterDate"]').type(specificDate);
    cy.get('button[name="filterSubmit"]').click(); // Assuming a submit button exists

    // Assert that only appointments for the specific date are shown
    cy.get('ul li').each(($el) => {
      cy.wrap($el).should('contain.text', specificDate);
    });
  });

  it('Handling errors when fetching upcoming appointments', () => {
    // Simulate a server error (this would typically be done via a stub)
    cy.intercept('GET', '/iTrust2/hcp/appointmentRequests', { statusCode: 500 });

    // Navigate to the Upcoming Appointments section
    cy.visit('/iTrust2/hcp/appointmentRequests');

    // Assert that the error message is displayed
    cy.get('.text-danger').should('contain.text', 'Unable to load upcoming appointments. Please try again later.');
  });

});