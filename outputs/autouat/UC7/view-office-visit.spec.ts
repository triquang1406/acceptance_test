describe('View office visit', () => {
  beforeEach(() => {
    // Log in as a registered patient before each test
    cy.loginAsRegisteredPatient();
    cy.visit('/iTrust2/patient/index');
  });

  it('Successfully viewing an office visit record', () => {
    // Navigate to the office visit records page
    cy.get('#viewOfficeVisits').click();

    // Select the office visit record (assuming the record is displayed in a list)
    cy.get('tr[name="logTableRow"]').first().click(); // Select the first record

    // Assert that the details of the office visit are visible
    cy.contains('Date & Time').should('be.visible');
    cy.contains('HCP Name').should('be.visible'); // Replace with actual HCP name from the record
    cy.contains('Notes').should('be.visible'); // Replace with actual notes from the record
  });

  it('Viewing an office visit record with no notes', () => {
    // Navigate to the office visit records page
    cy.get('#viewOfficeVisits').click();

    // Select the office visit record with no notes (assuming it's the second record)
    cy.get('tr[name="logTableRow"]').eq(1).click(); // Select the second record

    // Assert that the notes section indicates "No notes recorded"
    cy.contains('Notes').should('contain', 'No notes recorded');
  });

  it('Attempting to view an office visit record that does not exist', () => {
    // Log out and log in as a patient with no records
    cy.logout();
    cy.loginAsPatient(); // Assuming this patient has no records

    // Navigate to the office visit records page
    cy.get('#viewOfficeVisits').click();

    // Assert that a message indicating "No office visit records found" is displayed
    cy.contains('No office visit records found').should('be.visible');
  });

  it('Viewing office visit records for multiple visits', () => {
    // Navigate to the office visit records page
    cy.get('#viewOfficeVisits').click();

    // Assert that a list of all office visit records is displayed
    cy.get('tr[name="logTableRow"]').should('have.length.greaterThan', 1); // Assuming there are multiple records

    // Assert that each record displays the date and HCP name
    cy.get('tr[name="logTableRow"]').each(($row) => {
      cy.wrap($row).find('td[name="dateCell"]').should('be.visible');
      cy.wrap($row).find('td[name="primaryUserCell"]').should('be.visible'); // Assuming this is the HCP name
    });
  });

  it('Ensuring the office visit details are not editable', () => {
    // Navigate to the office visit records page
    cy.get('#viewOfficeVisits').click();

    // Select the office visit record
    cy.get('tr[name="logTableRow"]').first().click(); // Select the first record

    // Assert that there are no edit options available
    cy.get('#editOfficeVisit').should('not.exist'); // Assuming this is the edit button
  });

  it('Viewing office visit record with sensitive information', () => {
    // Navigate to the office visit records page
    cy.get('#viewOfficeVisits').click();

    // Select the office visit record with sensitive information
    cy.get('tr[name="logTableRow"]').last().click(); // Select the last record

    // Assert that the sensitive information is displayed in a secure manner
    cy.contains('Sensitive Information').should('be.visible'); // Replace with actual sensitive information
  });
});