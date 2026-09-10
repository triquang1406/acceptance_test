# iTrust2 — Tất cả User Stories (từ docs UC1–UC14 + Requirements)

> Nguồn: `docs/Requirements.md` + `docs/UC1.md` … `docs/UC14.md`
> Định dạng theo paper: **As a [role]… I want [feature]… So that [benefit]…**
> Đây là **INPUT** để đưa vào `AutoUAT` (User Story → Gherkin).

---

## UC1 — User Functionality (Quản lý người dùng)

1. **Add User**
   - As an Admin
   - I want to create a new user with a user name (MID), a password, a confirm password, the role, and the enabled status
   - So that the user can access the iTrust2 Medical Records system
   - The user name must be between 6 and 20 alpha characters and may contain the symbols - or _
   - The password and the repeated password must each be between 6 and 20 characters
   - If the password and the repeated password do not match, an error is displayed
   - The possible roles are Patient, Health Care Provider (HCP), Optometrist HCP, Ophthalmologist HCP, Admin, Emergency Responder (ER), and Lab Tech
   - An error is displayed when a required field does not match the required data format

2. **Delete User**
   - As an Admin
   - I want to select a user from the list of possible users, confirm the delete, and delete the user
   - So that revoked users no longer have access

## UC2 — Authenticate Users (Xác thực)

3. **Login**
   - As a user
   - I want to log in with my user name and password
   - So that I gain role-based entry and I am directed to a personalized home page based on my role
   - An authenticated session ends when the user logs out or closes the iTrust2 application

4. **Session timeout**
   - As a user
   - I want the electronic session to terminate after ten minutes of inactivity and authentication to be reset after a period of inactivity that exceeds ten minutes
   - So that my account remains secure

5. **Lockout after failed attempts**
   - As a user
   - I want to try three times, then have my user name locked out for 60 minutes, and my IP address locked out for 60 minutes after 6 failed login attempts
   - So that the system is protected from brute-force attacks
   - After the 60 minute lockout period, a user gets 3 more attempts and an IP address gets 6 more attempts

6. **Ban after repeated lockouts**
   - As a user
   - I want a user or IP address that is locked out 3 times in a 24-hour period to be banned from the system
   - So that persistent abusers cannot access the system
   - A banned user or IP address stays banned until re-authorized by a system administrator

## UC3 — Log Transactions (Ghi log truy cập)

7. **Log all events**
   - As the system
   - I want to log any event which creates, views, edits, or deletes information
   - So that access to patient data is fully auditable
   - Each log records the MID of the logged in user, any appropriate secondary MID of the user whose information is being accessed, a transaction type, and the current timestamp
   - Login failures, valid authentication, and log outs are also logged with transaction code 1 for a failed login, 2 for a successful login, 3 for a logged out, and 10 for viewing the home page
   - Transaction codes for create, view, edit and delete follow the range of the use case (100-199 for UC1, 300-399 for UC3, and so on)

## UC4 — Demographics (Thông tin nhân khẩu)

8. **Patient edits own demographics**
   - As a patient
   - I want to enter or edit my own demographic information
   - So that my records stay accurate
   - An error is displayed when a required field does not match the data format

9. **HCP edits patient demographics**
   - As an HCP
   - I want to enter the MID of a patient and then enter or edit that patient's demographic information
   - So that patient records are correct
   - The date of birth is entered as 2 digit month / 2 digit day / 4 digit year
   - An error is displayed when a required field does not match the data format

10. **HCP/ER/Lab Tech edits own demographics**
    - As an HCP, an ER, or a Lab Tech
    - I want to enter or edit my own demographic information
    - So that my contact details are current
    - An error is displayed when a required field does not match the data format

## UC5 — Hospitals (Bệnh viện)

11. **Add Hospital**
    - As an Admin
    - I want to add a hospital with a name, an address, a state, and a zip code
    - So that patients can use new facilities
    - The state is a two letter abbreviation for the 50 US states
    - The zip code is 5 digits followed by 4 digits (the latter part is optional)
    - An error is displayed when a required field does not match the data format

12. **Delete Hospital**
    - As an Admin
    - I want to select a hospital from the list of possible hospitals, confirm the delete, and delete the hospital
    - So that the hospital list stays accurate

## UC6 — Appointments (Hẹn lịch)

13. **Request appointment**
    - As a patient
    - I want to request an appointment with an HCP by entering the HCP, the date, the time, comments, and the type
    - So that I can schedule care
    - The type is one of General Checkup
    - A message confirms the request
    - An error is displayed when a required field does not match the data format

14. **View/delete appointment requests**
    - As a patient
    - I want to view my appointment requests, select a request and delete it
    - So that I can manage my requests
    - A message confirms the request

15. **Approve/decline requests**
    - As an HCP
    - I want to view appointment requests and select to approve or decline a request
    - So that I can manage my schedule
    - A message confirms the action
    - After the action, the appointment is no longer visible in the patient's appointment request view

16. **View upcoming appointments**
    - As an HCP
    - I want to view upcoming approved appointments
    - So that I can prepare for them

## UC7 — Office Visit (Khám bệnh)

17. **View office visit**
    - As a patient
    - I want to view all information the HCP recorded for a documented office visit
    - So that I can see what was recorded, without editing it

18. **Document office visit**
    - As an HCP
    - I want to document an office visit by recording if it was prescheduled, notes about the visit, the patient, the appointment type, the hospital, the date, and the time
    - So that a record of the visit exists
    - A message shows if the office visit was entered correctly
    - I provide additional details appropriate for the appointment type: for a General Checkup the Basic Health Metrics (UC8), for an Ophthalmology Office Visit the ophthalmology office visit details, and for an Ophthalmology Surgery the ophthalmology surgery details
    - Notes are up to 500 characters
    - An error message is displayed when a required field does not match the data format

## UC8 — Basic Health Metrics (Chỉ số sức khỏe cơ bản)

19. **Enter health metrics**
    - As an HCP
    - I want to enter health metrics appropriate for the age of the patient, and I can edit the basic health metrics
    - So that the patient's health data is recorded correctly
    - For a patient under three calendar years of age, I enter length, weight, head circumference, and household smoking status
    - For a patient three calendar years of age or older and under 12 calendar years of age, I enter height, weight, blood pressure, and household smoking status
    - For a patient 12 calendar years of age or older, I enter height, weight, blood pressure, household smoking status, patient smoking status, HDL cholesterol, LDL cholesterol, and triglycerides
    - The household smoking status menu has 1 non-smoking household, 2 outdoor smokers, and 3 indoor smokers
    - The patient smoking status menu has 1 never smoker, 2 former smoker, 3 current some days smoker, 4 current every day smoker, 5 smoker current status unknown, and 9 unknown if ever smoked
    - Height, length and head circumference are up to 3 digits with up to 1 decimal place and must be greater than 0, and weight is up to 4 digits with up to 1 decimal place and must be greater than 0
    - HDL cholesterol is an integer between 0 and 90 inclusive, LDL cholesterol is an integer between 0 and 600 inclusive, and triglycerides is an integer between 100 and 600 inclusive
    - A success message is displayed and the HCP sees the saved information
    - An error message is displayed describing what entries do not conform to the appropriate data formats

20. **View health metrics**
    - As a patient
    - I want to view the basic health metrics recorded for an office visit
    - So that I can track my health

## UC9 — Prescriptions (Đơn thuốc)

21. **Add prescription**
    - As an HCP
    - I want to add a new prescription to the office visit
    - So that the patient receives the correct medication
    - I select the name of the prescription from a list, and there is no option to enter names not tracked by the system
    - I enter the dose in milligrams, the start date, the end date, and the number of renewals that can be made during the prescription period
    - Zero or more prescriptions may be added to the visit
    - An error message is displayed if I enter invalid data

22. **View prescriptions**
    - As a patient
    - I want to view a table containing my current and past prescriptions and information about each prescription
    - So that I can verify my medications
    - If I have no current or past prescriptions, the system displays an error message

23. **Manage NDC drugs**
    - As an Admin
    - I want to add a new drug by entering an NDC, a name, and a description, and edit an existing drug by modifying its information and pressing submit
    - So that the drug list is kept current
    - The NDC code is four digits, a dash, four digits, a dash, and two more digits, for example 1234-5678-90
    - An error message is displayed if I enter invalid data

## UC10 — Diagnoses (Chẩn đoán)

24. **Record diagnosis**
    - As an HCP
    - I want to record a diagnosis of a patient in an office visit and provide additional data about the diagnosis
    - So that the diagnosis is documented
    - I select the correct diagnosis from the menu of diagnoses options labeled by their ICD-10 codes and descriptions
    - I enter the date of the office visit, the HCP who diagnosed the patient, and any notes, then press the Save Diagnosis button
    - The notes are up to 500 characters
    - A message shows if the diagnosis was documented correctly
    - An error message is displayed describing what entries do not conform to the appropriate data formats

25. **View diagnoses**
    - As a patient
    - I want to view my current and past diagnoses and the data associated with the diagnoses
    - So that I understand my medical history, without editing the diagnoses

26. **Manage ICD-10 codes**
    - As an Admin
    - I want to add a diagnosis by entering its ICD-10 code and description, and remove a diagnosis by selecting a diagnosis from the list and confirming the delete
    - So that the diagnosis list is maintained
    - A message shows if the diagnosis was entered correctly
    - An error message is displayed describing what entries do not conform to the appropriate data formats

## UC11 — Password Functionality (Mật khẩu)

27. **Change password**
    - As a user
    - I want to change my current password by entering my current password, a new password, and a confirmation of the new password
    - So that my account stays secure
    - If I attempt to change my password to my current password, an error says the new password must be different
    - If the new password and the confirm new password are different, an error asks to repeat the new password in the input field
    - The new password and its confirmation must each be between 6 and 20 characters

28. **Reset password**
    - As a user
    - I want to reset my forgotten password through email verification
    - So that I can regain access if I forget it
    - I enter a valid user name and a temporary password and a reset link are sent to the email associated with the user
    - If the user name is unrecognized, the message "No user found with provided username." is shown
    - If the account has no valid email, the message "Unable to reset this account. Please contact an administrator" is shown
    - I then change my password by entering the temporary password into the current password field during a password change
    - If the temporary password has expired, the message "Your temporary password has expired. Please request another one" is shown

## UC12 — HCP Edit Demographics (HCP sửa thông tin bệnh nhân)

29. **HCP edits patient demographics via Edit Patient**
    - As an HCP
    - I want to select a patient to edit from the list of patients and edit that patient's demographics
    - So that patient records are up to date
    - The selected patient's current demographics fill the form, I make the desired edits and press the Submit button
    - A message shows if the data entered is valid
    - The system identifies fields that are incorrect or invalid and prompts me to correct them

30. **Warning on switching patient**
    - As an HCP
    - I want a warning about unsaved changes that will be lost if I select a different patient after editing but before submitting
    - So that I don't accidentally lose edits
    - If I repeat the action, the new patient's data is loaded

## UC13 — View Access Logs (Xem log truy cập)

31. **View access log**
    - As a user
    - I want to view my access log showing the name of the accessor, the role of the accessor relative to the patient, the date and time of access, and the transaction type
    - So that I can see who accessed my records
    - By default, upon browsing to the page, I am presented with a list of all entries sorted by dates with the most recent access first
    - I may enter a beginning date and an end date to view all entries within the range
    - If I enter an invalid date, or an end date that is before the start date, no events are shown and I have the opportunity to select different dates

32. **Recent events on landing**
    - As a user
    - I want my landing screen to display the ten most recent access events when I log in
    - So that I'm immediately aware of activity

## UC14 — Alert Users by Email (Cảnh báo qua email)

33. **Email alerts**
    - As the system
    - I want to send an email alert in the event of a changed or reset password, a status change in an appointment request, or an account lockout
    - So that users are notified of important account events
    - The password change email includes the MID but not the password
    - The appointment request email is sent to the patient when the status of the request is changed by the HCP involved in the request
    - A user account may be locked out temporarily or permanently due to too many failed logins
    - All emails are tracked within the iTrust2 application and all events are logged

---

## Tổng số: 33 user stories (từ 14 use cases)
