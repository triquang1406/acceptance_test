Feature: View prescriptions

  As a patient
  I want to view a table containing my current and past prescriptions and information about each prescription
  So that I can verify my medications

  Scenario: Successfully viewing current and past prescriptions
    Given I am a logged-in patient
    When I navigate to the prescriptions page
    Then I should see a table displaying my current prescriptions
    And I should see a table displaying my past prescriptions
    And each prescription should include the following information:
      | Prescription Name | Dosage | Start Date | End Date | Status |
    And the table should be properly formatted

  Scenario: No current prescriptions available
    Given I am a logged-in patient
    And I have no current prescriptions
    When I navigate to the prescriptions page
    Then I should see a message "You have no current prescriptions."

  Scenario: No past prescriptions available
    Given I am a logged-in patient
    And I have no past prescriptions
    When I navigate to the prescriptions page
    Then I should see a message "You have no past prescriptions."

  Scenario: No current or past prescriptions available
    Given I am a logged-in patient
    And I have no current or past prescriptions
    When I navigate to the prescriptions page
    Then I should see an error message "You have no current or past prescriptions."

  Scenario: Viewing details of a specific prescription
    Given I am a logged-in patient
    And I have a current prescription
    When I click on the prescription in the table
    Then I should see detailed information about the prescription
    And the details should include:
      | Prescription Name | Dosage | Start Date | End Date | Status | Doctor's Notes |
