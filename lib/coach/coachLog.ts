// lib/coach/coachLog.ts
import { db } from '../db'

export interface CoachLog {
  heroHand: string
  position: string
  stage: string
  spr: number
  facingAction: string
  gtoAction: string
  gtoReason: string
  exploit: string
}

export function saveCoachLog(log: CoachLog) {
  const stmt = db.prepare(`
    INSERT INTO coach_logs
    (heroHand, position, stage, spr, facingAction, gtoAction, gtoReason, exploit, createdAt)
    VALUES (@heroHand, @position, @stage, @spr, @facingAction, @gtoAction, @gtoReason, @exploit, DATETIME('now'))
  `)
  stmt.run(log)
}

export function getCoachLogs(limit = 200) {
  return db.prepare(`
    SELECT * FROM coach_logs ORDER BY id DESC LIMIT ?
  `).all(limit)
}
