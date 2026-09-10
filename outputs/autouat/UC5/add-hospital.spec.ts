describe('Add Hospital', () => {
  beforeEach(() => {
    // Log in as Admin before each test
    cy.loginAsAdmin();
    // Navigate to the manage hospitals page
    cy.visit('/iTrust2/admin/hospitals');
  });

  it('Successfully adding a hospital with valid details', () => {
    // Fill in the hospital details
    cy.get('#name').type('General Hospital'); // Hospital name
    cy.get('#address').type('123 Main St'); // Address
    cy.get('#state').select('CA'); // State
    cy.get('#zip').type('12345-6789'); // Zip code
    cy.get('#submit').click(); // Click the Add Hospital button

    // Assert confirmation message
    cy.get('#success').should('contain', 'Hospital added successfully');
  });

  it('Attempting to add a hospital without a name', () => {
    // Fill in the details without a hospital name
    cy.get('#address').type('123 Main St'); // Address
    cy.get('#state').select('CA'); // State
    cy.get('#zip').type('12345'); // Zip code
    cy.get('#submit').click(); // Click the Add Hospital button

    // Assert error message
    cy.get('#errP').should('contain', 'Hospital name is required');
  });

  it('Attempting to add a hospital with an invalid state abbreviation', () => {
    // Fill in the hospital details with an invalid state
    cy.get('#name').type('General Hospital'); // Hospital name
    cy.get('#address').type('123 Main St'); // Address
    cy.get('#state').select('California'); // Invalid state
    cy.get('#zip').type('12345'); // Zip code
    cy.get('#submit').click(); // Click the Add Hospital button

    // Assert error message
    cy.get('#errP').should('contain', 'State must be a valid two-letter abbreviation');
  });

  it('Attempting to add a hospital with an invalid zip code format', () => {
    // Fill in the hospital details with an invalid zip code
    cy.get('#name').type('General Hospital'); // Hospital name
    cy.get('#address').type('123 Main St'); // Address
    cy.get('#state').select('CA'); // State
    cy.get('#zip').type('1234'); // Invalid zip code
    cy.get('#submit').click(); // Click the Add Hospital button

    // Assert error message
    cy.get('#errP').should('contain', 'Zip code must be in the format XXXXX or XXXXX-XXXX');
  });

  it('Attempting to add a hospital with a zip code missing the optional part', () => {
    // Fill in the hospital details with a valid zip code
    cy.get('#name').type('General Hospital'); // Hospital name
    cy.get('#address').type('123 Main St'); // Address
    cy.get('#state').select('CA'); // State
    cy.get('#zip').type('12345'); // Zip code
    cy.get('#submit').click(); // Click the Add Hospital button

    // Assert confirmation message
    cy.get('#success').should('contain', 'Hospital added successfully');
  });

  it('Attempting to add a hospital with an empty address', () => {
    // Fill in the hospital details without an address
    cy.get('#name').type('General Hospital'); // Hospital name
    cy.get('#state').select('CA'); // State
    cy.get('#zip').type('12345'); // Zip code
    cy.get('#submit').click(); // Click the Add Hospital button

    // Assert error message
    cy.get('#errP').should('contain', 'Address is required');
  });
});