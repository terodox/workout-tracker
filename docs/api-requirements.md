# Workout Tracker - Requirements Document

## Overview

A workout tracking application that allows users to create, manage, and organize exercises into workouts.

## Deployment Requirements

- **Platform**: CloudFlare Workers
- **Data Persistence**: CloudFlare Workers KV

## Data Models

### Exercise

An exercise is an independent entity that can exist without being part of a workout.

| Field    | Type   | Required    | Description                                             |
| -------- | ------ | ----------- | ------------------------------------------------------- |
| id       | string | Yes         | Unique identifier                                       |
| name     | string | Yes         | Exercise name                                           |
| repCount | number | Conditional | Number of repetitions (required if duration not set)    |
| duration | number | Conditional | Time duration in seconds (required if repCount not set) |
| imageUrl | string | No          | Link to exercise image                                  |
| videoUrl | string | No          | Link to exercise video                                  |

**Validation**: An exercise MUST have either `repCount` OR `duration`, but not both.

### Workout

A workout is an independent entity containing an ordered list of exercise references.

| Field     | Type            | Required | Description                      |
| --------- | --------------- | -------- | -------------------------------- |
| id        | string          | Yes      | Unique identifier                |
| name      | string          | Yes      | Workout name                     |
| exercises | ExerciseEntry[] | Yes      | Ordered list of exercise entries |

### ExerciseEntry

Represents an exercise within a workout, maintaining order.

| Field      | Type   | Required | Description                     |
| ---------- | ------ | -------- | ------------------------------- |
| exerciseId | string | Yes      | Reference to exercise           |
| order      | number | Yes      | Position in workout (0-indexed) |

## Functional Requirements

### Exercise Management

1. **Create Exercise**: Users can create exercises independently from workouts
2. **Update Exercise**: Users can modify exercise properties
3. **List Exercises**: Users can view all available exercises

### Workout Management

1. **Create Workout**: Users can create workouts independently from exercises
2. **Update Workout**: Users can modify workout name
3. **List Workouts**: Users can view all workouts

### Workout-Exercise Linking

1. **Add Exercise to Workout**: Users can link existing exercises to a workout
2. **Remove Exercise from Workout**: Users can unlink exercises from a workout
3. **Reorder Exercises**: Users can change the order of exercises within a workout

## KV Storage Schema

```
exercises:{id} -> Exercise JSON
workouts:{id} -> Workout JSON
```

## API Endpoints

### Exercises

| Method | Path               | Description        |
| ------ | ------------------ | ------------------ |
| GET    | /api/exercises     | List all exercises |
| GET    | /api/exercises/:id | Get exercise by ID |
| POST   | /api/exercises     | Create exercise    |
| PUT    | /api/exercises/:id | Update exercise    |

### Workouts

| Method | Path              | Description       |
| ------ | ----------------- | ----------------- |
| GET    | /api/workouts     | List all workouts |
| GET    | /api/workouts/:id | Get workout by ID |
| POST   | /api/workouts     | Create workout    |
| PUT    | /api/workouts/:id | Update workout    |

### Workout Exercises

| Method | Path                                    | Description                  |
| ------ | --------------------------------------- | ---------------------------- |
| POST   | /api/workouts/:id/exercises             | Add exercise to workout      |
| DELETE | /api/workouts/:id/exercises/:exerciseId | Remove exercise from workout |
| PUT    | /api/workouts/:id/exercises/reorder     | Reorder exercises in workout |

## Authentication

- **Method**: Token-based authentication
- **Token Lifetime**: 2 hours
- **Storage**: Token stored in CloudFlare Workers KV
- **Flow**:
  1. Frontend sends password to `/api/auth` endpoint
  2. Backend validates against hardcoded password
  3. Backend generates token, stores in KV with expiration
  4. Returns token to frontend
  5. Frontend includes token in all requests (Authorization header)
  6. Backend validates token on every request
- **Token Refresh**: Frontend must re-authenticate when token expires

### Auth Endpoints

| Method | Path      | Description                    |
| ------ | --------- | ------------------------------ |
| POST   | /api/auth | Authenticate and receive token |

**Request Body**:

```json
{
  "password": "string"
}
```

**Response**:

```json
{
  "token": "string",
  "expiresAt": "ISO8601 timestamp"
}
```

### Token Validation

All endpoints require valid token in Authorization header:

```
Authorization: Bearer <token>
```

Returns 401 Unauthorized if token is missing, invalid, or expired.

## Non-Functional Requirements

1. **Stateless**: Application must be stateless for CloudFlare Workers compatibility
2. **KV Limits**: Design must account for KV read/write limits and eventual consistency
3. **Response Format**: All API responses in JSON format
