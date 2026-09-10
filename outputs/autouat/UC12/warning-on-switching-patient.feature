Feature: Warning on switching patient

  Scenario: Display warning when switching patients with unsaved changes
    Given the healthcare professional (HCP) is editing a patient's information
    And there are unsaved changes in the patient's data
    When the HCP selects a different patient
    Then a warning message should be displayed indicating that unsaved changes will be lost
    And the HCP should have the option to confirm or cancel the action

  Scenario: Confirming the switch to a different patient
    Given the HCP has received a warning about unsaved changes
    When the HCP confirms the switch to a different patient
    Then the current patient's unsaved changes should be discarded
    And the new patient's data should be loaded

  Scenario: Canceling the switch to a different patient
    Given the HCP has received a warning about unsaved changes
    When the HCP cancels the switch to a different patient
    Then the current patient's unsaved changes should remain intact
    And the HCP should still be viewing the current patient's data

  Scenario: Switching patients without unsaved changes
    Given the HCP is viewing a patient's information
    And there are no unsaved changes in the patient's data
    When the HCP selects a different patient
    Then the new patient's data should be loaded without any warning

  Scenario: Repeating the action after confirming the switch
    Given the HCP has switched to a new patient after confirming the warning
    When the HCP selects another different patient
    Then the new patient's data should be loaded
    And no warning message should be displayed if there are no unsaved changes
