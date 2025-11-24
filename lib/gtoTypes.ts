// lib/gtoTypes.ts
export type Stage = 'preflop' | 'flop' | 'turn' | 'river'
export type Position = 'UTG' | 'HJ' | 'CO' | 'BTN' | 'SB' | 'BB'

export type FacingAction = 'none' | 'open' | '3bet' | '4bet'

export interface TrainingSpot {
  id: string
  position: Position
  heroHand: string // 建議統一格式，如 "AKs", "QQ", "AJo"
  stage: Stage
  spr: number
  facingAction: FacingAction
  
  level: 'beginner' | 'intermediate' | 'advanced'
  gtoAction: 'fold' | 'call' | 'raise-small' | 'raise-big' | 'all-in'
  gtoReason: string
  exploit: string
}

export interface HandContext {
  position: Position
  heroHand: string
  stage: Stage
  spr: number
  facingAction: FacingAction
}
