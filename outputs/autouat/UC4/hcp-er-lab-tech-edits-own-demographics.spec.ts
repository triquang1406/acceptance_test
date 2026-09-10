describe('Edit Own Demographics', () => {
  
  beforeEach(() => {
    // Log in as HCP, ER, or Lab Tech before each test
    cy.loginAsHCP(); // You can change this to loginAsER() or loginAsLabTech() as needed
  });

  it('Successfully edit demographic information', () => {
    // Navigate to the demographics edit page
    cy.visit('/iTrust2/personnel/editDemographics');

    // Enter valid information in all required fields
    cy.get('#firstName').clear().type('John');
    cy.get('#lastName').clear().type('Doe');
    cy.get('#email').clear().type('john.doe@example.com');
    cy.get('#address1').clear().type('123 Main St');
    cy.get('#address2').clear().type('Apt 4B');
    cy.get('#city').clear().type('Springfield');
    cy.get('#state').select('NY'); // Assuming NY is one of the options
    cy.get('#zip').clear().type('12345');
    cy.get('#phone').clear().type('123-456-7890');

    // Submit the changes
    cy.get('button[name="submit"]').click();

    // Assert confirmation message
    cy.get('div[name="success"]').should('contain', 'Your demographics have been updated successfully');

    // Assert updated demographic information is displayed correctly
    cy.get('#firstName').should('have.value', 'John');
    cy.get('#lastName').should('have.value', 'Doe');
    cy.get('#email').should('have.value', 'john.doe@example.com');
    cy.get('#address1').should('have.value', '123 Main St');
    cy.get('#address2').should('have.value', 'Apt 4B');
    cy.get('#city').should('have.value', 'Springfield');
    cy.get('#zip').should('have.value', '12345');
    cy.get('#phone').should('have.value', '123-456-7890');
  });

  it('Attempt to edit demographic information with missing required fields', () => {
    // Navigate to the demographics edit page
    cy.visit('/iTrust2/personnel/editDemographics');

    // Leave the first name field empty
    cy.get('#firstName').clear();
    cy.get('#lastName').clear().type('Doe');
    cy.get('#email').clear().type('john.doe@example.com');
    cy.get('#address1').clear().type('123 Main St');
    cy.get('#city').clear().type('Springfield');
    cy.get('#state').select('NY');
    cy.get('#zip').clear().type('12345');
    cy.get('#phone').clear().type('123-456-7890');

    // Submit the changes
    cy.get('button[name="submit"]').click();

    // Assert error message for missing required field
    cy.get('td[ng-show="err[0]"]').should('contain', 'This field is required');
  });

  it('Attempt to edit demographic information with invalid data format', () => {
    // Navigate to the demographics edit page
    cy.visit('/iTrust2/personnel/editDemographics');

    // Enter an invalid email format
    cy.get('#firstName').clear().type('John');
    cy.get('#lastName').clear().type('Doe');
    cy.get('#email').clear().type('john.doe@.com'); // Invalid email
    cy.get('#address1').clear().type('123 Main St');
    cy.get('#city').clear().type('Springfield');
    cy.get('#state').select('NY');
    cy.get('#zip').clear().type('12345');
    cy.get('#phone').clear().type('123-456-7890');

    // Submit the changes
    cy.get('button[name="submit"]').click();

    // Assert error message for invalid data format
    cy.get('td[ng-show="err[2]"]').should('contain', 'Invalid email format');
  });

  it('Attempt to edit demographic information with partially valid data', () => {
    // Navigate to the demographics edit page
    cy.visit('/iTrust2/personnel/editDemographics');

    // Enter valid information in some fields and invalid in others
    cy.get('#firstName').clear().type('John');
    cy.get('#lastName').clear().type(''); // Invalid: empty last name
    cy.get('#email').clear().type('john.doe@example.com');
    cy.get('#address1').clear().type('123 Main St');
    cy.get('#city').clear().type('Springfield');
    cy.get('#state').select('NY');
    cy.get('#zip').clear().type('12345');
    cy.get('#phone').clear().type('123-456-7890');

    // Submit the changes
    cy.get('button[name="submit"]').click();

    // Assert error message for invalid fields
    cy.get('td[ng-show="err[1]"]').should('contain', 'This field is required');
  });

  it('Verify that the user can view their current demographic information', () => {
    // Navigate to the demographics view page
    cy.visit('/iTrust2/personnel/editDemographics');

    // Assert current demographic information is displayed correctly
    cy.get('#firstName').should('not.be.empty');
    cy.get('#lastName').should('not.be.empty');
    cy.get('#email').should('not.be.empty');
    cy.get('#address1').should('not.be.empty');
    cy.get('#city').should('not.be.empty');
    cy.get('#state').should('not.be.empty');
    cy.get('#zip').should('not.be.empty');
    cy.get('#phone').should('not.be.empty');
  });

  afterEach(() => {
    // Log out after each test
    cy.logout();
  });
});