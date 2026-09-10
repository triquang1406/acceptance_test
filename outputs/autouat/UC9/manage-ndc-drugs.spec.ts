describe('Manage NDC drugs', () => {
  beforeEach(() => {
    // Log in as Admin before each test
    cy.loginAsAdmin();
    cy.visit('/iTrust2/admin/drugs');
  });

  it('Successfully adding a new drug with valid data', () => {
    // Enter valid NDC, name, and description
    cy.get('input[name="code"]').type('1234-5678-90'); // Enter NDC
    cy.get('input[name="drug"]').type('Test Drug'); // Enter drug name
    cy.get('textarea[name="description"]').type('This is a test drug.'); // Enter description
    cy.get('button[name="submit"]').click(); // Press submit

    // Assert success message and drug list inclusion
    cy.contains('Drug added successfully.').should('be.visible');
    cy.contains('Test Drug').should('be.visible');
  });

  it('Successfully editing an existing drug with valid data', () => {
    // Assuming the drug "Test Drug" exists with NDC "1234-5678-90"
    // Edit the drug details
    cy.get('input[name="code"]').clear().type('1234-5678-91'); // Edit NDC
    cy.get('input[name="drug"]').clear().type('Updated Test Drug'); // Edit drug name
    cy.get('textarea[name="description"]').clear().type('This is an updated test drug.'); // Edit description
    cy.get('button[name="submit"]').click(); // Press submit

    // Assert success message and drug list changes
    cy.contains('Drug updated successfully.').should('be.visible');
    cy.contains('Updated Test Drug').should('be.visible');
    cy.contains('Test Drug').should('not.exist'); // Ensure old drug is removed
  });

  it('Adding a new drug with an invalid NDC format', () => {
    // Enter invalid NDC format
    cy.get('input[name="code"]').type('12345-678-90'); // Invalid NDC
    cy.get('input[name="drug"]').type('Invalid Drug'); // Enter drug name
    cy.get('textarea[name="description"]').type('This drug has an invalid NDC.'); // Enter description
    cy.get('button[name="submit"]').click(); // Press submit

    // Assert error message
    cy.contains('Invalid NDC format.').should('be.visible');
  });

  it('Adding a new drug with missing name', () => {
    // Enter valid NDC and description but leave name empty
    cy.get('input[name="code"]').type('1234-5678-90'); // Enter NDC
    cy.get('input[name="drug"]').clear(); // Leave name empty
    cy.get('textarea[name="description"]').type('This drug has no name.'); // Enter description
    cy.get('button[name="submit"]').click(); // Press submit

    // Assert error message
    cy.contains('Name is required.').should('be.visible');
  });

  it('Editing a drug with an invalid NDC format', () => {
    // Assuming the drug "Test Drug" exists with NDC "1234-5678-90"
    cy.get('input[name="code"]').clear().type('12345-678-90'); // Invalid NDC
    cy.get('button[name="submit"]').click(); // Press submit

    // Assert error message
    cy.contains('Invalid NDC format.').should('be.visible');
  });

  it('Editing a drug with missing name', () => {
    // Assuming the drug "Test Drug" exists with NDC "1234-5678-90"
    cy.get('input[name="drug"]').clear(); // Leave name empty
    cy.get('button[name="submit"]').click(); // Press submit

    // Assert error message
    cy.contains('Name is required.').should('be.visible');
  });
});