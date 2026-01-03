/**
 * Represents an exercise entry within a workout.
 */
export interface ExerciseEntry {
  exerciseId: string
  order: number
}

/**
 * Represents a workout containing ordered exercises.
 */
export interface Workout {
  id: string
  name: string
  exercises: Array<ExerciseEntry>
}
