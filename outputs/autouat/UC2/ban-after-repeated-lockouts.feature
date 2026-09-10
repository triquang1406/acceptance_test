Feature: Ban after repeated lockouts

  Scenario: User is banned after 3 lockouts within 24 hours
    Given a user with username "testUser"
    And the user has been locked out 3 times within the last 24 hours
    When the user attempts to log in
    Then the user should receive a message "Your account is locked. Please contact support."
    And the user should be banned from the system

  Scenario: User is not banned after fewer than 3 lockouts within 24 hours
    Given a user with username "testUser"
    And the user has been locked out 2 times within the last 24 hours
    When the user attempts to log in
    Then the user should receive a message "Your account is locked. Please contact support."
    And the user should not be banned from the system

  Scenario: User remains banned until re-authorized by an administrator
    Given a user with username "testUser" is banned
    When an administrator attempts to re-authorize the user
    Then the user should be re-authorized
    And the user should no longer be banned from the system

  Scenario: IP address is banned after 3 lockouts within 24 hours
    Given an IP address "192.168.1.1" has been locked out 3 times within the last 24 hours
    When a request is made from that IP address
    Then the request should be denied
    And the IP address should be banned from the system

  Scenario: User is banned for a specific duration after repeated lockouts
    Given a user with username "testUser" has been locked out 3 times within the last 24 hours
    When the user is banned
    Then the ban should last until re-authorized by a system administrator

  Scenario: User attempts to log in after being banned
    Given a user with username "testUser" is banned
    When the user attempts to log in
    Then the user should receive a message "Your account is locked. Please contact support."
    And the user should remain banned from the system
