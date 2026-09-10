Feature: View upcoming appointments

  As an HCP
  I want to view upcoming approved appointments
  So that I can prepare for them

  Scenario: Successfully viewing upcoming approved appointments
    Given I am logged in as a Healthcare Professional (HCP)
    When I navigate to the "Upcoming Appointments" section
    Then I should see a list of my upcoming approved appointments
    And each appointment should display the following details:
      | Date       | Time     | Patient Name | Appointment Type | Status   |

  Scenario: No upcoming approved appointments
    Given I am logged in as a Healthcare Professional (HCP)
    When I navigate to the "Upcoming Appointments" section
    Then I should see a message indicating "No upcoming appointments"

  Scenario: Viewing details of an upcoming approved appointment
    Given I am logged in as a Healthcare Professional (HCP)
    And I have upcoming approved appointments
    When I select an appointment from the list
    Then I should see the detailed view of the appointment
    And the details should include:
      | Date       | Time     | Patient Name | Appointment Type | Status   | Notes |

  Scenario: Upcoming appointments are sorted by date and time
    Given I am logged in as a Healthcare Professional (HCP)
    And I have multiple upcoming approved appointments
    When I view the list of upcoming appointments
    Then the appointments should be sorted in ascending order by date and time

  Scenario: Filtering upcoming appointments by date
    Given I am logged in as a Healthcare Professional (HCP)
    And I have upcoming approved appointments
    When I apply a filter for appointments on a specific date
    Then I should see only the appointments scheduled for that date

  Scenario: Handling errors when fetching upcoming appointments
    Given I am logged in as a Healthcare Professional (HCP)
    When there is a server error while fetching appointments
    Then I should see an error message indicating "Unable to load upcoming appointments. Please try again later."
