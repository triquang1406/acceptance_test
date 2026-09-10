Feature: Patient edits own demographics

  As a patient
  I want to enter or edit my own demographic information
  So that my records stay accurate

  Scenario: Successfully edit demographic information
    Given I am logged in as a patient
    When I navigate to the "Edit Demographics" page
    And I enter valid demographic information
      | Field          | Value               |
      | First Name     | John                |
      | Last Name      | Doe                 |
      | Date of Birth  | 1990-01-01          |
      | Email          | john.doe@example.com|
      | Phone Number   | 123-456-7890        |
    And I click the "Save" button
    Then I should see a success message "Demographic information updated successfully"
    And my demographic information should be updated in the system

  Scenario: Attempt to edit demographic information with missing required fields
    Given I am logged in as a patient
    When I navigate to the "Edit Demographics" page
    And I leave the "First Name" field empty
    And I enter valid values for other fields
      | Field          | Value               |
      | Last Name      | Doe                 |
      | Date of Birth  | 1990-01-01          |
      | Email          | john.doe@example.com|
      | Phone Number   | 123-456-7890        |
    And I click the "Save" button
    Then I should see an error message "First Name is required"

  Scenario: Attempt to edit demographic information with invalid email format
    Given I am logged in as a patient
    When I navigate to the "Edit Demographics" page
    And I enter an invalid email format
      | Field          | Value               |
      | First Name     | John                |
      | Last Name      | Doe                 |
      | Date of Birth  | 1990-01-01          |
      | Email          | john.doe@com        |
      | Phone Number   | 123-456-7890        |
    And I click the "Save" button
    Then I should see an error message "Email format is invalid"

  Scenario: Attempt to edit demographic information with invalid phone number format
    Given I am logged in as a patient
    When I navigate to the "Edit Demographics" page
    And I enter an invalid phone number format
      | Field          | Value               |
      | First Name     | John                |
      | Last Name      | Doe                 |
      | Date of Birth  | 1990-01-01          |
      | Email          | john.doe@example.com|
      | Phone Number   | 123456              |
    And I click the "Save" button
    Then I should see an error message "Phone Number format is invalid"

  Scenario: Attempt to edit demographic information with future date of birth
    Given I am logged in as a patient
    When I navigate to the "Edit Demographics" page
    And I enter a future date for "Date of Birth"
      | Field          | Value               |
      | First Name     | John                |
      | Last Name      | Doe                 |
      | Date of Birth  | 2025-01-01          |
      | Email          | john.doe@example.com|
      | Phone Number   | 123-456-7890        |
    And I click the "Save" button
    Then I should see an error message "Date of Birth cannot be in the future"
