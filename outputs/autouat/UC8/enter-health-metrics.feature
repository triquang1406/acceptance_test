Feature: Enter health metrics

  As an HCP
  I want to enter health metrics appropriate for the age of the patient
  So that the patient's health data is recorded correctly

  Background:
    Given the HCP is logged into the system

  Scenario: Enter health metrics for a patient under three years of age
    Given the patient is under three calendar years of age
    When the HCP enters length as "75.5", weight as "10.2", head circumference as "45.0", and household smoking status as "1"
    Then a success message should be displayed
    And the saved information should show length as "75.5", weight as "10.2", head circumference as "45.0", and household smoking status as "1"

  Scenario: Enter health metrics for a patient aged three to under twelve years
    Given the patient is three calendar years of age
    And the patient is under twelve calendar years of age
    When the HCP enters height as "120.0", weight as "30.5", blood pressure as "110/70", and household smoking status as "2"
    Then a success message should be displayed
    And the saved information should show height as "120.0", weight as "30.5", blood pressure as "110/70", and household smoking status as "2"

  Scenario: Enter health metrics for a patient aged twelve years or older
    Given the patient is twelve calendar years of age
    When the HCP enters height as "160.0", weight as "50.5", blood pressure as "120/80", household smoking status as "3", patient smoking status as "2", HDL cholesterol as "50", LDL cholesterol as "100", and triglycerides as "150"
    Then a success message should be displayed
    And the saved information should show height as "160.0", weight as "50.5", blood pressure as "120/80", household smoking status as "3", patient smoking status as "2", HDL cholesterol as "50", LDL cholesterol as "100", and triglycerides as "150"

  Scenario: Enter invalid health metrics for a patient under three years of age
    Given the patient is under three calendar years of age
    When the HCP enters length as "0", weight as "-5", head circumference as "45.0", and household smoking status as "1"
    Then an error message should be displayed indicating "Length must be greater than 0" and "Weight must be greater than 0"

  Scenario: Enter invalid health metrics for a patient aged three to under twelve years
    Given the patient is three calendar years of age
    And the patient is under twelve calendar years of age
    When the HCP enters height as "150.5", weight as "0", blood pressure as "110/70", and household smoking status as "2"
    Then an error message should be displayed indicating "Weight must be greater than 0"

  Scenario: Enter invalid health metrics for a patient aged twelve years or older
    Given the patient is twelve calendar years of age
    When the HCP enters height as "160.0", weight as "50.5", blood pressure as "120/80", household smoking status as "3", patient smoking status as "6", HDL cholesterol as "100", LDL cholesterol as "700", and triglycerides as "50"
    Then an error message should be displayed indicating "Patient smoking status must be a valid option", "HDL cholesterol must be between 0 and 90", "LDL cholesterol must be between 0 and 600", and "Triglycerides must be between 100 and 600"

  Scenario: Enter health metrics with valid and invalid data
    Given the patient is twelve calendar years of age
    When the HCP enters height as "160.0", weight as "50.5", blood pressure as "120/80", household smoking status as "1", patient smoking status as "3", HDL cholesterol as "80", LDL cholesterol as "200", and triglycerides as "700"
    Then an error message should be displayed indicating "Triglycerides must be between 100 and 600"
