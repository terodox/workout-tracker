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

### AuthToken

```typescript
interface AuthToken {
  token: string
  expiresAt: string // ISO8601 timestamp
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

**Errors:**

- `400` - Invalid data (missing name, invalid repCount/duration)

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

**Errors:**

- `400` - Invalid data (missing or empty name)

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

## Workout Exercises

### POST /api/workouts/:id/exercises

Add an exercise to a workout. The exercise is appended to the end of the workout's exercise list.

**Request:**

```json
{
  "exerciseId": "uuid"
}
```

**Response (200):** Updated workout object

**Errors:**

- `400` - Missing exerciseId, exercise not found
- `404` - Workout not found
- `409` - Exercise already in workout

### DELETE /api/workouts/:id/exercises/:exerciseId

Remove an exercise from a workout. Remaining exercises are automatically reordered to maintain contiguous 0-indexed order.

**Response (200):** Updated workout object

**Errors:**

- `404` - Workout not found, or exercise not in workout

### PUT /api/workouts/:id/exercises/reorder

Reorder exercises in a workout. The `exerciseIds` array must contain exactly the same exercise IDs currently in the workout, in the desired new order.

**Request:**

```json
{
  "exerciseIds": ["uuid1", "uuid2", "uuid3"]
}
```

**Response (200):** Updated workout object

**Errors:**

- `400` - exerciseIds missing, contains duplicates, or doesn't match current exercises
- `404` - Workout not found

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
