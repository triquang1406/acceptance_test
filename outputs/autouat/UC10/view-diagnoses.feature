Feature: View Diagnoses

  As a patient,
  I want to view my current and past diagnoses and the data associated with the diagnoses
  So that I understand my medical history, without editing the diagnoses

  Scenario: View current diagnoses
    Given I am a logged-in patient
    When I navigate to the "My Diagnoses" section
    Then I should see a list of my current diagnoses
    And each diagnosis should display the following information:
      | Diagnosis Name      | Date Diagnosed | Description          |
      | Hypertension        | 2023-01-15     | High blood pressure   |
      | Type 2 Diabetes     | 2022-11-10     | Insulin resistance    |

  Scenario: View past diagnoses
    Given I am a logged-in patient
    When I navigate to the "My Diagnoses" section
    Then I should see a list of my past diagnoses
    And each past diagnosis should display the following information:
      | Diagnosis Name      | Date Diagnosed | Date Resolved | Description          |
      | Asthma              | 2020-05-20     | 2021-08-30     | Chronic respiratory condition |
      | Seasonal Allergies   | 2019-03-15     | 2020-03-15     | Allergic reactions    |

  Scenario: View details of a specific diagnosis
    Given I am a logged-in patient
    And I have current diagnoses
    When I select a diagnosis from the current diagnoses list
    Then I should see detailed information about the selected diagnosis
    And the details should include:
      | Field                | Value                     |
      | Diagnosis Name      | Hypertension              |
      | Date Diagnosed      | 2023-01-15               |
      | Description         | High blood pressure       |
      | Treatment Plan      | Lifestyle changes, medication |
      | Follow-up Date      | 2023-06-15               |

  Scenario: No diagnoses available
    Given I am a logged-in patient
    And I have no current or past diagnoses
    When I navigate to the "My Diagnoses" section
    Then I should see a message stating "No diagnoses available"

  Scenario: Access without being logged in
    Given I am not logged in
    When I attempt to navigate to the "My Diagnoses" section
    Then I should be redirected to the login page
    And I should see a message stating "Please log in to view your diagnoses"
