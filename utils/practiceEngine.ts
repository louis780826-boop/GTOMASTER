// utils/practiceEngine.ts

import { TRAINING_SPOTS, TrainingSpot } from "../lib/training/trainingSpots";

export function getRandomSpot(): TrainingSpot {
  const idx = Math.floor(Math.random() * TRAINING_SPOTS.length);
  return TRAINING_SPOTS[idx];
}

export function evaluatePracticeAnswer(
  spot: TrainingSpot,
  heroAction: "RAISE" | "CALL" | "FOLD"
) {
  const correct = spot.correctAction === heroAction;

  return {
    correct,
    explanation: spot.explanation,
    correctAction: spot.correctAction
  };
}
