Feature: User Login

  Scenario: Successful login with valid credentials
    Given the user is on the login page
    When the user enters a valid username and password
    And the user clicks on the "Login" button
    Then the user should be redirected to their personalized home page
    And the user should see a welcome message with their username
    And the user should have an authenticated session

  Scenario: Unsuccessful login with invalid credentials
    Given the user is on the login page
    When the user enters an invalid username or password
    And the user clicks on the "Login" button
    Then the user should see an error message indicating invalid credentials
    And the user should remain on the login page
    And the user should not have an authenticated session

  Scenario: Logout from the application
    Given the user is logged in and on their personalized home page
    When the user clicks on the "Logout" button
    Then the user should be redirected to the login page
    And the user should see a message indicating successful logout
    And the user should not have an authenticated session

  Scenario: Session ends when the application is closed
    Given the user is logged in and on their personalized home page
    When the user closes the iTrust2 application
    Then the user's session should end
    And the user should need to log in again to access their personalized home page

  Scenario: Role-based entry after login
    Given the user is on the login page
    When the user enters a valid username and password for a specific role
    And the user clicks on the "Login" button
    Then the user should be redirected to the personalized home page corresponding to their role
    And the user should see role-specific content on their home page
