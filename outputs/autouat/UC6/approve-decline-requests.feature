Feature: Approve/Decline Appointment Requests

  As an HCP
  I want to view appointment requests and select to approve or decline a request
  So that I can manage my schedule

  Scenario: Approve an appointment request
    Given I am logged in as an HCP
    And I have an appointment request from a patient
    When I view the appointment requests
    And I select to approve the appointment request
    Then I should see a confirmation message "Appointment request approved"
    And the appointment request should no longer be visible in the patient's appointment request view

  Scenario: Decline an appointment request
    Given I am logged in as an HCP
    And I have an appointment request from a patient
    When I view the appointment requests
    And I select to decline the appointment request
    Then I should see a confirmation message "Appointment request declined"
    And the appointment request should no longer be visible in the patient's appointment request view

  Scenario: No appointment requests available
    Given I am logged in as an HCP
    And there are no appointment requests from patients
    When I view the appointment requests
    Then I should see a message "No appointment requests available"

  Scenario: Attempt to approve a non-existent appointment request
    Given I am logged in as an HCP
    And I have no appointment requests from patients
    When I attempt to approve a non-existent appointment request
    Then I should see an error message "No appointment request found"

  Scenario: Attempt to decline a non-existent appointment request
    Given I am logged in as an HCP
    And I have no appointment requests from patients
    When I attempt to decline a non-existent appointment request
    Then I should see an error message "No appointment request found"
