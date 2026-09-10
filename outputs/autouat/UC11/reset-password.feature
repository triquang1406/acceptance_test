Feature: Reset Password

  Scenario: Successful password reset request
    Given I am a registered user with a valid username and email
    When I enter my valid username
    Then I should receive a temporary password and reset link sent to my email

  Scenario: Username not recognized
    Given I am a user
    When I enter an unrecognized username
    Then I should see the message "No user found with provided username."

  Scenario: Account without a valid email
    Given I am a user with an account that has no valid email
    When I enter my valid username
    Then I should see the message "Unable to reset this account. Please contact an administrator"

  Scenario: Successful password change with temporary password
    Given I have received a temporary password
    When I enter the temporary password in the current password field
    And I enter a new password
    Then my password should be successfully changed

  Scenario: Temporary password expired
    Given I have received a temporary password that has expired
    When I attempt to enter the expired temporary password in the current password field
    Then I should see the message "Your temporary password has expired. Please request another one"
