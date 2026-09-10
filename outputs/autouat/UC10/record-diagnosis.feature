Feature: Record diagnosis

  As an HCP
  I want to record a diagnosis of a patient in an office visit and provide additional data about the diagnosis
  So that the diagnosis is documented

  Scenario: Successfully record a diagnosis with valid data
    Given I am logged in as a healthcare provider
    When I select a diagnosis from the menu with ICD-10 code "A00" and description "Cholera"
    And I enter the date of the office visit as "2023-10-01"
    And I enter the HCP name as "Dr. Smith"
    And I enter notes as "Patient shows symptoms consistent with cholera."
    And I press the Save Diagnosis button
    Then I should see a message "Diagnosis documented successfully."

  Scenario: Attempt to record a diagnosis with notes exceeding character limit
    Given I am logged in as a healthcare provider
    When I select a diagnosis from the menu with ICD-10 code "A00" and description "Cholera"
    And I enter the date of the office visit as "2023-10-01"
    And I enter the HCP name as "Dr. Smith"
    And I enter notes as "This is a very long note that exceeds the character limit of five hundred characters. " repeated 20 times
    And I press the Save Diagnosis button
    Then I should see an error message "Notes must not exceed 500 characters."

  Scenario: Attempt to record a diagnosis without selecting a diagnosis
    Given I am logged in as a healthcare provider
    When I do not select a diagnosis from the menu
    And I enter the date of the office visit as "2023-10-01"
    And I enter the HCP name as "Dr. Smith"
    And I enter notes as "Patient shows symptoms consistent with cholera."
    And I press the Save Diagnosis button
    Then I should see an error message "Diagnosis must be selected."

  Scenario: Attempt to record a diagnosis with an invalid date format
    Given I am logged in as a healthcare provider
    When I select a diagnosis from the menu with ICD-10 code "A00" and description "Cholera"
    And I enter the date of the office visit as "01-10-2023"
    And I enter the HCP name as "Dr. Smith"
    And I enter notes as "Patient shows symptoms consistent with cholera."
    And I press the Save Diagnosis button
    Then I should see an error message "Date must be in the format YYYY-MM-DD."

  Scenario: Attempt to record a diagnosis without entering HCP name
    Given I am logged in as a healthcare provider
    When I select a diagnosis from the menu with ICD-10 code "A00" and description "Cholera"
    And I enter the date of the office visit as "2023-10-01"
    And I do not enter the HCP name
    And I enter notes as "Patient shows symptoms consistent with cholera."
    And I press the Save Diagnosis button
    Then I should see an error message "HCP name must be provided."
