Feature: Delete Hospital

  As an Admin
  I want to select a hospital from the list of possible hospitals, confirm the delete, and delete the hospital
  So that the hospital list stays accurate

  Scenario: Successfully delete a hospital
    Given I am logged in as an Admin
    And I have navigated to the hospital management page
    And I see a list of hospitals
    When I select a hospital "City Hospital" from the list
    And I confirm the deletion
    Then the hospital "City Hospital" should no longer be listed
    And I should see a success message "Hospital deleted successfully."

  Scenario: Attempt to delete a hospital that does not exist
    Given I am logged in as an Admin
    And I have navigated to the hospital management page
    And I see a list of hospitals
    When I select a hospital "Nonexistent Hospital" from the list
    And I confirm the deletion
    Then I should see an error message "Hospital not found."

  Scenario: Cancel deletion of a hospital
    Given I am logged in as an Admin
    And I have navigated to the hospital management page
    And I see a list of hospitals
    When I select a hospital "City Hospital" from the list
    And I cancel the deletion
    Then the hospital "City Hospital" should still be listed
    And I should see a message "Deletion cancelled."

  Scenario: Attempt to delete a hospital without confirmation
    Given I am logged in as an Admin
    And I have navigated to the hospital management page
    And I see a list of hospitals
    When I select a hospital "City Hospital" from the list
    And I do not confirm the deletion
    Then the hospital "City Hospital" should still be listed
    And I should see a message "Deletion not confirmed."

  Scenario: Verify that the hospital list updates correctly after deletion
    Given I am logged in as an Admin
    And I have navigated to the hospital management page
    And I see a list of hospitals including "City Hospital" and "Town Clinic"
    When I select "City Hospital" from the list
    And I confirm the deletion
    Then the hospital list should only include "Town Clinic"
    And I should see a success message "Hospital deleted successfully."
