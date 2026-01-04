# Frontend Implementation Tasks

## Overview

Tasks for implementing the Workout Tracker frontend using React, TanStack Router, TanStack Query, and Web Awesome components.

## Task Dependencies

```
Task 0 (Web Awesome Setup)
    ↓
Task 1 (Auth Context & API Client)
    ↓
Task 2 (Login Page)
    ↓
Task 3 (Layout & Navigation)
    ↓
Task 4 (Exercises List) ←→ Task 5 (Workouts List)
    ↓                           ↓
Task 6 (Exercise Detail)    Task 7 (Workout Detail)
    ↓                           ↓
Task 8 (Create Exercise)    Task 9 (Create Workout)
                                ↓
                        Task 10 (Workout-Exercise Linking)
```

---

## Task 0: Web Awesome Setup & Configuration

### Objective

Install and configure Web Awesome component library with TypeScript support.

### Work Items

- [x] Install `@awesome.me/webawesome` package
- [x] Create TypeScript declaration file for Web Awesome components
- [x] Import Web Awesome styles in app entry point
- [x] Import required component JS files
- [x] Verify components render correctly

### Files to Create/Modify

```
src/webawesome.d.ts              # TypeScript declarations
src/routes/__root.tsx            # Import styles
```

### Tests

- [x] Given Web Awesome installed, when app loads, then components render without errors
- [x] Given TypeScript configured, when using wa-\* components, then no type errors

### Acceptance Criteria

- Web Awesome components render with correct styling
- TypeScript provides autocomplete for component attributes
- No console errors related to custom elements

---

## Task 1: Auth Context & API Client

### Objective

Create authentication context and typed API client for all backend endpoints.

### Work Items

- [x] Create API client with typed request/response functions
- [x] Create AuthContext for token management
- [x] Implement token storage in localStorage
- [x] Add automatic token refresh/redirect on 401
- [x] Create useAuth hook for components

### Files to Create

```
src/lib/api/
├── client.ts                    # Base fetch wrapper with auth
├── auth.ts                      # POST /api/auth
├── exercises.ts                 # Exercise CRUD operations
├── workouts.ts                  # Workout CRUD operations
└── types.ts                     # API response types
src/contexts/
└── AuthContext.tsx              # Auth state management
src/hooks/
└── useAuth.ts                   # Auth hook
```

### Tests

#### Unit Tests

- [x] Given valid token in storage, when useAuth called, then returns authenticated state
- [x] Given no token, when useAuth called, then returns unauthenticated state
- [x] Given expired token, when API call fails with 401, then clears token and redirects
- [x] Given valid credentials, when login called, then stores token and updates state
- [x] Given logout called, when executed, then clears token and updates state

### Acceptance Criteria

- Token persists across page refreshes
- 401 responses trigger automatic logout
- API client includes Authorization header when token exists

---

## Task 2: Login Page

### Objective

Implement the login page with password authentication.

### Work Items

- [x] Create login route at `/`
- [x] Build login form with wa-input (password type)
- [x] Add form validation and error display
- [x] Implement login submission with loading state
- [x] Redirect to `/workouts` on success

### Files Created

```
src/components/LoginPage.tsx     # Login page component
src/components/LoginPage.css     # Login page styles
src/components/LoginPage.test.tsx # Unit tests
src/routes/index.tsx             # Route definition
src/routes/_authenticated.tsx    # Auth layout with redirect guard
src/routes/_authenticated/workouts/index.tsx  # Placeholder for redirect target
```

### Tests

#### Unit Tests

- [x] Given empty password, when submit clicked, then shows validation error
- [x] Given invalid password, when submitted, then shows error callout
- [x] Given valid password, when submitted, then calls login

#### Cypress Tests

- [ ] Given login page, when valid password entered, then redirects to workouts
- [ ] Given login page, when invalid password entered, then shows error message

### Acceptance Criteria

- [x] Password input has toggle visibility
- [x] Error messages display in wa-callout with danger variant
- [x] Loading spinner shows during authentication
- [x] Successful login redirects to workouts list

---

## Task 3: Layout & Navigation

### Objective

Create the authenticated app layout with navigation bar.

### Work Items

- [ ] Create authenticated layout wrapper
- [ ] Build NavBar component with links to Workouts and Exercises
- [ ] Add logout button to navigation
- [ ] Implement route guards for authenticated routes
- [ ] Style navigation for mobile and desktop

### Files to Create

```
src/components/
├── NavBar.tsx
├── NavBar.css
├── AuthenticatedLayout.tsx
└── AuthenticatedLayout.css
src/routes/_authenticated.tsx    # Layout route for auth pages
```

### Tests

#### Unit Tests

- [ ] Given authenticated user, when NavBar renders, then shows Workouts and Exercises links
- [ ] Given logout clicked, when executed, then clears auth and redirects to login
- [ ] Given unauthenticated user, when accessing protected route, then redirects to login

#### Cypress Tests

- [ ] Given authenticated user, when clicking nav links, then navigates correctly
- [ ] Given authenticated user, when clicking logout, then returns to login page

### Acceptance Criteria

- Navigation shows only when authenticated
- Active link is visually highlighted
- Logout clears token and redirects to login
- Mobile-responsive navigation

---

## Task 4: Exercises List Page

### Objective

Display all exercises with ability to navigate to detail/create pages.

### Work Items

- [ ] Create exercises list route at `/exercises`
- [ ] Fetch exercises using TanStack Query
- [ ] Build ExerciseCard component
- [ ] Add "Create Exercise" button
- [ ] Handle loading and empty states

### Files to Create

```
src/routes/_authenticated/exercises/
└── index.tsx                    # Exercises list page
src/components/
├── ExerciseCard.tsx
└── ExerciseCard.css
```

### Tests

#### Unit Tests

- [ ] Given exercises exist, when page loads, then displays exercise cards
- [ ] Given no exercises, when page loads, then shows empty state message
- [ ] Given loading, when page renders, then shows skeleton loaders
- [ ] Given exercise card clicked, when navigating, then goes to detail page

#### Cypress Tests

- [ ] Given authenticated user, when visiting /exercises, then sees exercise list
- [ ] Given exercises exist, when clicking exercise, then navigates to detail

### Acceptance Criteria

- Each card shows exercise name and rep count OR duration
- Cards are clickable and navigate to detail page
- "Create Exercise" button navigates to `/exercises/new`
- Loading state shows wa-skeleton components

---

## Task 5: Workouts List Page

### Objective

Display all workouts with ability to navigate to detail/create pages.

### Work Items

- [ ] Create workouts list route at `/workouts`
- [ ] Fetch workouts using TanStack Query
- [ ] Build WorkoutCard component
- [ ] Add "Create Workout" button
- [ ] Handle loading and empty states

### Files to Create

```
src/routes/_authenticated/workouts/
└── index.tsx                    # Workouts list page
src/components/
├── WorkoutCard.tsx
└── WorkoutCard.css
```

### Tests

#### Unit Tests

- [ ] Given workouts exist, when page loads, then displays workout cards
- [ ] Given no workouts, when page loads, then shows empty state message
- [ ] Given loading, when page renders, then shows skeleton loaders
- [ ] Given workout card clicked, when navigating, then goes to detail page

#### Cypress Tests

- [ ] Given authenticated user, when visiting /workouts, then sees workout list
- [ ] Given workouts exist, when clicking workout, then navigates to detail

### Acceptance Criteria

- Each card shows workout name and exercise count
- Cards are clickable and navigate to detail page
- "Create Workout" button navigates to `/workouts/new`
- Loading state shows wa-skeleton components

---

## Task 6: Exercise Detail Page

### Objective

Display and edit a single exercise.

### Work Items

- [ ] Create exercise detail route at `/exercises/:id`
- [ ] Fetch exercise by ID using TanStack Query
- [ ] Build ExerciseForm component (reusable for create/edit)
- [ ] Implement form validation (name required, repCount XOR duration)
- [ ] Add save functionality with optimistic updates
- [ ] Handle 404 for non-existent exercises

### Files to Create

```
src/routes/_authenticated/exercises/
└── $id.tsx                      # Exercise detail page
src/components/
├── ExerciseForm.tsx
└── ExerciseForm.css
```

### Tests

#### Unit Tests

- [ ] Given valid exercise ID, when page loads, then displays exercise data
- [ ] Given invalid exercise ID, when page loads, then shows 404 message
- [ ] Given form with both repCount and duration, when validated, then shows error
- [ ] Given form with neither repCount nor duration, when validated, then shows error
- [ ] Given valid form data, when saved, then updates exercise and shows success

#### Cypress Tests

- [ ] Given existing exercise, when editing name, then saves successfully
- [ ] Given exercise detail page, when changing type from reps to duration, then updates correctly

### Acceptance Criteria

- Form pre-fills with existing exercise data
- Radio group toggles between repCount and duration inputs
- Image/video URL fields are optional
- Save button shows loading state during submission
- Success message displays after save

---

## Task 7: Workout Detail Page

### Objective

Display and edit a single workout, including its exercises.

### Work Items

- [ ] Create workout detail route at `/workouts/:id`
- [ ] Fetch workout by ID using TanStack Query
- [ ] Display ordered list of exercises in workout
- [ ] Add editable workout name field
- [ ] Implement save functionality for name changes

### Files to Create

```
src/routes/_authenticated/workouts/
└── $id.tsx                      # Workout detail page
src/components/
├── WorkoutExerciseList.tsx
└── WorkoutExerciseList.css
```

### Tests

#### Unit Tests

- [ ] Given valid workout ID, when page loads, then displays workout data
- [ ] Given invalid workout ID, when page loads, then shows 404 message
- [ ] Given workout with exercises, when rendered, then shows exercises in order
- [ ] Given name changed, when saved, then updates workout name

#### Cypress Tests

- [ ] Given existing workout, when editing name, then saves successfully
- [ ] Given workout with exercises, when viewing, then shows exercises in correct order

### Acceptance Criteria

- Workout name is editable inline
- Exercises display with name, type (reps/duration), and thumbnail if available
- Save button shows loading state during submission

---

## Task 8: Create Exercise Page

### Objective

Create new exercises.

### Work Items

- [ ] Create exercise creation route at `/exercises/new`
- [ ] Reuse ExerciseForm component with empty initial state
- [ ] Implement create submission
- [ ] Redirect to exercise detail on success

### Files to Create

```
src/routes/_authenticated/exercises/
└── new.tsx                      # Create exercise page
```

### Tests

#### Unit Tests

- [ ] Given empty form, when page loads, then shows blank form
- [ ] Given valid form data, when submitted, then creates exercise
- [ ] Given successful creation, when complete, then redirects to detail page

#### Cypress Tests

- [ ] Given create exercise page, when filling form and submitting, then creates exercise

### Acceptance Criteria

- Form starts empty
- Validation prevents submission without required fields
- Successful creation redirects to the new exercise's detail page
- Cancel button returns to exercises list

---

## Task 9: Create Workout Page

### Objective

Create new workouts.

### Work Items

- [ ] Create workout creation route at `/workouts/new`
- [ ] Build simple form with workout name input
- [ ] Implement create submission
- [ ] Redirect to workout detail on success

### Files to Create

```
src/routes/_authenticated/workouts/
└── new.tsx                      # Create workout page
```

### Tests

#### Unit Tests

- [ ] Given empty form, when page loads, then shows blank form
- [ ] Given valid name, when submitted, then creates workout
- [ ] Given successful creation, when complete, then redirects to detail page

#### Cypress Tests

- [ ] Given create workout page, when filling name and submitting, then creates workout

### Acceptance Criteria

- Form starts empty with name input only
- Validation prevents submission without name
- Successful creation redirects to the new workout's detail page
- Cancel button returns to workouts list

---

## Task 10: Workout-Exercise Linking

### Objective

Add, remove, and reorder exercises within a workout.

### Work Items

- [ ] Add "Add Exercise" button to workout detail page
- [ ] Create exercise selection dialog
- [ ] Implement add exercise to workout functionality
- [ ] Add remove exercise button to each exercise in list
- [ ] Implement drag-and-drop or up/down buttons for reordering
- [ ] Add reorder API integration

### Files to Create/Modify

```
src/routes/_authenticated/workouts/$id.tsx  # Modify
src/components/
├── AddExerciseDialog.tsx
├── AddExerciseDialog.css
├── WorkoutExerciseItem.tsx
└── WorkoutExerciseItem.css
```

### Tests

#### Unit Tests

- [ ] Given workout, when "Add Exercise" clicked, then opens dialog
- [ ] Given exercise selected in dialog, when confirmed, then adds to workout
- [ ] Given exercise in workout, when remove clicked, then removes from workout
- [ ] Given multiple exercises, when reordered, then updates order correctly
- [ ] Given exercise already in workout, when trying to add again, then shows error

#### Cypress Tests

- [ ] Given workout detail, when adding exercise, then exercise appears in list
- [ ] Given workout with exercises, when removing exercise, then exercise disappears
- [ ] Given workout with exercises, when reordering, then order persists after refresh

### Acceptance Criteria

- Dialog shows all available exercises not already in workout
- Added exercises appear at the end of the list
- Remove button confirms before removing
- Reorder updates are saved immediately
- Order is preserved after page refresh

---

## Discovered During Work

(Add new tasks or issues discovered during implementation here)

---

## Progress Tracking

| Task                              | Status      | Notes                                                       |
| --------------------------------- | ----------- | ----------------------------------------------------------- |
| Task 0: Web Awesome Setup         | Complete    | Installed package, created TS declarations, imported styles |
| Task 1: Auth Context & API Client | Complete    | API client, AuthContext, useAuth hook with 12 tests         |
| Task 2: Login Page                | Complete    | LoginPage component with 5 unit tests, auth redirect guard  |
| Task 3: Layout & Navigation       | Not Started |                                                             |
| Task 4: Exercises List Page       | Not Started |                                                             |
| Task 5: Workouts List Page        | Not Started |                                                             |
| Task 6: Exercise Detail Page      | Not Started |                                                             |
| Task 7: Workout Detail Page       | Not Started |                                                             |
| Task 8: Create Exercise Page      | Not Started |                                                             |
| Task 9: Create Workout Page       | Not Started |                                                             |
| Task 10: Workout-Exercise Linking | Not Started |                                                             |
