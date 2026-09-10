Feature: View health metrics

  As a patient
  I want to view the basic health metrics recorded for an office visit
  So that I can track my health

  Scenario: Successfully view health metrics for a past office visit
    Given I am a registered patient
    And I have had an office visit recorded
    When I navigate to the health metrics section
    Then I should see a list of health metrics for my past office visit
    And the health metrics should include "Blood Pressure", "Heart Rate", and "Weight"

  Scenario: No health metrics recorded for an office visit
    Given I am a registered patient
    And I have not had any office visits recorded
    When I navigate to the health metrics section
    Then I should see a message indicating "No health metrics available"

  Scenario: View health metrics for the most recent office visit
    Given I am a registered patient
    And I have had multiple office visits recorded
    When I navigate to the health metrics section
    Then I should see the health metrics for my most recent office visit

  Scenario: Health metrics display format
    Given I am a registered patient
    And I have had an office visit recorded
    When I navigate to the health metrics section
    Then the health metrics should be displayed in a clear and readable format
    And each metric should include the date it was recorded

  Scenario: Access health metrics without being logged in
    Given I am not logged in
    When I attempt to navigate to the health metrics section
    Then I should be redirected to the login page
    And I should see a message indicating that I need to log in to view health metrics

  Scenario: Edge case - Invalid office visit ID
    Given I am a registered patient
    And I have an invalid office visit ID
    When I attempt to view health metrics for that office visit
    Then I should see an error message indicating "Invalid office visit ID"
