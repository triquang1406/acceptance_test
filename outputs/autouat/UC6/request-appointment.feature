Feature: Request Appointment

  As a patient
  I want to request an appointment with an HCP
  So that I can schedule care

  Scenario: Successfully request an appointment with valid data
    Given I am on the appointment request page
    When I enter "Dr. Smith" as the HCP
    And I select "2023-10-15" as the date
    And I select "10:00 AM" as the time
    And I enter "Looking forward to the appointment" as comments
    And I select "General Checkup" as the type
    And I click on the "Request Appointment" button
    Then I should see a confirmation message "Your appointment request has been submitted successfully."

  Scenario: Request appointment with missing HCP
    Given I am on the appointment request page
    When I enter "" as the HCP
    And I select "2023-10-15" as the date
    And I select "10:00 AM" as the time
    And I enter "Looking forward to the appointment" as comments
    And I select "General Checkup" as the type
    And I click on the "Request Appointment" button
    Then I should see an error message "HCP is required."

  Scenario: Request appointment with invalid date format
    Given I am on the appointment request page
    When I enter "Dr. Smith" as the HCP
    And I select "15-10-2023" as the date
    And I select "10:00 AM" as the time
    And I enter "Looking forward to the appointment" as comments
    And I select "General Checkup" as the type
    And I click on the "Request Appointment" button
    Then I should see an error message "Please enter a valid date format (YYYY-MM-DD)."

  Scenario: Request appointment with missing time
    Given I am on the appointment request page
    When I enter "Dr. Smith" as the HCP
    And I select "2023-10-15" as the date
    And I enter "" as the time
    And I enter "Looking forward to the appointment" as comments
    And I select "General Checkup" as the type
    And I click on the "Request Appointment" button
    Then I should see an error message "Time is required."

  Scenario: Request appointment with invalid time format
    Given I am on the appointment request page
    When I enter "Dr. Smith" as the HCP
    And I select "2023-10-15" as the date
    And I select "25:00" as the time
    And I enter "Looking forward to the appointment" as comments
    And I select "General Checkup" as the type
    And I click on the "Request Appointment" button
    Then I should see an error message "Please enter a valid time format (HH:MM AM/PM)."

  Scenario: Request appointment with missing type
    Given I am on the appointment request page
    When I enter "Dr. Smith" as the HCP
    And I select "2023-10-15" as the date
    And I select "10:00 AM" as the time
    And I enter "Looking forward to the appointment" as comments
    And I enter "" as the type
    And I click on the "Request Appointment" button
    Then I should see an error message "Type of appointment is required."
