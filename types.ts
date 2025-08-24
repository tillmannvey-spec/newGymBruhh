// Core types for the gym application

export interface Exercise {
  id: string
  name: string
  description?: string
  category?: string
  muscleGroups?: string[]
  equipment?: string
  instructions?: string[]
  imageUrl?: string
}

export interface LogEntry {
  id: string
  exerciseId: string
  exerciseName: string
  timestamp: string
  sets: Set[]
  notes?: string
}

export interface Set {
  reps: number
  weight?: number
  duration?: number
  distance?: number
  restTime?: number
}

export interface TrainingPlan {
  id: string
  name: string
  description?: string
  exercises: PlannedExercise[]
  schedule?: ScheduleDay[]
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  estimatedDuration?: number
}

export interface PlannedExercise {
  exerciseId: string
  targetSets: number
  targetReps?: number
  targetWeight?: number
  targetDuration?: number
  restTime?: number
  notes?: string
}

export interface ScheduleDay {
  day: string
  isActive: boolean
  time?: string
}

export interface NutritionEntry {
  id: string
  timestamp: string
  calories: number
  protein: number
  carbs: number
  fat: number
  notes?: string
}

export interface NutritionAnalysis {
  totals: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  items: {
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
  }[]
  confidence?: number
}

export interface User {
  id: string
  name: string
  email?: string
  age?: number
  weight?: number
  height?: number
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced'
  goals?: string[]
}