describe('Document Office Visit', () => {
  beforeEach(() => {
    // Log in as HCP before each test
    cy.loginAsHCP();
    // Navigate to the Document Office Visit page
    cy.visit('/iTrust2/hcp/documentOfficeVisit');
  });

  it('Successfully document a prescheduled office visit', () => {
    // Fill in the office visit details
    cy.get('#date').type('2023-10-15'); // Enter date
    cy.get('#time').type('10:00 AM'); // Enter time
    cy.get('input[name="preScheduled"]').check(); // Check prescheduled
    cy.get('input[name="notesEntry"]').type('Patient was feeling well.'); // Enter notes
    cy.get('input[name="name"][value="John Doe"]').check(); // Select patient
    cy.get('input[name="GENERAL_CHECKUP"]').check(); // Select appointment type
    cy.get('input[name="hospital"][value="City Hospital"]').check(); // Select hospital
    cy.get('button[name="submit"]').click(); // Submit the form

    // Assert success message
    cy.get('div[name="success"]').should('contain', 'Office visit recorded successfully.');
  });

  it('Successfully document an office visit with additional details for General Checkup', () => {
    // Fill in the office visit details
    cy.get('#date').type('2023-10-20'); // Enter date
    cy.get('#time').type('11:00 AM'); // Enter time
    cy.get('input[name="preScheduled"]').check(); // Check prescheduled
    cy.get('input[name="notesEntry"]').type('Routine checkup.'); // Enter notes
    cy.get('input[name="name"][value="Jane Smith"]').check(); // Select patient
    cy.get('input[name="GENERAL_CHECKUP"]').check(); // Select appointment type
    cy.get('input[name="hospital"][value="General Hospital"]').check(); // Select hospital
    cy.get('input[name="height"]').type('170'); // Enter height
    cy.get('input[name="weight"]').type('70'); // Enter weight
    cy.get('button[name="submit"]').click(); // Submit the form

    // Assert success message
    cy.get('div[name="success"]').should('contain', 'Office visit recorded successfully.');
  });

  it('Successfully document an office visit with additional details for Ophthalmology Office Visit', () => {
    // Fill in the office visit details
    cy.get('#date').type('2023-10-22'); // Enter date
    cy.get('#time').type('02:00 PM'); // Enter time
    cy.get('input[name="preScheduled"]').check(); // Check prescheduled
    cy.get('input[name="notesEntry"]').type('Patient has blurred vision.'); // Enter notes
    cy.get('input[name="name"][value="Alice Johnson"]').check(); // Select patient
    cy.get('input[name="Ophthalmology Office Visit"]').check(); // Select appointment type
    cy.get('input[name="hospital"][value="Eye Care Center"]').check(); // Select hospital
    cy.get('textarea[name="procNotes"]').type('Eye exam and prescription'); // Enter ophthalmology details
    cy.get('button[name="submit"]').click(); // Submit the form

    // Assert success message
    cy.get('div[name="success"]').should('contain', 'Office visit recorded successfully.');
  });

  it('Successfully document an office visit with additional details for Ophthalmology Surgery', () => {
    // Fill in the office visit details
    cy.get('#date').type('2023-10-25'); // Enter date
    cy.get('#time').type('09:00 AM'); // Enter time
    cy.get('input[name="preScheduled"]').check(); // Check prescheduled
    cy.get('input[name="notesEntry"]').type('Surgery scheduled for cataract.'); // Enter notes
    cy.get('input[name="name"][value="Bob Brown"]').check(); // Select patient
    cy.get('input[name="Ophthalmology Surgery"]').check(); // Select appointment type
    cy.get('input[name="hospital"][value="Surgical Center"]').check(); // Select hospital
    cy.get('textarea[name="procNotes"]').type('Cataract removal'); // Enter surgery details
    cy.get('button[name="submit"]').click(); // Submit the form

    // Assert success message
    cy.get('div[name="success"]').should('contain', 'Office visit recorded successfully.');
  });

  it('Error when required fields are missing', () => {
    // Fill in the office visit details with missing required fields
    cy.get('#date').type('2023-10-30'); // Enter date
    cy.get('#time').type('10:00 AM'); // Enter time
    cy.get('input[name="preScheduled"]').check(); // Check prescheduled
    cy.get('input[name="notesEntry"]').clear(); // Clear notes
    cy.get('input[name="name"]').first().check(); // Select first patient
    cy.get('input[name="GENERAL_CHECKUP"]').check(); // Select appointment type
    cy.get('input[name="hospital"][value="City Hospital"]').check(); // Select hospital
    cy.get('button[name="submit"]').click(); // Submit the form

    // Assert error message
    cy.get('div[name="errorMsg"]').should('contain', 'Notes and Patient are required fields.');
  });

  it('Error when notes exceed character limit', () => {
    // Fill in the office visit details with long notes
    cy.get('#date').type('2023-10-15'); // Enter date
    cy.get('#time').type('10:00 AM'); // Enter time
    cy.get('input[name="preScheduled"]').check(); // Check prescheduled
    cy.get('input[name="notesEntry"]').type('This is a very long note that exceeds the maximum character limit of five hundred characters. It goes on and on without stopping, detailing every single aspect of the patient\'s visit, including their history, symptoms, and any other relevant information that might be necessary for future reference.'); // Enter long notes
    cy.get('input[name="name"][value="John Doe"]').check(); // Select patient
    cy.get('input[name="GENERAL_CHECKUP"]').check(); // Select appointment type
    cy.get('input[name="hospital"][value="City Hospital"]').check(); // Select hospital
    cy.get('button[name="submit"]').click(); // Submit the form

    // Assert error message
    cy.get('div[name="errorMsg"]').should('contain', 'Notes must not exceed 500 characters.');
  });

  it('Error when date format is incorrect', () => {
    // Fill in the office visit details with incorrect date format
    cy.get('#date').type('15-10-2023'); // Enter incorrect date format
    cy.get('#time').type('10:00 AM'); // Enter time
    cy.get('input[name="preScheduled"]').check(); // Check prescheduled
    cy.get('input[name="notesEntry"]').type('Patient was feeling well.'); // Enter notes
    cy.get('input[name="name"][value="John Doe"]').check(); // Select patient
    cy.get('input[name="GENERAL_CHECKUP"]').check(); // Select appointment type
    cy.get('input[name="hospital"][value="City Hospital"]').check(); // Select hospital
    cy.get('button[name="submit"]').click(); // Submit the form

    // Assert error message
    cy.get('div[name="errorMsg"]').should('contain', 'Date must be in the format YYYY-MM-DD.');
  });
});