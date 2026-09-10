Feature: Log all events

  Scenario: Log a successful login
    Given the user with MID "12345" is logged in
    When the user successfully logs in
    Then a log entry should be created with transaction code "2"
    And the log should include the MID "12345"
    And the log should include the current timestamp

  Scenario: Log a failed login attempt
    Given the user with MID "12345" attempts to log in with incorrect credentials
    When the login fails
    Then a log entry should be created with transaction code "1"
    And the log should include the MID "12345"
    And the log should include the current timestamp

  Scenario: Log a user logout
    Given the user with MID "12345" is logged in
    When the user logs out
    Then a log entry should be created with transaction code "3"
    And the log should include the MID "12345"
    And the log should include the current timestamp

  Scenario: Log viewing the home page
    Given the user with MID "12345" is logged in
    When the user views the home page
    Then a log entry should be created with transaction code "10"
    And the log should include the MID "12345"
    And the log should include the current timestamp

  Scenario: Log creating patient information
    Given the user with MID "12345" is logged in
    When the user creates patient information with MID "67890"
    Then a log entry should be created with transaction code "100"
    And the log should include the MID "12345"
    And the log should include the secondary MID "67890"
    And the log should include the current timestamp

  Scenario: Log viewing patient information
    Given the user with MID "12345" is logged in
    When the user views patient information with MID "67890"
    Then a log entry should be created with transaction code "101"
    And the log should include the MID "12345"
    And the log should include the secondary MID "67890"
    And the log should include the current timestamp

  Scenario: Log editing patient information
    Given the user with MID "12345" is logged in
    When the user edits patient information with MID "67890"
    Then a log entry should be created with transaction code "102"
    And the log should include the MID "12345"
    And the log should include the secondary MID "67890"
    And the log should include the current timestamp

  Scenario: Log deleting patient information
    Given the user with MID "12345" is logged in
    When the user deletes patient information with MID "67890"
    Then a log entry should be created with transaction code "103"
    And the log should include the MID "12345"
    And the log should include the secondary MID "67890"
    And the log should include the current timestamp

  Scenario: Log viewing patient information with invalid MID
    Given the user with MID "12345" is logged in
    When the user attempts to view patient information with an invalid MID "99999"
    Then a log entry should not be created
    And the user should receive an error message
