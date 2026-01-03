# Workout Tracker - Frontend Requirements

## Overview

A React-based frontend for managing exercises and workouts, deployed to CloudFlare.

## Tech Stack

- **Framework**: React with TanStack Router
- **Styling**: Web standard CSS
- **Data Fetching**: TanStack Query (useQuery)
- **Deployment**: CloudFlare Pages

## Pages

### 1. Login Page (`/`)

- Password input field
- Submit button
- Error message display on invalid password
- Redirects to Workouts page on success

### 2. Workouts List Page (`/workouts`)

- Display all workouts as cards/list items
- Each workout shows name and exercise count
- "Create Workout" button
- Click workout to navigate to detail page

### 3. Workout Detail Page (`/workouts/:id`)

- Display workout name (editable)
- Ordered list of exercises in the workout
- Each exercise shows: name, rep count or duration, image thumbnail (if exists)
- Drag-and-drop or up/down buttons to reorder exercises
- "Add Exercise" button to link existing exercises
- Remove exercise button (unlink, not delete)
- Save button for changes

### 4. Exercises List Page (`/exercises`)

- Display all exercises as cards/list items
- Each exercise shows: name, rep count or duration
- "Create Exercise" button
- Click exercise to navigate to detail page

### 5. Exercise Detail Page (`/exercises/:id`)

- Editable form with all exercise fields:
  - Name
  - Rep count OR duration (toggle/radio to select which)
  - Image URL (optional)
  - Video URL (optional)
- Preview image/video if URLs provided
- Save button

### 6. Create Exercise Page (`/exercises/new`)

- Same form as Exercise Detail but empty
- Save creates new exercise

### 7. Create Workout Page (`/workouts/new`)

- Workout name input
- Save creates new workout (exercises added after creation)

## Navigation

- Persistent nav bar with links to:
  - Workouts
  - Exercises
- Show only after authenticated

## Authentication Flow

1. App checks if user has valid token in localStorage
2. If no token or token expired, show Login page
3. On login, call `/api/auth` with password
4. On success, store token and expiration time
5. Include token in Authorization header for all API requests
6. When token expires (or 401 response), redirect to Login page
7. Never store the password client-side

## Components

### Shared Components

- **NavBar**: Navigation links
- **ExerciseCard**: Display exercise summary
- **WorkoutCard**: Display workout summary
- **ExerciseForm**: Create/edit exercise fields
- **PasswordInput**: Login form

## State Management

- **Server state**: TanStack Query for all API data
- **Auth state**: Context or simple state for password storage
- **Form state**: Local component state

## Responsive Design

- Mobile-first approach
- Works on phone, tablet, and desktop
