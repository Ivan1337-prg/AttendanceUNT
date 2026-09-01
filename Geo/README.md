# Geo Module

## Overview

The Geo Module provides geolocation-based attendance validation for the EduVision project. It verifies that a student is within the attendance area selected by the teacher before allowing the student's check-in to be accepted.

Geolocation works alongside EduVision's face recognition system to help verify both the student's identity and physical location.

## Purpose

The purpose of this module is to add location verification to the attendance process. When a teacher creates an attendance session, the teacher's current location and selected attendance radius are stored with the session.

When a student attempts to check in, the system retrieves the student's current location and determines whether the student is within the allowed attendance radius.

## Current Functionality

- Captures the teacher's latitude and longitude when an attendance session is created.
- Allows the teacher to select an attendance radius for the session.
- Stores the teacher's coordinates and selected radius with the attendance session.
- Captures the student's latitude and longitude when the student attempts to check in.
- Uses the Haversine formula to calculate the distance between the teacher and student.
- Compares the calculated distance against the attendance radius.
- Rejects student check-ins that are outside the allowed radius.
- Integrates geolocation validation with the EduVision attendance workflow.

## Attendance Flow

1. The teacher starts an attendance session from the teacher web application.
2. The teacher's current latitude and longitude are captured.
3. The teacher selects the allowed attendance radius.
4. The teacher's coordinates and radius are stored with the session.
5. The student attempts to check in through the React Native mobile application.
6. The student's current latitude and longitude are captured.
7. The student's location is sent to the backend.
8. The backend uses the Haversine formula to calculate the distance between the student and teacher.
9. The calculated distance is compared to the radius established for the session.
10. If the student is within the allowed radius, geolocation validation passes.
11. If the student is outside the allowed radius, the check-in is rejected.

## Design Notes

GPS and device location accuracy can vary depending on the device, network connection, environment, and available location services. Because of this, the teacher can select an appropriate attendance radius instead of relying on a single fixed distance.

When testing locally, public or school Wi-Fi may cause communication issues because of client isolation. A private Wi-Fi network, mobile hotspot, or available deployed environment may be used for testing when necessary.

## Integration

The Geo Module is integrated across the EduVision system:

- **Teacher Web Application:** Captures the teacher's location and selected attendance radius when creating a session.
- **Student Mobile Application:** Captures the student's location when attempting to check in.
- **Backend:** Receives the location information, calculates the distance using the Haversine formula, and determines whether the student is within the allowed radius.
- **Attendance System:** Uses the geolocation result as part of the attendance validation process.

## Current Status

Geolocation is currently implemented across the EduVision frontend and backend. The teacher can establish an attendance area when starting a session, and student check-ins outside that area are rejected.

The feature builds on the geolocation research and validation prototype developed during Capstone I and has been expanded into the integrated EduVision attendance system during Capstone II.

## Future Improvements

- Continue testing geolocation accuracy across different devices and environments.
- Improve error handling when location permissions are disabled or unavailable.
- Improve user feedback when a student is outside the attendance radius.
- Continue improving integration between geolocation, facial recognition, and attendance validation.
