Feature: Add User

  As an Admin
  I want to create a new user with a user name (MID), a password, a confirm password, the role, and the enabled status
  So that the user can access the iTrust2 Medical Records system

  Background:
    Given I am logged in as an Admin

  Scenario: Successfully create a new user with valid data
    When I fill in the user name with "validUser1"
    And I fill in the password with "Password123"
    And I fill in the confirm password with "Password123"
    And I select the role "Patient"
    And I set the enabled status to "true"
    And I submit the form
    Then I should see a success message "User created successfully"

  Scenario: Fail to create a user with a user name that is too short
    When I fill in the user name with "abc"
    And I fill in the password with "Password123"
    And I fill in the confirm password with "Password123"
    And I select the role "Patient"
    And I set the enabled status to "true"
    And I submit the form
    Then I should see an error message "User name must be between 6 and 20 characters"

  Scenario: Fail to create a user with a user name that is too long
    When I fill in the user name with "thisIsAVeryLongUserName"
    And I fill in the password with "Password123"
    And I fill in the confirm password with "Password123"
    And I select the role "Patient"
    And I set the enabled status to "true"
    And I submit the form
    Then I should see an error message "User name must be between 6 and 20 characters"

  Scenario: Fail to create a user with invalid characters in user name
    When I fill in the user name with "invalid@user"
    And I fill in the password with "Password123"
    And I fill in the confirm password with "Password123"
    And I select the role "Patient"
    And I set the enabled status to "true"
    And I submit the form
    Then I should see an error message "User name can only contain alpha characters, - or _"

  Scenario: Fail to create a user with a password that is too short
    When I fill in the user name with "validUser1"
    And I fill in the password with "123"
    And I fill in the confirm password with "123"
    And I select the role "Patient"
    And I set the enabled status to "true"
    And I submit the form
    Then I should see an error message "Password must be between 6 and 20 characters"

  Scenario: Fail to create a user with a password that is too long
    When I fill in the user name with "validUser1"
    And I fill in the password with "thisPasswordIsWayTooLong123"
    And I fill in the confirm password with "thisPasswordIsWayTooLong123"
    And I select the role "Patient"
    And I set the enabled status to "true"
    And I submit the form
    Then I should see an error message "Password must be between 6 and 20 characters"

  Scenario: Fail to create a user with mismatched passwords
    When I fill in the user name with "validUser1"
    And I fill in the password with "Password123"
    And I fill in the confirm password with "DifferentPassword"
    And I select the role "Patient"
    And I set the enabled status to "true"
    And I submit the form
    Then I should see an error message "Passwords do not match"

  Scenario: Fail to create a user without selecting a role
    When I fill in the user name with "validUser1"
    And I fill in the password with "Password123"
    And I fill in the confirm password with "Password123"
    And I set the enabled status to "true"
    And I submit the form
    Then I should see an error message "Role is required"

  Scenario: Fail to create a user with an invalid role
    When I fill in the user name with "validUser1"
    And I fill in the password with "Password123"
    And I fill in the confirm password with "Password123"
    And I select the role "InvalidRole"
    And I set the enabled status to "true"
    And I submit the form
    Then I should see an error message "Invalid role selected"
