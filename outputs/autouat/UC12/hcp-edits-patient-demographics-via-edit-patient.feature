Feature: Edit Patient Demographics

  As an HCP
  I want to select a patient to edit from the list of patients and edit that patient's demographics
  So that patient records are up to date

  Scenario: Successfully edit patient demographics
    Given I am logged in as an HCP
    And I have accessed the patient list
    When I select a patient from the list
    And the patient's current demographics are displayed in the form
    And I edit the patient's demographics with valid data
    And I press the Submit button
    Then I should see a success message indicating the data has been updated
    And the patient's demographics should reflect the updated information

  Scenario: Attempt to submit with invalid data
    Given I am logged in as an HCP
    And I have accessed the patient list
    When I select a patient from the list
    And the patient's current demographics are displayed in the form
    And I edit the patient's demographics with invalid data
    And I press the Submit button
    Then I should see an error message indicating the data entered is invalid
    And the system should highlight the fields that are incorrect or invalid

  Scenario: Attempt to submit with missing required fields
    Given I am logged in as an HCP
    And I have accessed the patient list
    When I select a patient from the list
    And the patient's current demographics are displayed in the form
    And I leave required fields empty
    And I press the Submit button
    Then I should see an error message indicating required fields are missing
    And the system should highlight the missing required fields

  Scenario: Cancel editing patient demographics
    Given I am logged in as an HCP
    And I have accessed the patient list
    When I select a patient from the list
    And the patient's current demographics are displayed in the form
    And I make changes to the patient's demographics
    And I press the Cancel button
    Then I should be redirected back to the patient list
    And the patient's demographics should remain unchanged

  Scenario: Edit demographics of a patient not in the list
    Given I am logged in as an HCP
    When I attempt to select a patient that is not in the list
    Then I should see an error message indicating the patient cannot be found
