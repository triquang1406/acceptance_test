Feature: Edit Patient Demographics

  As an HCP
  I want to enter the MID of a patient and then enter or edit that patient's demographic information
  So that patient records are correct

  Scenario: Successfully edit patient demographics with valid data
    Given I am an HCP
    And I have the MID of a patient
    When I enter the MID "123456"
    And I enter the patient's name "John Doe"
    And I enter the patient's date of birth "01/15/1985"
    And I enter the patient's address "123 Main St, Anytown, USA"
    And I submit the demographic information
    Then the patient's demographic information should be updated successfully
    And I should see a confirmation message "Patient demographics updated successfully."

  Scenario: Attempt to edit patient demographics with missing required fields
    Given I am an HCP
    And I have the MID of a patient
    When I enter the MID "123456"
    And I leave the patient's name blank
    And I enter the patient's date of birth "01/15/1985"
    And I enter the patient's address "123 Main St, Anytown, USA"
    And I submit the demographic information
    Then I should see an error message "Name is a required field."

  Scenario: Attempt to edit patient demographics with invalid date format
    Given I am an HCP
    And I have the MID of a patient
    When I enter the MID "123456"
    And I enter the patient's name "John Doe"
    And I enter the patient's date of birth "15/01/1985"
    And I enter the patient's address "123 Main St, Anytown, USA"
    And I submit the demographic information
    Then I should see an error message "Date of birth must be in MM/DD/YYYY format."

  Scenario: Attempt to edit patient demographics with an invalid MID
    Given I am an HCP
    When I enter an invalid MID "abc123"
    And I submit the demographic information
    Then I should see an error message "Invalid MID. Please enter a valid MID."

  Scenario: Attempt to edit patient demographics with all fields blank
    Given I am an HCP
    When I enter the MID "123456"
    And I leave all fields blank
    And I submit the demographic information
    Then I should see error messages for all required fields:
      | Field Name | Error Message                     |
      | Name       | Name is a required field.        |
      | DOB        | Date of birth is a required field.|
      | Address    | Address is a required field.     |
