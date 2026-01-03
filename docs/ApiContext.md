# API Context

API reference for the Workout Tracker CloudFlare Workers API.

## Base URL

- **Production**: `https://workout-tracker.terodox.workers.dev/api`

## Authentication

All endpoints except `POST /api/auth` require a Bearer token.

```
Authorization: Bearer <token>
```

### POST /api/auth

Authenticate and receive a token.

**Request:**

```json
{
  "password": "string"
}
```

**Response (200):**

```json
{
  "token": "string",
  "expiresAt": "2026-01-03T15:54:34.000Z"
}
```

**Errors:**

- `400` - Missing or empty password, malformed JSON
- `401` - Invalid password

---

## Data Types

### Exercise

```typescript
interface Exercise {
  id: string
  name: string
  repCount?: number // Required if duration not set
  duration?: number // Required if repCount not set (seconds)
  imageUrl?: string
  videoUrl?: string
}
```

**Validation:** Must have `repCount` XOR `duration` (exactly one).

### Workout

```typescript
interface Workout {
  id: string
  name: string
  exercises: ExerciseEntry[]
}

interface ExerciseEntry {
  exerciseId: string
  order: number // 0-indexed position
}
```

---

## Exercises

### POST /api/exercises

Create a new exercise.

**Request:**

```json
{
  "name": "Push-ups",
  "repCount": 20
}
```

**Response (201):**

```json
{
  "id": "uuid",
  "name": "Push-ups",
  "repCount": 20
}
```

### GET /api/exercises

List all exercises.

**Response (200):**

```json
[
  { "id": "uuid", "name": "Push-ups", "repCount": 20 },
  { "id": "uuid", "name": "Plank", "duration": 60 }
]
```

### GET /api/exercises/:id

Get a single exercise.

**Response (200):** Exercise object

**Errors:** `404` - Exercise not found

### PUT /api/exercises/:id

Update an exercise.

**Request:** Partial or full exercise fields (excluding `id`)

**Response (200):** Updated exercise object

**Errors:**

- `400` - Invalid data
- `404` - Exercise not found

---

## Workouts

### POST /api/workouts

Create a new workout.

**Request:**

```json
{
  "name": "Morning Routine"
}
```

**Response (201):**

```json
{
  "id": "uuid",
  "name": "Morning Routine",
  "exercises": []
}
```

### GET /api/workouts

List all workouts.

**Response (200):**

```json
[{ "id": "uuid", "name": "Morning Routine", "exercises": [] }]
```

### GET /api/workouts/:id

Get a single workout with exercises.

**Response (200):** Workout object

**Errors:** `404` - Workout not found

### PUT /api/workouts/:id

Update workout name.

**Request:**

```json
{
  "name": "Updated Name"
}
```

**Response (200):** Updated workout object

**Errors:**

- `400` - Invalid data
- `404` - Workout not found

---

## Workout Exercises (Not Yet Implemented)

### POST /api/workouts/:id/exercises

Add exercise to workout.

**Request:**

```json
{
  "exerciseId": "uuid"
}
```

### DELETE /api/workouts/:id/exercises/:exerciseId

Remove exercise from workout.

### PUT /api/workouts/:id/exercises/reorder

Reorder exercises in workout.

**Request:**

```json
{
  "exerciseIds": ["uuid1", "uuid2", "uuid3"]
}
```

---

## Error Response Format

All errors return:

```json
{
  "error": "Error message"
}
```

| Status | Meaning                              |
| ------ | ------------------------------------ |
| 400    | Bad Request - Invalid input          |
| 401    | Unauthorized - Missing/invalid token |
| 404    | Not Found - Resource doesn't exist   |
| 409    | Conflict - Resource state conflict   |
| 500    | Internal Server Error                |
