describe('Display recent access events on landing screen', () => {
  
  beforeEach(() => {
    // Navigate to the login page before each test
    cy.visit('/iTrust2/admin/index');
  });

  it('User logs in and sees the ten most recent access events', () => {
    // Log in with valid credentials
    cy.loginAsAdmin();
    
    // Check that the landing screen displays the ten most recent access events
    cy.get('table[name="log_table"] tbody tr[name="logTableRow"]').should('have.length', 10);
    
    // Check that the access events are displayed in descending order by date and time
    cy.get('table[name="log_table"] tbody tr[name="logTableRow"]').each(($row, index) => {
      if (index < 9) {
        const currentDate = new Date($row.find('td[name="dateCell"]').text());
        const nextDate = new Date($row.next().find('td[name="dateCell"]').text());
        expect(currentDate).to.be.greaterThan(nextDate);
      }
    });
  });

  it('User logs in with no access events', () => {
    // Log in with valid credentials and ensure there are no access events
    cy.loginAsAdmin();
    
    // Check for the message indicating no recent access events
    cy.get('table[name="log_table"] tbody').should('not.exist');
    cy.contains('No recent access events').should('be.visible');
  });

  it('User logs in and sees access events with different types', () => {
    // Log in with valid credentials
    cy.loginAsAdmin();
    
    // Check that the landing screen displays various types of access events
    cy.get('table[name="log_table"] tbody tr[name="logTableRow"]').each(($row) => {
      const transactionType = $row.find('td[name="transactionTypeCell"]').text();
      expect(transactionType).to.be.oneOf(['login', 'logout', 'file access']);
    });
  });

  it('User logs in and the access events list exceeds ten entries', () => {
    // Log in with valid credentials
    cy.loginAsAdmin();
    
    // Check that only the ten most recent access events are displayed
    cy.get('table[name="log_table"] tbody tr[name="logTableRow"]').should('have.length.at.most', 10);
  });

  it('User logs in multiple times and sees updated access events', () => {
    // Log in with valid credentials
    cy.loginAsAdmin();
    
    // Log out and log in again
    cy.logout();
    cy.loginAsAdmin();
    
    // Check that the landing screen displays the updated list of access events
    cy.get('table[name="log_table"] tbody tr[name="logTableRow"]').should('exist');
  });

  it('User logs in and access events contain timestamps', () => {
    // Log in with valid credentials
    cy.loginAsAdmin();
    
    // Check that each access event displayed includes a timestamp
    cy.get('table[name="log_table"] tbody tr[name="logTableRow"]').each(($row) => {
      const dateCell = $row.find('td[name="dateCell"]').text();
      expect(dateCell).to.not.be.empty;
    });
  });

  it('User logs in and access events contain user details', () => {
    // Log in with valid credentials
    cy.loginAsAdmin();
    
    // Check that each access event displayed includes user details
    cy.get('table[name="log_table"] tbody tr[name="logTableRow"]').each(($row) => {
      const primaryUser = $row.find('td[name="primaryUserCell"]').text();
      const secondaryUser = $row.find('td[name="secondaryUserCell"]').text();
      expect(primaryUser).to.not.be.empty;
      expect(secondaryUser).to.not.be.empty;
    });
  });
});