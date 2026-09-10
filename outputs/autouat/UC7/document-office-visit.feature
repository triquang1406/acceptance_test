Feature: Document office visit

  As an HCP
  I want to document an office visit
  So that a record of the visit exists

  Scenario: Successfully document a prescheduled office visit
    Given I am an HCP
    When I enter the following details for the office visit:
      | Field                | Value                          |
      | Prescheduled         | Yes                            |
      | Notes                | Patient was feeling well.     |
      | Patient              | John Doe                      |
      | Appointment Type     | General Checkup               |
      | Hospital             | City Hospital                  |
      | Date                 | 2023-10-15                    |
      | Time                 | 10:00 AM                      |
    Then I should see a message "Office visit recorded successfully."

  Scenario: Successfully document an office visit with additional details for General Checkup
    Given I am an HCP
    When I enter the following details for the office visit:
      | Field                | Value                          |
      | Prescheduled         | Yes                            |
      | Notes                | Routine checkup.              |
      | Patient              | Jane Smith                    |
      | Appointment Type     | General Checkup               |
      | Hospital             | General Hospital               |
      | Date                 | 2023-10-20                    |
      | Time                 | 11:00 AM                      |
      | Basic Health Metrics  | Blood Pressure: 120/80       |
    Then I should see a message "Office visit recorded successfully."

  Scenario: Successfully document an office visit with additional details for Ophthalmology Office Visit
    Given I am an HCP
    When I enter the following details for the office visit:
      | Field                | Value                          |
      | Prescheduled         | Yes                            |
      | Notes                | Patient has blurred vision.   |
      | Patient              | Alice Johnson                  |
      | Appointment Type     | Ophthalmology Office Visit     |
      | Hospital             | Eye Care Center                |
      | Date                 | 2023-10-22                    |
      | Time                 | 02:00 PM                      |
      | Ophthalmology Details | Eye exam and prescription      |
    Then I should see a message "Office visit recorded successfully."

  Scenario: Successfully document an office visit with additional details for Ophthalmology Surgery
    Given I am an HCP
    When I enter the following details for the office visit:
      | Field                | Value                          |
      | Prescheduled         | Yes                            |
      | Notes                | Surgery scheduled for cataract.|
      | Patient              | Bob Brown                     |
      | Appointment Type     | Ophthalmology Surgery          |
      | Hospital             | Surgical Center                |
      | Date                 | 2023-10-25                    |
      | Time                 | 09:00 AM                      |
      | Surgery Details      | Cataract removal               |
    Then I should see a message "Office visit recorded successfully."

  Scenario: Error when required fields are missing
    Given I am an HCP
    When I enter the following details for the office visit:
      | Field                | Value                          |
      | Prescheduled         | Yes                            |
      | Notes                |                               |
      | Patient              |                               |
      | Appointment Type     | General Checkup               |
      | Hospital             | City Hospital                  |
      | Date                 | 2023-10-30                    |
      | Time                 | 10:00 AM                      |
    Then I should see an error message "Notes and Patient are required fields."

  Scenario: Error when notes exceed character limit
    Given I am an HCP
    When I enter the following details for the office visit:
      | Field                | Value                          |
      | Prescheduled         | Yes                            |
      | Notes                | "This is a very long note that exceeds the maximum character limit of five hundred characters. It goes on and on without stopping, detailing every single aspect of the patient's visit, including their history, symptoms, and any other relevant information that might be necessary for future reference." |
      | Patient              | John Doe                      |
      | Appointment Type     | General Checkup               |
      | Hospital             | City Hospital                  |
      | Date                 | 2023-10-15                    |
      | Time                 | 10:00 AM                      |
    Then I should see an error message "Notes must not exceed 500 characters."

  Scenario: Error when date format is incorrect
    Given I am an HCP
    When I enter the following details for the office visit:
      | Field                | Value                          |
      | Prescheduled         | Yes                            |
      | Notes                | Patient was feeling well.     |
      | Patient              | John Doe                      |
      | Appointment Type     | General Checkup               |
      | Hospital             | City Hospital                  |
      | Date                 | 15-10-2023                    |
      | Time                 | 10:00 AM                      |
    Then I should see an error message "Date must be in the format YYYY-MM-DD."
