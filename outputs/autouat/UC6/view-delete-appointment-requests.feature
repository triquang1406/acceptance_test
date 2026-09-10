Feature: View and delete appointment requests

  As a patient
  I want to view my appointment requests, select a request and delete it
  So that I can manage my requests

  Scenario: View appointment requests
    Given I am a logged-in patient
    When I navigate to the "My Appointment Requests" page
    Then I should see a list of my appointment requests
    And each request should display the appointment date, time, and status

  Scenario: Delete an appointment request
    Given I am a logged-in patient
    And I have at least one appointment request
    When I navigate to the "My Appointment Requests" page
    And I select an appointment request to delete
    And I confirm the deletion
    Then the appointment request should be removed from the list
    And I should see a confirmation message "Appointment request deleted successfully."

  Scenario: Attempt to delete a non-existent appointment request
    Given I am a logged-in patient
    And I have no appointment requests
    When I navigate to the "My Appointment Requests" page
    Then I should see a message "No appointment requests found."

  Scenario: Cancel deletion of an appointment request
    Given I am a logged-in patient
    And I have at least one appointment request
    When I navigate to the "My Appointment Requests" page
    And I select an appointment request to delete
    And I cancel the deletion
    Then the appointment request should remain in the list
    And I should see a message "Deletion cancelled."

  Scenario: View appointment requests with no requests
    Given I am a logged-in patient
    And I have no appointment requests
    When I navigate to the "My Appointment Requests" page
    Then I should see a message "You have no appointment requests."
