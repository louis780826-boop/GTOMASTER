import { db } from '@/lib/db'
import { trainingSpots } from '@/lib/training/trainingSpots'
import type { TrainingSpot } from '@/lib/gtoTypes'

let initialized = false

function ensureSeeded() {
  if (initialized) return
  initialized = true

  // 如果 DB 裡已經有資料，就不要再灌一次
  const row = db.prepare(`SELECT COUNT(1) as cnt FROM training_spots`).get() as { cnt: number }
  if (row.cnt > 0) {
    return
  }

  const insert = db.prepare(`
    INSERT OR IGNORE INTO training_spots
    (id, position, heroHand, stage, spr, facingAction, level, gtoAction, gtoReason, exploit, createdAt, updatedAt)
    VALUES (@id, @position, @heroHand, @stage, @spr, @facingAction, @level, @gtoAction, @gtoReason, @exploit, DATETIME('now'), DATETIME('now'))
  `)

  const insertMany = db.transaction((spots: TrainingSpot[]) => {
    for (const s of spots) {
      insert.run(s)
    }
  })

  insertMany(trainingSpots)
}

// 取得全部題目
export function getAllTrainingSpots(): TrainingSpot[] {
  ensureSeeded()
  const rows = db
    .prepare(
      `SELECT id, position, heroHand, stage, spr, facingAction, level, gtoAction, gtoReason, exploit
       FROM training_spots
       ORDER BY id`,
    )
    .all() as TrainingSpot[]

  return rows
}

// 取得隨機一題
export function getRandomTrainingSpot(): TrainingSpot | null {
  ensureSeeded()
  const row = db
    .prepare(
      `SELECT id, position, heroHand, stage, spr, facingAction, level, gtoAction, gtoReason, exploit
       FROM training_spots
       ORDER BY RANDOM()
       LIMIT 1`,
    )
    .get() as TrainingSpot | undefined

  return row ?? null
}
