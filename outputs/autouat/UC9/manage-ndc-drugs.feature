Feature: Manage NDC drugs

  As an Admin
  I want to add a new drug by entering an NDC, a name, and a description,
  and edit an existing drug by modifying its information and pressing submit
  So that the drug list is kept current

  Scenario: Successfully adding a new drug with valid data
    Given I am logged in as an Admin
    When I enter the NDC "1234-5678-90"
    And I enter the name "Test Drug"
    And I enter the description "This is a test drug."
    And I press submit
    Then I should see a success message "Drug added successfully."
    And the drug list should include "Test Drug"

  Scenario: Successfully editing an existing drug with valid data
    Given I am logged in as an Admin
    And the drug "Test Drug" exists with NDC "1234-5678-90"
    When I edit the NDC to "1234-5678-91"
    And I edit the name to "Updated Test Drug"
    And I edit the description to "This is an updated test drug."
    And I press submit
    Then I should see a success message "Drug updated successfully."
    And the drug list should include "Updated Test Drug"
    And the drug list should not include "Test Drug"

  Scenario: Adding a new drug with an invalid NDC format
    Given I am logged in as an Admin
    When I enter the NDC "12345-678-90"
    And I enter the name "Invalid Drug"
    And I enter the description "This drug has an invalid NDC."
    And I press submit
    Then I should see an error message "Invalid NDC format."

  Scenario: Adding a new drug with missing name
    Given I am logged in as an Admin
    When I enter the NDC "1234-5678-90"
    And I enter the name ""
    And I enter the description "This drug has no name."
    And I press submit
    Then I should see an error message "Name is required."

  Scenario: Editing a drug with an invalid NDC format
    Given I am logged in as an Admin
    And the drug "Test Drug" exists with NDC "1234-5678-90"
    When I edit the NDC to "12345-678-90"
    And I press submit
    Then I should see an error message "Invalid NDC format."

  Scenario: Editing a drug with missing name
    Given I am logged in as an Admin
    And the drug "Test Drug" exists with NDC "1234-5678-90"
    When I edit the NDC to "1234-5678-90"
    And I edit the name to ""
    And I press submit
    Then I should see an error message "Name is required."
