# EduVision Mini API Contract

Base URL when running locally:

```text
http://<COMPUTER_IP>:<PORT>
```

Teacher-only routes require this header:

```http
Authorization: Bearer <access_token>
```

## Endpoints

| Method | Route | Purpose | Authentication |
| --- | --- | --- | --- |
| `GET` | `/health` | Check whether the backend is running | No |
| `POST` | `/auth/sign-up` | Create a teacher account | No |
| `POST` | `/auth/login` | Log in and receive an access token | No |
| `POST` | `/session/start-session` | Start a session with its classroom location | Teacher |
| `GET` | `/session/current` | Get the teacher's active session and attendance | Teacher |
| `DELETE` | `/session/end-session` | End the teacher's active session | Teacher |
| `GET` | `/session/{session_id}/attendance` | Get attendance for a session | No |
| `GET` | `/session/{session_id}/student/{student_code}` | Validate the student, session, and location | No |
| `POST` | `/session/{session_id}/validate/{student_code}` | Validate location and a face scan, then update attendance | No |

## Main Request Bodies

Teacher sign-up:

```json
{
  "name": "Teacher Name",
  "email": "teacher@example.com",
  "password": "password"
}
```

Teacher login:

```json
{
  "email": "teacher@example.com",
  "password": "password"
}
```

Successful login:

```json
{
  "access_token": "<token>"
}
```

Start session:

```json
{
  "latitude": 41.8781,
  "longitude": -87.6298,
  "radius_meters": 60
}
```

## Student Check-In

The mobile app sends the student's current coordinates on both session validation and every face scan:

```text
GET /session/{session_id}/student/{student_code}?latitude=<LATITUDE>&longitude=<LONGITUDE>
```

```text
POST /session/{session_id}/validate/{student_code}?latitude=<LATITUDE>&longitude=<LONGITUDE>
Content-Type: image/jpeg
Body: raw image bytes
```

A successful face scan records the first check-in. A later successful scan at least 15 minutes afterward records `fifteen_min_confirm`.

## Common Responses

- `200`: request completed
- `400`: invalid session state or student has no stored face
- `401`: missing/invalid teacher token or incorrect password
- `403`: student is outside the session radius
- `404`: teacher, student, or session was not found
- `409`: session has no classroom location
- `422`: missing or invalid request data
- `500`: backend or database error
