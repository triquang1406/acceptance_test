Feature: Lockout after failed attempts

  Scenario: User exceeds maximum login attempts
    Given a user with a valid username and password
    When the user attempts to log in with an incorrect password 3 times
    Then the user account should be locked for 60 minutes
    And the user should receive a message indicating the account is locked

  Scenario: User exceeds IP address login attempts
    Given a user with a valid username and password
    When the user attempts to log in from the same IP address with incorrect credentials 6 times
    Then the IP address should be locked for 60 minutes
    And the user should receive a message indicating the IP address is locked

  Scenario: User attempts to log in after account lockout period
    Given a user account that was locked for 60 minutes
    When the lockout period has expired
    Then the user should be able to attempt to log in again
    And the user should have 3 attempts available

  Scenario: User attempts to log in after IP address lockout period
    Given an IP address that was locked for 60 minutes
    When the lockout period has expired
    Then the user should be able to attempt to log in again from that IP address
    And the IP address should have 6 attempts available

  Scenario: User attempts to log in with correct credentials after lockout
    Given a user account that was locked for 60 minutes
    When the lockout period has expired
    And the user attempts to log in with the correct username and password
    Then the user should be successfully logged in
    And the account should not be locked

  Scenario: User attempts to log in with incorrect credentials after lockout
    Given a user account that was locked for 60 minutes
    When the lockout period has expired
    And the user attempts to log in with an incorrect password
    Then the user should receive a message indicating the login failed
    And the user should have 2 remaining attempts

  Scenario: User attempts to log in with incorrect credentials after multiple failed attempts
    Given a user account that has already failed 2 login attempts
    When the user attempts to log in with an incorrect password
    Then the user should receive a message indicating the login failed
    And the user should have 1 remaining attempt

  Scenario: User attempts to log in with incorrect credentials after reaching maximum attempts
    Given a user account that has already failed 3 login attempts
    When the user attempts to log in with an incorrect password
    Then the user account should be locked for 60 minutes
    And the user should receive a message indicating the account is locked
