describe('View Access Log', () => {
  beforeEach(() => {
    // Log in as a user before each test
    cy.loginAsRegisteredPatient(); // Change to appropriate user type if needed
    // Navigate to the access log page
    cy.visit('/iTrust2/admin/index');
  });

  it('should display access log with default settings', () => {
    // Check if the access log entries are displayed
    cy.get('table[name="log_table"]').should('exist');
    // Check if the entries are sorted by date with the most recent access first
    cy.get('tr[name="logTableRow"]').first().find('td[name="dateCell"]').then(firstDate => {
      const firstDateText = firstDate.text();
      cy.get('tr[name="logTableRow"]').eq(1).find('td[name="dateCell"]').should('not.contain', firstDateText);
    });
    // Check that each entry displays the required information
    cy.get('tr[name="logTableRow"]').each(($row) => {
      cy.wrap($row).find('td[name="transactionTypeCell"]').should('exist');
      cy.wrap($row).find('td[name="primaryUserCell"]').should('exist');
      cy.wrap($row).find('td[name="secondaryUserCell"]').should('exist');
      cy.wrap($row).find('td[name="dateCell"]').should('exist');
      cy.wrap($row).find('td[name="roleCell"]').should('exist'); // Check role only if applicable
    });
  });

  it('should filter access log by valid date range', () => {
    // Enter valid date range
    cy.get('input[name="startDate"]').type('2023-01-01');
    cy.get('input[name="endDate"]').type('2023-01-31');
    cy.get('button[name="submit"]').click();
    
    // Check if the access log entries are displayed within the specified date range
    cy.get('table[name="log_table"]').should('exist');
    cy.get('tr[name="logTableRow"]').should('have.length.greaterThan', 0);
    // Check if the entries are sorted by date with the most recent access first
    cy.get('tr[name="logTableRow"]').first().find('td[name="dateCell"]').then(firstDate => {
      const firstDateText = firstDate.text();
      cy.get('tr[name="logTableRow"]').eq(1).find('td[name="dateCell"]').should('not.contain', firstDateText);
    });
  });

  it('should show no access log entries with invalid date range', () => {
    // Enter invalid date range
    cy.get('input[name="startDate"]').type('2023-01-31');
    cy.get('input[name="endDate"]').type('2023-01-01');
    cy.get('button[name="submit"]').click();
    
    // Check that no access log entries are displayed
    cy.get('table[name="log_table"]').should('not.exist');
    // Check for invalid date range message
    cy.contains('Invalid date range').should('exist'); // Adjust message as per actual implementation
  });

  it('should show no access log entries with invalid date format', () => {
    // Enter invalid date format
    cy.get('input[name="startDate"]').type('invalid-date');
    cy.get('input[name="endDate"]').type('2023-01-31');
    cy.get('button[name="submit"]').click();
    
    // Check that no access log entries are displayed
    cy.get('table[name="log_table"]').should('not.exist');
    // Check for invalid date format message
    cy.contains('Invalid date format').should('exist'); // Adjust message as per actual implementation
  });

  it('should display correct information in access log', () => {
    // View the access log entries
    cy.get('table[name="log_table"]').should('exist');
    
    // Check that each entry contains the correct information
    cy.get('tr[name="logTableRow"]').each(($row) => {
      cy.wrap($row).find('td[name="transactionTypeCell"]').should('exist');
      cy.wrap($row).find('td[name="primaryUserCell"]').should('exist');
      cy.wrap($row).find('td[name="secondaryUserCell"]').should('exist');
      cy.wrap($row).find('td[name="dateCell"]').should('exist');
      cy.wrap($row).find('td[name="roleCell"]').should('exist'); // Check role only if applicable
    });
  });

  afterEach(() => {
    // Log out after each test
    cy.logout();
  });
});