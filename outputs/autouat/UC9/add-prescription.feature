Feature: Add prescription to office visit

  As an HCP
  I want to add a new prescription to the office visit
  So that the patient receives the correct medication

  Scenario: Successfully adding a valid prescription
    Given I am on the office visit page
    When I select a prescription name from the list
    And I enter a dose of 500 milligrams
    And I enter a start date of "2023-10-01"
    And I enter an end date of "2023-10-31"
    And I enter 2 renewals
    And I click on the "Add Prescription" button
    Then the prescription should be added to the visit
    And I should see a confirmation message "Prescription added successfully."

  Scenario: Attempting to add a prescription with an invalid name
    Given I am on the office visit page
    When I select a prescription name that is not in the list
    And I enter a dose of 250 milligrams
    And I enter a start date of "2023-10-01"
    And I enter an end date of "2023-10-15"
    And I enter 1 renewal
    And I click on the "Add Prescription" button
    Then I should see an error message "Invalid prescription name."

  Scenario: Attempting to add a prescription with invalid dose
    Given I am on the office visit page
    When I select a prescription name from the list
    And I enter a dose of -100 milligrams
    And I enter a start date of "2023-10-01"
    And I enter an end date of "2023-10-15"
    And I enter 1 renewal
    And I click on the "Add Prescription" button
    Then I should see an error message "Dose must be a positive number."

  Scenario: Attempting to add a prescription with an invalid date range
    Given I am on the office visit page
    When I select a prescription name from the list
    And I enter a dose of 100 milligrams
    And I enter a start date of "2023-10-15"
    And I enter an end date of "2023-10-01"
    And I enter 1 renewal
    And I click on the "Add Prescription" button
    Then I should see an error message "End date must be after the start date."

  Scenario: Adding multiple prescriptions to the visit
    Given I am on the office visit page
    When I select a prescription name "Prescription A" from the list
    And I enter a dose of 100 milligrams
    And I enter a start date of "2023-10-01"
    And I enter an end date of "2023-10-15"
    And I enter 1 renewal
    And I click on the "Add Prescription" button
    And I select a prescription name "Prescription B" from the list
    And I enter a dose of 200 milligrams
    And I enter a start date of "2023-10-01"
    And I enter an end date of "2023-10-31"
    And I enter 3 renewals
    And I click on the "Add Prescription" button
    Then both prescriptions should be added to the visit
    And I should see a confirmation message "Prescriptions added successfully."

  Scenario: Adding a prescription with zero renewals
    Given I am on the office visit page
    When I select a prescription name from the list
    And I enter a dose of 150 milligrams
    And I enter a start date of "2023-10-01"
    And I enter an end date of "2023-10-15"
    And I enter 0 renewals
    And I click on the "Add Prescription" button
    Then the prescription should be added to the visit
    And I should see a confirmation message "Prescription added successfully."
