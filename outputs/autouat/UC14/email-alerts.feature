Feature: Email Alerts for Account Events

  Scenario: Send email alert for password change
    Given a user has changed their password
    When the system sends an email alert
    Then the email should include the user’s MID
    And the email should not include the password
    And the email should be logged in the iTrust2 application

  Scenario: Send email alert for password reset
    Given a user has requested a password reset
    When the system sends an email alert
    Then the email should include the user’s MID
    And the email should not include the password
    And the email should be logged in the iTrust2 application

  Scenario: Send email alert for appointment request status change
    Given a healthcare provider has changed the status of an appointment request
    And the appointment request is associated with a patient
    When the system sends an email alert to the patient
    Then the email should notify the patient of the status change
    And the email should be logged in the iTrust2 application

  Scenario: Send email alert for account lockout due to failed logins
    Given a user has exceeded the maximum number of failed login attempts
    When the system locks the user account
    Then the system should send an email alert to the user
    And the email should inform the user of the account lockout
    And the email should be logged in the iTrust2 application

  Scenario: Track all email alerts in the iTrust2 application
    Given an email alert has been sent for any account event
    When the event is logged in the iTrust2 application
    Then the log should include the type of event
    And the log should include the timestamp of the event
    And the log should include the user’s MID
