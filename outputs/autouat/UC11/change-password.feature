Feature: Change Password

  As a user
  I want to change my current password
  So that my account stays secure

  Scenario: Successfully change password with valid inputs
    Given I am logged in as a user
    And I navigate to the change password page
    When I enter my current password
    And I enter a new password that is valid
    And I confirm the new password that matches the new password
    Then I should see a success message indicating my password has been changed

  Scenario: Attempt to change password to the current password
    Given I am logged in as a user
    And I navigate to the change password page
    When I enter my current password
    And I enter my current password as the new password
    And I confirm the new password with my current password
    Then I should see an error message stating "The new password must be different"

  Scenario: New password and confirmation do not match
    Given I am logged in as a user
    And I navigate to the change password page
    When I enter my current password
    And I enter a new password that is valid
    And I enter a different password in the confirm password field
    Then I should see an error message stating "Please repeat the new password in the input field"

  Scenario: New password is too short
    Given I am logged in as a user
    And I navigate to the change password page
    When I enter my current password
    And I enter a new password that is shorter than 6 characters
    And I confirm the new password with the same short password
    Then I should see an error message stating "The new password must be between 6 and 20 characters"

  Scenario: New password is too long
    Given I am logged in as a user
    And I navigate to the change password page
    When I enter my current password
    And I enter a new password that is longer than 20 characters
    And I confirm the new password with the same long password
    Then I should see an error message stating "The new password must be between 6 and 20 characters"

  Scenario: New password is exactly 6 characters long
    Given I am logged in as a user
    And I navigate to the change password page
    When I enter my current password
    And I enter a new password that is exactly 6 characters long
    And I confirm the new password with the same 6 character password
    Then I should see a success message indicating my password has been changed

  Scenario: New password is exactly 20 characters long
    Given I am logged in as a user
    And I navigate to the change password page
    When I enter my current password
    And I enter a new password that is exactly 20 characters long
    And I confirm the new password with the same 20 character password
    Then I should see a success message indicating my password has been changed
