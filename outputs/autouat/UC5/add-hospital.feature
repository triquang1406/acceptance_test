Feature: Add Hospital

  As an Admin
  I want to add a hospital with a name, an address, a state, and a zip code
  So that patients can use new facilities

  Scenario: Successfully adding a hospital with valid details
    Given I am logged in as an Admin
    When I fill in the hospital name with "General Hospital"
    And I fill in the address with "123 Main St"
    And I fill in the state with "CA"
    And I fill in the zip code with "12345-6789"
    And I click on the "Add Hospital" button
    Then I should see a confirmation message "Hospital added successfully"

  Scenario: Attempting to add a hospital without a name
    Given I am logged in as an Admin
    When I fill in the address with "123 Main St"
    And I fill in the state with "CA"
    And I fill in the zip code with "12345"
    And I click on the "Add Hospital" button
    Then I should see an error message "Hospital name is required"

  Scenario: Attempting to add a hospital with an invalid state abbreviation
    Given I am logged in as an Admin
    When I fill in the hospital name with "General Hospital"
    And I fill in the address with "123 Main St"
    And I fill in the state with "California"
    And I fill in the zip code with "12345"
    And I click on the "Add Hospital" button
    Then I should see an error message "State must be a valid two-letter abbreviation"

  Scenario: Attempting to add a hospital with an invalid zip code format
    Given I am logged in as an Admin
    When I fill in the hospital name with "General Hospital"
    And I fill in the address with "123 Main St"
    And I fill in the state with "CA"
    And I fill in the zip code with "1234"
    And I click on the "Add Hospital" button
    Then I should see an error message "Zip code must be in the format XXXXX or XXXXX-XXXX"

  Scenario: Attempting to add a hospital with a zip code missing the optional part
    Given I am logged in as an Admin
    When I fill in the hospital name with "General Hospital"
    And I fill in the address with "123 Main St"
    And I fill in the state with "CA"
    And I fill in the zip code with "12345"
    And I click on the "Add Hospital" button
    Then I should see a confirmation message "Hospital added successfully"

  Scenario: Attempting to add a hospital with an empty address
    Given I am logged in as an Admin
    When I fill in the hospital name with "General Hospital"
    And I fill in the state with "CA"
    And I fill in the zip code with "12345"
    And I click on the "Add Hospital" button
    Then I should see an error message "Address is required"
