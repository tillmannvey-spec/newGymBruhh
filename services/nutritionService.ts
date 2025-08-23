import type { NutritionAnalysis } from "../types"

// Mock nutrition service for demonstration
export async function analyzeMeal(mealDescription: string): Promise<NutritionAnalysis | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock analysis based on common foods
  const mockAnalysis: NutritionAnalysis = {
    totals: {
      calories: Math.floor(Math.random() * 800) + 200,
      protein: Math.floor(Math.random() * 50) + 10,
      carbs: Math.floor(Math.random() * 80) + 20,
      fat: Math.floor(Math.random() * 30) + 5,
    },
    items: [
      {
        name: "estimated portion 1",
        calories: Math.floor(Math.random() * 300) + 100,
        protein: Math.floor(Math.random() * 20) + 5,
        carbs: Math.floor(Math.random() * 40) + 10,
        fat: Math.floor(Math.random() * 15) + 2,
      },
      {
        name: "estimated portion 2",
        calories: Math.floor(Math.random() * 200) + 50,
        protein: Math.floor(Math.random() * 15) + 3,
        carbs: Math.floor(Math.random() * 30) + 5,
        fat: Math.floor(Math.random() * 10) + 1,
      },
    ],
  }

  return mockAnalysis
}
