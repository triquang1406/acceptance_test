Feature: Session Timeout

  Scenario: User session times out after ten minutes of inactivity
    Given the user is logged into the application
    When the user remains inactive for ten minutes
    Then the user session should be terminated
    And the user should be redirected to the login page
    And a message "Your session has timed out due to inactivity" should be displayed

  Scenario: User attempts to access a protected resource after session timeout
    Given the user session has timed out
    When the user tries to access a protected resource
    Then the user should be redirected to the login page
    And a message "Please log in to continue" should be displayed

  Scenario: User session remains active with activity within ten minutes
    Given the user is logged into the application
    When the user performs an action (e.g., clicks a button or navigates to a different page) within ten minutes
    Then the user session should remain active
    And the user should not be redirected to the login page

  Scenario: User session resets authentication after ten minutes of inactivity
    Given the user is logged into the application
    When the user remains inactive for ten minutes
    And the user attempts to perform an action
    Then the user should be prompted to log in again
    And the message "Your session has timed out. Please log in again." should be displayed

  Scenario: User session timeout notification before termination
    Given the user is logged into the application
    When the user remains inactive for nine minutes
    Then the user should receive a notification "Your session will expire in 1 minute due to inactivity"

  Scenario: User logs back in after session timeout
    Given the user session has timed out
    When the user enters valid credentials and logs in again
    Then the user should be redirected to the homepage
    And the message "Welcome back!" should be displayed

  Scenario: User session timeout with multiple tabs open
    Given the user is logged into the application in multiple tabs
    When the user remains inactive in all tabs for ten minutes
    Then all user sessions in all tabs should be terminated
    And the user should be redirected to the login page in all tabs
