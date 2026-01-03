/**
 * Represents an exercise that can be performed.
 * Must have either repCount OR duration, but not both.
 */
export interface Exercise {
  id: string
  name: string
  repCount?: number
  duration?: number
  imageUrl?: string
  videoUrl?: string
}
