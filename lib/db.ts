// @ts-ignore
// lib/db.ts
import Database from 'better-sqlite3'
import path from 'path'

// 建立或讀取 DB
const dbPath = path.join(process.cwd(), 'gto-master.sqlite')
export const db = new Database(dbPath)

// 初始化 Table
db.exec(`
  CREATE TABLE IF NOT EXISTS training_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    questionId TEXT,
    position TEXT,
    heroHand TEXT,
    stage TEXT,
    facingAction TEXT,
    gtoAction TEXT,
    yourAction TEXT,
    correct INTEGER,
    timeUsed INTEGER,
    createdAt TEXT
  );
`)
db.exec(`
  CREATE TABLE IF NOT EXISTS coach_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    heroHand TEXT,
    position TEXT,
    stage TEXT,
    spr REAL,
    facingAction TEXT,
    gtoAction TEXT,
    gtoReason TEXT,
    exploit TEXT,
    createdAt TEXT
  );
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    image TEXT,
    tier TEXT DEFAULT 'free', -- 'guest' | 'free' | 'premium'
    createdAt TEXT
  );

  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    provider TEXT,
    providerAccountId TEXT,
    access_token TEXT,
    token_type TEXT,
    scope TEXT,
    expires_at INTEGER,
    id_token TEXT,
    session_state TEXT,
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sessionToken TEXT,
    userId INTEGER,
    expires TEXT,
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS verificationTokens (
    identifier TEXT,
    token TEXT,
    expires TEXT
  );
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS training_spots (
    id TEXT PRIMARY KEY,               -- 例如 PREFLOP_UTG_AKs_none_1
    position TEXT NOT NULL,            -- UTG / HJ / CO / ...
    heroHand TEXT NOT NULL,            -- AKs / QQ / ...
    stage TEXT NOT NULL,               -- preflop / flop / ...
    spr REAL NOT NULL,
    facingAction TEXT NOT NULL,        -- none / open / 3bet / 4bet
    level TEXT NOT NULL,               -- beginner / intermediate / advanced
    gtoAction TEXT NOT NULL,           -- fold / call / raise-small / raise-big / all-in
    gtoReason TEXT NOT NULL,
    exploit TEXT NOT NULL,
    createdAt TEXT DEFAULT (DATETIME('now')),
    updatedAt TEXT DEFAULT (DATETIME('now'))
  );
`)
