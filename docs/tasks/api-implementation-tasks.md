# API Implementation Tasks

## Overview

Tasks for implementing the Workout Tracker API on CloudFlare Workers with KV storage.

## Task Dependencies

```
Task 0 (Cleanup Boilerplate)
    ↓
Task 1 (Project Setup)
    ↓
Task 2 (KV Storage Layer)
    ↓
Task 3 (Auth)
    ↓
Task 4 (Auth Middleware)
    ↓
Task 5 (Exercise CRUD) ←→ Task 6 (Workout CRUD)
                ↓               ↓
            Task 7 (Workout-Exercise Linking)
```

---

## Task 0: Remove Boilerplate & Example Files

### Objective
Clean up all demo, example, and boilerplate files from the TanStack starter template.

### Work Items
- [x] Remove `src/routes/demo/` directory (all demo routes)
- [x] Remove `src/components/storybook/` directory (example components)
- [x] Remove `src/data/demo.punk-songs.ts`
- [x] Remove demo content from `src/routes/index.tsx` (replace with minimal placeholder)
- [x] Remove `src/routes/index.css` demo styles
- [x] Clean up `src/components/Header.tsx` (remove demo navigation)
- [x] Clean up `src/components/Header.css`
- [x] Remove `.storybook/` directory
- [x] Remove storybook dependencies from `package.json`
- [x] Update `src/routes/__root.tsx` to minimal layout
- [x] Verify app still builds and runs

### Files to Delete
```
src/routes/demo/                    # Entire directory
src/components/storybook/           # Entire directory
src/data/demo.punk-songs.ts
.storybook/                         # Entire directory
```

### Files to Clean/Simplify
```
src/routes/index.tsx               # Replace with minimal placeholder
src/routes/index.css               # Remove or minimize
src/components/Header.tsx          # Remove demo content
src/components/Header.css          # Remove demo styles
src/routes/__root.tsx              # Simplify layout
package.json                       # Remove storybook deps
```

### Tests
- [x] Given cleanup complete, when `npm run build` runs, then succeeds
- [x] Given cleanup complete, when `npm run start` runs, then app loads
- [x] Given cleanup complete, when `npm run test` runs, then no test failures from missing files

### Acceptance Criteria
- No demo or example files remain
- App builds and runs successfully
- Clean starting point for workout tracker implementation

---

## Task 1: API Project Structure & Test Infrastructure

### Objective
Set up the API folder structure, types, and test infrastructure.

### Work Items
- [x] Create `src/api/` folder structure
- [x] Create shared types (`Exercise`, `Workout`, `ExerciseEntry`, `AuthToken`)
- [x] Create API error types and response helpers
- [x] Configure Vitest for API tests
- [x] Create test utilities (mock KV, mock request/response)

### Files to Create
```
src/api/
├── types/
│   ├── exercise.ts
│   ├── workout.ts
│   ├── auth.ts
│   └── index.ts
├── utils/
│   ├── response.ts
│   └── errors.ts
└── test-utils/
    ├── mock-kv.ts
    └── mock-request.ts
```

### Tests
- [x] Unit: Type validation helpers work correctly
- [x] Unit: Response helpers return correct format
- [x] Unit: Error classes serialize properly

### Acceptance Criteria
- All types match api-requirements.md data models
- Test utilities can mock KV get/put/delete/list operations
- `npm run test` passes

---

## Task 2: KV Storage Layer

### Objective
Create a storage abstraction layer for CloudFlare KV operations.

### Work Items
- [x] Create `ExerciseStore` with CRUD operations
- [x] Create `WorkoutStore` with CRUD operations
- [x] Create `TokenStore` for auth tokens
- [x] Implement key prefixing (`exercises:`, `workouts:`, `tokens:`)

### Files to Create
```
src/api/storage/
├── exercise-store.ts
├── workout-store.ts
├── token-store.ts
└── index.ts
```

### Tests

#### Unit Tests
- [x] Given valid exercise data, when save is called, then stores with correct key
- [x] Given existing exercise id, when get is called, then returns exercise
- [x] Given non-existent id, when get is called, then returns null
- [x] Given existing exercise, when update is called, then overwrites data
- [x] Given exercise id, when delete is called, then removes from KV
- [x] Given multiple exercises, when list is called, then returns all exercises
- [x] (Repeat above for WorkoutStore)
- [x] Given token data, when save is called, then stores with TTL
- [x] Given expired token, when get is called, then returns null

#### Integration Tests
- [x] Given mock KV, when ExerciseStore performs CRUD cycle, then data persists correctly
- [x] Given mock KV, when WorkoutStore performs CRUD cycle, then data persists correctly

### Acceptance Criteria
- Storage layer is fully decoupled from HTTP handling
- All KV operations are abstracted behind store interfaces
- TTL support for token storage

---

## Task 3: Authentication Endpoint

### Objective
Implement POST `/api/auth` for password validation and token generation.

### Work Items
- [x] Create token generation utility (crypto random)
- [x] Create auth handler for POST `/api/auth`
- [x] Validate password against environment variable
- [x] Generate token with 2-hour expiration
- [x] Store token in KV with TTL
- [x] Return token and expiration timestamp

### Files to Create
```
src/api/handlers/
└── auth.ts
src/api/utils/
└── token.ts
```

### Tests

#### Unit Tests
- [x] Given correct password, when auth is called, then returns token and expiresAt
- [x] Given incorrect password, when auth is called, then returns 401
- [x] Given missing password in body, when auth is called, then returns 400
- [x] Given empty password, when auth is called, then returns 400
- [x] Given malformed JSON body, when auth is called, then returns 400

#### Integration Tests
- [x] Given correct password, when POST /api/auth, then token is stored in KV
- [x] Given correct password, when POST /api/auth, then token TTL is ~2 hours

#### E2E Tests (readonly happy path)
- [ ] Given valid credentials, when POST /api/auth, then returns 200 with token

### Acceptance Criteria
- Token is cryptographically random
- Token stored in KV with correct TTL
- Response matches API spec format

---

## Task 4: Authentication Middleware

### Objective
Create middleware to validate Bearer tokens on protected routes.

### Work Items
- [x] Create auth middleware function
- [x] Extract token from Authorization header
- [x] Validate token exists in KV and not expired
- [x] Return 401 for missing/invalid/expired tokens
- [x] Pass through for valid tokens

### Files to Create
```
src/api/middleware/
└── auth.ts
```

### Tests

#### Unit Tests
- [x] Given valid token in header, when middleware runs, then calls next handler
- [x] Given missing Authorization header, when middleware runs, then returns 401
- [x] Given malformed Authorization header, when middleware runs, then returns 401
- [x] Given "Bearer " without token, when middleware runs, then returns 401
- [x] Given non-existent token, when middleware runs, then returns 401
- [x] Given expired token, when middleware runs, then returns 401

#### Integration Tests
- [x] Given valid token in KV, when request with token hits protected route, then succeeds
- [x] Given token not in KV, when request hits protected route, then returns 401

### Acceptance Criteria
- All protected routes require valid token
- Clear error messages for auth failures
- No information leakage about why auth failed (generic 401)

---

## Task 5: Exercise CRUD Endpoints

### Objective
Implement all exercise management endpoints.

### Work Items
- [x] POST `/api/exercises` - Create exercise
- [x] GET `/api/exercises` - List all exercises
- [x] GET `/api/exercises/:id` - Get single exercise
- [x] PUT `/api/exercises/:id` - Update exercise

### Files to Create
```
src/api/handlers/
└── exercises.ts
src/api/validators/
└── exercise.ts
```

### Tests

#### Unit Tests - Validation
- [x] Given exercise with name and repCount, when validated, then passes
- [x] Given exercise with name and duration, when validated, then passes
- [x] Given exercise with both repCount and duration, when validated, then fails
- [x] Given exercise with neither repCount nor duration, when validated, then fails
- [x] Given exercise without name, when validated, then fails
- [x] Given exercise with empty name, when validated, then fails
- [x] Given exercise with negative repCount, when validated, then fails
- [x] Given exercise with negative duration, when validated, then fails
- [x] Given exercise with invalid imageUrl, when validated, then fails
- [x] Given exercise with invalid videoUrl, when validated, then fails

#### Unit Tests - Handlers
- [x] Given valid exercise data, when POST /api/exercises, then returns 201 with exercise
- [x] Given invalid exercise data, when POST /api/exercises, then returns 400
- [x] Given exercises exist, when GET /api/exercises, then returns array
- [x] Given no exercises, when GET /api/exercises, then returns empty array
- [x] Given valid id, when GET /api/exercises/:id, then returns exercise
- [x] Given invalid id, when GET /api/exercises/:id, then returns 404
- [x] Given valid update, when PUT /api/exercises/:id, then returns updated exercise
- [x] Given non-existent id, when PUT /api/exercises/:id, then returns 404
- [x] Given invalid update data, when PUT /api/exercises/:id, then returns 400

#### Integration Tests
- [x] Given mock KV, when full CRUD cycle performed, then data persists correctly
- [x] Given created exercise, when listed, then appears in results

#### E2E Tests (readonly happy path)
- [ ] Given authenticated user, when GET /api/exercises, then returns 200

### Acceptance Criteria
- Validation enforces repCount XOR duration rule
- IDs are generated server-side (UUID)
- All responses match API spec format

---

## Task 6: Workout CRUD Endpoints

### Objective
Implement all workout management endpoints.

### Work Items
- [x] POST `/api/workouts` - Create workout
- [x] GET `/api/workouts` - List all workouts
- [x] GET `/api/workouts/:id` - Get single workout
- [x] PUT `/api/workouts/:id` - Update workout

### Files to Create
```
src/api/handlers/
└── workouts.ts
src/api/validators/
└── workout.ts
```

### Tests

#### Unit Tests - Validation
- [x] Given workout with name, when validated, then passes
- [x] Given workout without name, when validated, then fails
- [x] Given workout with empty name, when validated, then fails

#### Unit Tests - Handlers
- [x] Given valid workout data, when POST /api/workouts, then returns 201 with workout
- [x] Given invalid workout data, when POST /api/workouts, then returns 400
- [x] Given workouts exist, when GET /api/workouts, then returns array
- [x] Given no workouts, when GET /api/workouts, then returns empty array
- [x] Given valid id, when GET /api/workouts/:id, then returns workout with exercises
- [x] Given invalid id, when GET /api/workouts/:id, then returns 404
- [x] Given valid name update, when PUT /api/workouts/:id, then returns updated workout
- [x] Given non-existent id, when PUT /api/workouts/:id, then returns 404

#### Integration Tests
- [x] Given mock KV, when full CRUD cycle performed, then data persists correctly
- [x] Given created workout, when listed, then appears in results

#### E2E Tests (readonly happy path)
- [ ] Given authenticated user, when GET /api/workouts, then returns 200

### Acceptance Criteria
- New workouts have empty exercises array
- IDs are generated server-side (UUID)
- All responses match API spec format

---

## Task 7: Workout-Exercise Linking Endpoints

### Objective
Implement endpoints for managing exercises within workouts.

### Work Items
- [ ] POST `/api/workouts/:id/exercises` - Add exercise to workout
- [ ] DELETE `/api/workouts/:id/exercises/:exerciseId` - Remove exercise from workout
- [ ] PUT `/api/workouts/:id/exercises/reorder` - Reorder exercises

### Files to Create
```
src/api/handlers/
└── workout-exercises.ts
src/api/validators/
└── workout-exercises.ts
```

### Tests

#### Unit Tests - Add Exercise
- [ ] Given valid workout and exercise ids, when POST, then adds exercise to workout
- [ ] Given non-existent workout id, when POST, then returns 404
- [ ] Given non-existent exercise id, when POST, then returns 400
- [ ] Given exercise already in workout, when POST, then returns 409 conflict
- [ ] Given missing exerciseId in body, when POST, then returns 400

#### Unit Tests - Remove Exercise
- [ ] Given exercise in workout, when DELETE, then removes exercise
- [ ] Given non-existent workout id, when DELETE, then returns 404
- [ ] Given exercise not in workout, when DELETE, then returns 404
- [ ] Given removal, when complete, then remaining exercises reorder correctly

#### Unit Tests - Reorder Exercises
- [ ] Given valid order array, when PUT reorder, then updates order
- [ ] Given non-existent workout id, when PUT reorder, then returns 404
- [ ] Given order array with missing exercise, when PUT reorder, then returns 400
- [ ] Given order array with extra exercise, when PUT reorder, then returns 400
- [ ] Given order array with duplicates, when PUT reorder, then returns 400
- [ ] Given empty order array for empty workout, when PUT reorder, then succeeds

#### Integration Tests
- [ ] Given workout with exercises, when reordered, then order persists in KV
- [ ] Given exercise removed, when workout fetched, then exercise not present
- [ ] Given exercise added, when workout fetched, then exercise present with correct order

#### E2E Tests (readonly happy path)
- [ ] Given authenticated user with workout, when GET /api/workouts/:id, then returns exercises in order

### Acceptance Criteria
- Order is 0-indexed and contiguous
- Adding exercise appends to end (highest order + 1)
- Removing exercise reorders remaining exercises
- Reorder accepts array of exerciseIds in desired order

---

## Task 8: API Router & Integration

### Objective
Wire all handlers together with routing and deploy configuration.

### Work Items
- [ ] Create main API router
- [ ] Register all routes with auth middleware
- [ ] Configure wrangler.jsonc for KV bindings
- [ ] Add environment variable for password

### Files to Create
```
src/api/
└── router.ts
```

### Files to Update
```
wrangler.jsonc
```

### Tests

#### Integration Tests
- [ ] Given all routes registered, when unknown path requested, then returns 404
- [ ] Given all routes registered, when wrong method used, then returns 405
- [ ] Given unauthenticated request to protected route, then returns 401
- [ ] Given authenticated request to protected route, then succeeds

#### E2E Tests
- [ ] Given deployed API, when full auth flow executed, then succeeds
- [ ] Given deployed API, when exercise CRUD flow executed, then succeeds
- [ ] Given deployed API, when workout CRUD flow executed, then succeeds

### Acceptance Criteria
- All endpoints accessible at correct paths
- Auth middleware applied to all routes except POST /api/auth
- CORS headers configured if needed

---

## Discovered During Work

(Add new tasks or issues discovered during implementation here)

---

## Progress Tracking

| Task | Status | Notes |
|------|--------|-------|
| Task 0: Cleanup Boilerplate | Complete | Removed demo files, storybook, simplified components |
| Task 1: Project Setup | Complete | Types, errors, response helpers, test utils |
| Task 2: KV Storage Layer | Complete | ExerciseStore, WorkoutStore, TokenStore with 19 tests |
| Task 3: Auth Endpoint | Complete | Token generation, auth handler with 7 tests |
| Task 4: Auth Middleware | Complete | withAuth middleware with 8 tests |
| Task 5: Exercise CRUD | Complete | Validator with 17 tests, handlers with 15 tests |
| Task 6: Workout CRUD | Not Started | |
| Task 7: Workout-Exercise Linking | Not Started | |
| Task 8: Router & Integration | Not Started | |
