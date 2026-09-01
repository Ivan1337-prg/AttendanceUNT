# EduVision | Project - 6 | Team - 15 (EdgeVision)

## Project Description

EduVision is a face recognition attendance system designed to automate and improve the process of taking student attendance in a classroom. The system combines facial recognition and geolocation to verify that the correct student is checking in and is within the allowed classroom area.

When a teacher starts an attendance session, the system stores the teacher's location and the attendance radius selected for that session. When a student attempts to check in, EduVision verifies the student's face and location before allowing their attendance to be recorded.

The goal of EduVision is to make classroom attendance easier for instructors while also reducing fake or unauthorized attendance check-ins.

## Functional Requirements

- Student-specific facial recognition and verification
- Student attendance check-in
- Geolocation-based attendance validation
- Teacher-selected attendance radius
- Teacher attendance management
- Attendance session creation and management
- Prevention of invalid or unauthorized attendance check-ins
- Instructor ability to manually review and update attendance

## Team Members

- Taras Glushko (Lead)
- Bryce Smith
- Eneojo Unwuchola
- Roman Macias
- Taron Osifo

**Instructor:** Diana Rabah

**TA:** Jordan Christopher Black

## Capstone II Improvements

### Implemented

- Improved student-specific face recognition and verification
- Implemented geolocation-based attendance validation
- Added teacher-selected attendance radius
- Improved project setup and development documentation
- Improved backend and frontend integration

## Project Components

EduVision consists of several components that work together:

- **Teacher Web Application** - Allows instructors to create attendance sessions, select an attendance radius, and manage student attendance.
- **Student Mobile Application** - Allows students to check in using facial recognition and their current location.
- **Face Recognition Service** - Compares a student's current face scan with their stored reference to verify their identity.
- **Geolocation System** - Compares the student's location with the teacher's location to determine whether the student is within the allowed attendance radius.
- **Backend API** - Handles authentication, attendance sessions, face verification, geolocation validation, and communication between the applications.
- **Database** - Stores student, session, attendance, and other required application data.

## Project Goal

The goal of EduVision is to provide instructors with a more reliable and automated way of taking classroom attendance. By combining facial recognition with geolocation and student-specific verification, the system is designed to reduce attendance fraud while keeping the attendance process simple for both students and instructors.
