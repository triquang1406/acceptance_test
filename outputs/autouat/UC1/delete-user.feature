Feature: Delete User

  As an Admin
  I want to select a user from the list of possible users, confirm the delete, and delete the user
  So that revoked users no longer have access

  Scenario: Successfully delete a user
    Given I am logged in as an Admin
    And I have navigated to the user management page
    And I see a list of users
    When I select a user from the list
    And I confirm the deletion
    Then the user should be removed from the list
    And the user should no longer have access to the application

  Scenario: Attempt to delete a user without confirmation
    Given I am logged in as an Admin
    And I have navigated to the user management page
    And I see a list of users
    When I select a user from the list
    And I do not confirm the deletion
    Then the user should remain in the list
    And the user should still have access to the application

  Scenario: Attempt to delete a non-existent user
    Given I am logged in as an Admin
    And I have navigated to the user management page
    When I attempt to delete a user that does not exist
    Then I should see an error message "User not found"
    And the user list should remain unchanged

  Scenario: Delete multiple users
    Given I am logged in as an Admin
    And I have navigated to the user management page
    And I see a list of users
    When I select multiple users from the list
    And I confirm the deletion
    Then the selected users should be removed from the list
    And the selected users should no longer have access to the application

  Scenario: Verify that deleted user cannot log in
    Given I am logged in as an Admin
    And I have navigated to the user management page
    And I see a list of users
    When I select a user from the list
    And I confirm the deletion
    And the user is deleted
    When the deleted user attempts to log in
    Then the login should fail
    And I should see a message "Access denied"
