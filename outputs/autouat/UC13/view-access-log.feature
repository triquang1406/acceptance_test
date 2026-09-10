Feature: View access log

  As a user
  I want to view my access log showing the name of the accessor, the role of the accessor relative to the patient, the date and time of access, and the transaction type
  So that I can see who accessed my records

  Scenario: View access log with default settings
    Given I am a logged-in user
    When I navigate to the access log page
    Then I should see a list of access log entries
    And the entries should be sorted by date with the most recent access first
    And each entry should display the name of the accessor
    And each entry should display the role of the accessor relative to the patient
    And each entry should display the date and time of access
    And each entry should display the transaction type

  Scenario: Filter access log by valid date range
    Given I am a logged-in user
    And I navigate to the access log page
    When I enter a beginning date of "2023-01-01" and an end date of "2023-01-31"
    And I click on the "Filter" button
    Then I should see a list of access log entries within the specified date range
    And the entries should be sorted by date with the most recent access first

  Scenario: Filter access log with invalid date range
    Given I am a logged-in user
    And I navigate to the access log page
    When I enter a beginning date of "2023-01-31" and an end date of "2023-01-01"
    And I click on the "Filter" button
    Then I should see no access log entries
    And I should see a message indicating that the date range is invalid
    And I should have the opportunity to select different dates

  Scenario: Filter access log with invalid date format
    Given I am a logged-in user
    And I navigate to the access log page
    When I enter a beginning date of "invalid-date" and an end date of "2023-01-31"
    And I click on the "Filter" button
    Then I should see no access log entries
    And I should see a message indicating that the date format is invalid
    And I should have the opportunity to select different dates

  Scenario: Access log displays correct information
    Given I am a logged-in user
    And I navigate to the access log page
    When I view the access log entries
    Then each entry should contain the correct name of the accessor
    And each entry should contain the correct role of the accessor relative to the patient
    And each entry should contain the correct date and time of access
    And each entry should contain the correct transaction type
