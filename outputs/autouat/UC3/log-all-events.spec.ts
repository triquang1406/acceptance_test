describe('Log all events', () => {
  const userMID = "12345";
  const secondaryMID = "67890";
  const invalidMID = "99999";

  beforeEach(() => {
    // Ensure the user is logged in before each test
    cy.login(userMID);
  });

  it('Log a successful login', () => {
    // Log in the user
    cy.login(userMID);
    
    // Check if the log entry is created with transaction code "2"
    cy.get('table[name="log_table"]').find('tr[name="logTableRow"]').last().within(() => {
      cy.get('td[name="transactionTypeCell"]').should('contain', '2');
      cy.get('td[name="primaryUserCell"]').should('contain', userMID);
      cy.get('td[name="dateCell"]').should('exist'); // Check if timestamp exists
    });
  });

  it('Log a failed login attempt', () => {
    // Attempt to log in with incorrect credentials
    cy.login(userMID, 'wrongpassword');

    // Check if the log entry is created with transaction code "1"
    cy.get('table[name="log_table"]').find('tr[name="logTableRow"]').last().within(() => {
      cy.get('td[name="transactionTypeCell"]').should('contain', '1');
      cy.get('td[name="primaryUserCell"]').should('contain', userMID);
      cy.get('td[name="dateCell"]').should('exist'); // Check if timestamp exists
    });
  });

  it('Log a user logout', () => {
    // Log out the user
    cy.logout();

    // Check if the log entry is created with transaction code "3"
    cy.get('table[name="log_table"]').find('tr[name="logTableRow"]').last().within(() => {
      cy.get('td[name="transactionTypeCell"]').should('contain', '3');
      cy.get('td[name="primaryUserCell"]').should('contain', userMID);
      cy.get('td[name="dateCell"]').should('exist'); // Check if timestamp exists
    });
  });

  it('Log viewing the home page', () => {
    // View the home page
    cy.visit('/iTrust2/admin/index');

    // Check if the log entry is created with transaction code "10"
    cy.get('table[name="log_table"]').find('tr[name="logTableRow"]').last().within(() => {
      cy.get('td[name="transactionTypeCell"]').should('contain', '10');
      cy.get('td[name="primaryUserCell"]').should('contain', userMID);
      cy.get('td[name="dateCell"]').should('exist'); // Check if timestamp exists
    });
  });

  it('Log creating patient information', () => {
    // Simulate creating patient information
    cy.visit('/iTrust2/admin/index'); // Navigate to user management
    // Assume there is a form to create a patient, fill it out and submit
    cy.get('input[name="patientMID"]').type(secondaryMID);
    cy.get('button[name="submit"]').click(); // Submit the form

    // Check if the log entry is created with transaction code "100"
    cy.get('table[name="log_table"]').find('tr[name="logTableRow"]').last().within(() => {
      cy.get('td[name="transactionTypeCell"]').should('contain', '100');
      cy.get('td[name="primaryUserCell"]').should('contain', userMID);
      cy.get('td[name="secondaryUserCell"]').should('contain', secondaryMID);
      cy.get('td[name="dateCell"]').should('exist'); // Check if timestamp exists
    });
  });

  it('Log viewing patient information', () => {
    // Simulate viewing patient information
    cy.visit(`/iTrust2/patient/view/${secondaryMID}`); // Navigate to view patient

    // Check if the log entry is created with transaction code "101"
    cy.get('table[name="log_table"]').find('tr[name="logTableRow"]').last().within(() => {
      cy.get('td[name="transactionTypeCell"]').should('contain', '101');
      cy.get('td[name="primaryUserCell"]').should('contain', userMID);
      cy.get('td[name="secondaryUserCell"]').should('contain', secondaryMID);
      cy.get('td[name="dateCell"]').should('exist'); // Check if timestamp exists
    });
  });

  it('Log editing patient information', () => {
    // Simulate editing patient information
    cy.visit(`/iTrust2/patient/edit/${secondaryMID}`); // Navigate to edit patient
    // Assume there is a form to edit a patient, fill it out and submit
    cy.get('input[name="patientName"]').clear().type('Updated Name');
    cy.get('button[name="submit"]').click(); // Submit the form

    // Check if the log entry is created with transaction code "102"
    cy.get('table[name="log_table"]').find('tr[name="logTableRow"]').last().within(() => {
      cy.get('td[name="transactionTypeCell"]').should('contain', '102');
      cy.get('td[name="primaryUserCell"]').should('contain', userMID);
      cy.get('td[name="secondaryUserCell"]').should('contain', secondaryMID);
      cy.get('td[name="dateCell"]').should('exist'); // Check if timestamp exists
    });
  });

  it('Log deleting patient information', () => {
    // Simulate deleting patient information
    cy.visit(`/iTrust2/patient/delete/${secondaryMID}`); // Navigate to delete patient
    cy.get('button[name="confirmDelete"]').click(); // Confirm deletion

    // Check if the log entry is created with transaction code "103"
    cy.get('table[name="log_table"]').find('tr[name="logTableRow"]').last().within(() => {
      cy.get('td[name="transactionTypeCell"]').should('contain', '103');
      cy.get('td[name="primaryUserCell"]').should('contain', userMID);
      cy.get('td[name="secondaryUserCell"]').should('contain', secondaryMID);
      cy.get('td[name="dateCell"]').should('exist'); // Check if timestamp exists
    });
  });

  it('Log viewing patient information with invalid MID', () => {
    // Attempt to view patient information with an invalid MID
    cy.visit(`/iTrust2/patient/view/${invalidMID}`); // Navigate to view patient with invalid MID

    // Check that no log entry is created and an error message is displayed
    cy.get('table[name="log_table"]').find('tr[name="logTableRow"]').should('have.length', 0); // No log entry should be created
    cy.get('.error-message').should('contain', 'Patient not found'); // Assuming there is an error message element
  });
});