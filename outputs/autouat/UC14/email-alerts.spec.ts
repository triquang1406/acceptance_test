describe('Email Alerts for Account Events', () => {
  
  beforeEach(() => {
    // Log in as a registered patient to access email alerts
    cy.loginAsRegisteredPatient();
  });

  it('Send email alert for password change', () => {
    // Simulate a password change event
    cy.intercept('POST', '/api/password/change', { statusCode: 200 }).as('changePassword');
    cy.visit('/iTrust2/viewEmails');
    
    // Wait for the password change event to be processed
    cy.wait('@changePassword');

    // Check the email log for the password change alert
    cy.get('tr[name="emailTableRow"]').first().within(() => {
      cy.get('td[name="subjectCell"]').should('contain', 'Password Change Alert');
      cy.get('td[name="messageCell"]').should('not.contain', 'password'); // Ensure password is not included
      cy.get('td[name="messageCell"]').should('contain', 'MID:'); // Ensure MID is included
    });
  });

  it('Send email alert for password reset', () => {
    // Simulate a password reset request
    cy.intercept('POST', '/api/password/reset', { statusCode: 200 }).as('resetPassword');
    cy.visit('/iTrust2/viewEmails');
    
    // Wait for the password reset event to be processed
    cy.wait('@resetPassword');

    // Check the email log for the password reset alert
    cy.get('tr[name="emailTableRow"]').first().within(() => {
      cy.get('td[name="subjectCell"]').should('contain', 'Password Reset Alert');
      cy.get('td[name="messageCell"]').should('not.contain', 'password'); // Ensure password is not included
      cy.get('td[name="messageCell"]').should('contain', 'MID:'); // Ensure MID is included
    });
  });

  it('Send email alert for appointment request status change', () => {
    // Simulate an appointment request status change
    cy.intercept('POST', '/api/appointment/status/change', { statusCode: 200 }).as('changeAppointmentStatus');
    cy.visit('/iTrust2/viewEmails');
    
    // Wait for the appointment status change event to be processed
    cy.wait('@changeAppointmentStatus');

    // Check the email log for the appointment status change alert
    cy.get('tr[name="emailTableRow"]').first().within(() => {
      cy.get('td[name="subjectCell"]').should('contain', 'Appointment Status Change');
      cy.get('td[name="messageCell"]').should('contain', 'Your appointment status has changed.'); // Notify patient
    });
  });

  it('Send email alert for account lockout due to failed logins', () => {
    // Simulate account lockout due to failed logins
    cy.intercept('POST', '/api/account/lockout', { statusCode: 200 }).as('lockoutAccount');
    cy.visit('/iTrust2/viewEmails');
    
    // Wait for the account lockout event to be processed
    cy.wait('@lockoutAccount');

    // Check the email log for the account lockout alert
    cy.get('tr[name="emailTableRow"]').first().within(() => {
      cy.get('td[name="subjectCell"]').should('contain', 'Account Lockout Alert');
      cy.get('td[name="messageCell"]').should('contain', 'Your account has been locked due to too many failed login attempts.');
    });
  });

  it('Track all email alerts in the iTrust2 application', () => {
    // Check the email log for any account event
    cy.visit('/iTrust2/viewEmails');

    // Ensure that the log includes the type of event, timestamp, and user's MID
    cy.get('tr[name="emailTableRow"]').each(($row) => {
      cy.wrap($row).within(() => {
        cy.get('td[name="subjectCell"]').should('not.be.empty'); // Ensure subject is present
        cy.get('td[name="messageCell"]').should('not.be.empty'); // Ensure message is present
        cy.get('td[name="receiverCell"]').should('not.be.empty'); // Ensure receiver is present
      });
    });
  });

  afterEach(() => {
    // Log out after each test
    cy.logout();
  });
});