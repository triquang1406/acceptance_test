Feature: Display recent access events on landing screen

  Scenario: User logs in and sees the ten most recent access events
    Given the user is on the login page
    When the user enters valid credentials and logs in
    Then the landing screen should display the ten most recent access events
    And the access events should be displayed in descending order by date and time

  Scenario: User logs in with no access events
    Given the user is on the login page
    When the user enters valid credentials and logs in
    Then the landing screen should display a message indicating "No recent access events"

  Scenario: User logs in and sees access events with different types
    Given the user is on the login page
    When the user enters valid credentials and logs in
    And there are various types of access events (e.g., login, logout, file access)
    Then the landing screen should display the ten most recent access events including different types

  Scenario: User logs in and the access events list exceeds ten entries
    Given the user is on the login page
    When the user enters valid credentials and logs in
    And there are more than ten access events recorded
    Then the landing screen should display only the ten most recent access events

  Scenario: User logs in multiple times and sees updated access events
    Given the user has logged in previously and there are access events recorded
    When the user logs in again
    Then the landing screen should display the updated list of the ten most recent access events

  Scenario: User logs in and access events contain timestamps
    Given the user is on the login page
    When the user enters valid credentials and logs in
    Then each access event displayed on the landing screen should include a timestamp

  Scenario: User logs in and access events contain user details
    Given the user is on the login page
    When the user enters valid credentials and logs in
    Then each access event displayed on the landing screen should include the user details associated with the event
