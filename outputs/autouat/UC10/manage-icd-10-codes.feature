Feature: Manage ICD-10 codes

  As an Admin
  I want to add a diagnosis by entering its ICD-10 code and description,
  and remove a diagnosis by selecting a diagnosis from the list and confirming the delete
  So that the diagnosis list is maintained

  Scenario: Successfully adding a valid ICD-10 code and description
    Given I am logged in as an Admin
    When I enter a valid ICD-10 code "A00" and description "Cholera"
    And I click on the "Add Diagnosis" button
    Then I should see a message "Diagnosis added successfully"
    And the diagnosis list should include "A00 - Cholera"

  Scenario: Adding an ICD-10 code with an invalid format
    Given I am logged in as an Admin
    When I enter an invalid ICD-10 code "123" and description "Invalid Code"
    And I click on the "Add Diagnosis" button
    Then I should see an error message "ICD-10 code must be in the format 'A00'"

  Scenario: Adding a diagnosis without a description
    Given I am logged in as an Admin
    When I enter a valid ICD-10 code "B01" and leave the description blank
    And I click on the "Add Diagnosis" button
    Then I should see an error message "Description cannot be empty"

  Scenario: Successfully removing a diagnosis
    Given I am logged in as an Admin
    And I have added a diagnosis "A00 - Cholera"
    When I select "A00 - Cholera" from the diagnosis list
    And I click on the "Delete Diagnosis" button
    And I confirm the deletion
    Then I should see a message "Diagnosis removed successfully"
    And the diagnosis list should not include "A00 - Cholera"

  Scenario: Attempting to remove a diagnosis that does not exist
    Given I am logged in as an Admin
    When I select "XYZ - Nonexistent Diagnosis" from the diagnosis list
    And I click on the "Delete Diagnosis" button
    And I confirm the deletion
    Then I should see an error message "Diagnosis not found"

  Scenario: Checking the diagnosis list after multiple additions and deletions
    Given I am logged in as an Admin
    When I add the diagnosis "A00 - Cholera"
    And I add the diagnosis "B01 - Influenza"
    And I remove the diagnosis "A00 - Cholera"
    Then the diagnosis list should include "B01 - Influenza"
    And the diagnosis list should not include "A00 - Cholera"
