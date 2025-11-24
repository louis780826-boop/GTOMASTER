// lib/training/log.ts
import { db } from '../db'

export interface TrainingLog {
  questionId: string
  position: string
  heroHand: string
  stage: string
  facingAction: string
  gtoAction: string
  yourAction: string
  correct: boolean
  timeUsed: number
}

export function saveTrainingLog(log: TrainingLog) {
  const stmt = db.prepare(`
    INSERT INTO training_logs
    (questionId, position, heroHand, stage, facingAction, gtoAction, yourAction, correct, timeUsed, createdAt)
    VALUES (@questionId, @position, @heroHand, @stage, @facingAction, @gtoAction, @yourAction, @correct, @timeUsed, DATETIME('now'))
  `)
  stmt.run(log)
}

export function getTrainingLogs(limit = 200) {
  return db.prepare(`
    SELECT * FROM training_logs ORDER BY id DESC LIMIT ?
  `).all(limit)
}
