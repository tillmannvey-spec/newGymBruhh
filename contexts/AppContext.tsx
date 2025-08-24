"use client"

import type React from "react"
import { createContext, useContext, type ReactNode } from "react"
import { useLocalStorage } from "../hooks/useLocalStorage"
import type { Exercise, LogEntry, TrainingPlan } from "../types"

interface AppContextType {
  exercises: Exercise[]
  addExercise: (exercise: Omit<Exercise, "id">) => Exercise
  updateExercise: (exercise: Exercise) => void
  deleteExercise: (exerciseId: string) => void
  getExerciseById: (id: string) => Exercise | undefined

  logs: LogEntry[]
  addLogEntry: (log: Omit<LogEntry, "id" | "timestamp" | "exerciseName">) => void

  plans: TrainingPlan[]
  addPlan: (plan: Omit<TrainingPlan, "id">) => void
  updatePlan: (plan: TrainingPlan) => void
  deletePlan: (planId: string) => void
  getPlanById: (id: string) => TrainingPlan | undefined
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [exercises, setExercises] = useLocalStorage<Exercise[]>("exercises", [])
  const [logs, setLogs] = useLocalStorage<LogEntry[]>("logs", [])
  const [plans, setPlans] = useLocalStorage<TrainingPlan[]>("plans", [])

  const addExercise = (exerciseData: Omit<Exercise, "id">) => {
    const existing = exercises.find((e) => e.name.toLowerCase() === exerciseData.name.toLowerCase())
    if (existing) return existing

    const newExercise: Exercise = { ...exerciseData, id: crypto.randomUUID() }
    setExercises((prev) => [...prev, newExercise])
    return newExercise
  }

  const updateExercise = (updatedExercise: Exercise) => {
    setExercises((prev) => prev.map((e) => (e.id === updatedExercise.id ? updatedExercise : e)))
  }

  const deleteExercise = (exerciseId: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== exerciseId))
    setLogs((prev) => prev.filter((l) => l.exerciseId !== exerciseId))
    setPlans((prev) => prev.map((p) => ({ ...p, exercises: p.exercises.filter((ex) => ex.exerciseId !== exerciseId) })))
  }

  const getExerciseById = (id: string) => exercises.find((e) => e.id === id)

  const addLogEntry = (logData: Omit<LogEntry, "id" | "timestamp" | "exerciseName">) => {
    const exercise = getExerciseById(logData.exerciseId)
    if (!exercise) return

    const newLog: LogEntry = {
      ...logData,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      exerciseName: exercise.name,
    }
    setLogs((prev) => [newLog, ...prev])
  }

  const addPlan = (planData: Omit<TrainingPlan, "id">) => {
    const newPlan: TrainingPlan = { ...planData, id: crypto.randomUUID() }
    setPlans((prev) => [...prev, newPlan])
  }

  const updatePlan = (updatedPlan: TrainingPlan) => {
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)))
  }

  const deletePlan = (planId: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== planId))
  }

  const getPlanById = (id: string) => plans.find((p) => p.id === id)

  const value = {
    exercises,
    addExercise,
    updateExercise,
    deleteExercise,
    getExerciseById,
    logs,
    addLogEntry,
    plans,
    addPlan,
    updatePlan,
    deletePlan,
    getPlanById,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
