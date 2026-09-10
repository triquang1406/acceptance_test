Feature: View office visit

  As a patient
  I want to view all information the HCP recorded for a documented office visit
  So that I can see what was recorded, without editing it

  Scenario: Successfully viewing an office visit record
    Given I am a registered patient
    And I have an office visit record documented by my HCP
    When I navigate to the office visit records page
    And I select the office visit record
    Then I should see the details of the office visit
    And the details should include the date, time, HCP name, and notes

  Scenario: Viewing an office visit record with no notes
    Given I am a registered patient
    And I have an office visit record documented by my HCP with no notes
    When I navigate to the office visit records page
    And I select the office visit record
    Then I should see the details of the office visit
    And the notes section should indicate "No notes recorded"

  Scenario: Attempting to view an office visit record that does not exist
    Given I am a registered patient
    And I do not have any office visit records
    When I navigate to the office visit records page
    Then I should see a message indicating "No office visit records found"

  Scenario: Viewing office visit records for multiple visits
    Given I am a registered patient
    And I have multiple office visit records documented by my HCP
    When I navigate to the office visit records page
    Then I should see a list of all my office visit records
    And each record should display the date and HCP name

  Scenario: Ensuring the office visit details are not editable
    Given I am a registered patient
    And I have an office visit record documented by my HCP
    When I navigate to the office visit records page
    And I select the office visit record
    Then I should see the details of the office visit
    And the details should not have any edit options available

  Scenario: Viewing office visit record with sensitive information
    Given I am a registered patient
    And I have an office visit record that includes sensitive information
    When I navigate to the office visit records page
    And I select the office visit record
    Then I should see the details of the office visit
    And the sensitive information should be displayed in a secure manner
