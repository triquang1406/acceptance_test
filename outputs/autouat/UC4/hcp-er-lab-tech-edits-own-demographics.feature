Feature: Edit Own Demographics

  As an HCP, an ER, or a Lab Tech
  I want to enter or edit my own demographic information
  So that my contact details are current

  Scenario: Successfully edit demographic information
    Given I am logged in as an HCP/ER/Lab Tech
    When I navigate to the demographics edit page
    And I enter valid information in all required fields
    And I submit the changes
    Then I should see a confirmation message that my demographics have been updated successfully
    And my updated demographic information should be displayed correctly

  Scenario: Attempt to edit demographic information with missing required fields
    Given I am logged in as an HCP/ER/Lab Tech
    When I navigate to the demographics edit page
    And I leave a required field empty
    And I submit the changes
    Then I should see an error message indicating the required field is missing

  Scenario: Attempt to edit demographic information with invalid data format
    Given I am logged in as an HCP/ER/Lab Tech
    When I navigate to the demographics edit page
    And I enter an invalid format in a required field (e.g., invalid email format)
    And I submit the changes
    Then I should see an error message indicating the data format is incorrect

  Scenario: Attempt to edit demographic information with partially valid data
    Given I am logged in as an HCP/ER/Lab Tech
    When I navigate to the demographics edit page
    And I enter valid information in some fields and invalid information in others
    And I submit the changes
    Then I should see an error message indicating the fields with invalid data

  Scenario: Verify that the user can view their current demographic information
    Given I am logged in as an HCP/ER/Lab Tech
    When I navigate to the demographics view page
    Then I should see my current demographic information displayed correctly
