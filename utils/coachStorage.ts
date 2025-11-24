// utils/coachStorage.ts
// AI 教練 V4 — 弱點分析 + 趨勢資料 + Dashboard 統計

const KEY_V4 = "coach_v4_records";

export interface CoachRecord {
  timestamp: number;
  position: string;
  combo: string;
  spr: number;
  userAction: string; // RAISE / CALL / FOLD
  gtoAction: string;  // RAISE / CALL / FOLD
  evDiff: number;     // heroEV - gtoEV（負數代表虧損）
}

// 儲存一筆 V4 教練紀錄
export function saveCoachRecordV4(rec: CoachRecord) {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(KEY_V4);
  const data = raw ? JSON.parse(raw) : [];
  data.push(rec);
  localStorage.setItem(KEY_V4, JSON.stringify(data));
}

// 讀取所有 V4 教練紀錄
export function getCoachRecordsV4(): CoachRecord[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY_V4);
  return raw ? JSON.parse(raw) : [];
}

// =============================
// 弱點分析（雷達圖 / lastLeak 用）
// =============================

export function getLeakProfile() {
  const recs = getCoachRecordsV4();

  if (recs.length === 0) {
    return {
      overFold: 0,
      overCall: 0,
      overRaise: 0,
      tooTight: 0,
      tooLoose: 0
    };
  }

  let overFold = 0;
  let overCall = 0;
  let overRaise = 0;
  let tooTight = 0;
  let tooLoose = 0;

  recs.forEach((r) => {
    // Over-fold：該 RAISE/CALL 時卻 FOLD
    if (r.userAction === "FOLD" && r.gtoAction !== "FOLD") {
      overFold++;
      tooTight++;
    }

    // Over-call：該 RAISE 時卻 CALL
    if (r.userAction === "CALL" && r.gtoAction === "RAISE") {
      overCall++;
    }

    // Over-raise：該 CALL/FOLD 時卻 RAISE
    if (r.userAction === "RAISE" && r.gtoAction !== "RAISE") {
      overRaise++;
    }

    // 太鬆：GTO fold，但你還是 call/raise
    if (r.gtoAction === "FOLD" && r.userAction !== "FOLD") {
      tooLoose++;
    }
  });

  return {
    overFold,
    overCall,
    overRaise,
    tooTight,
    tooLoose
  };
}

// =============================
// 7 天趨勢（Dashboard 用折線圖資料）
// =============================

export function getTrend7Days() {
  const recs = getCoachRecordsV4();
  const now = Date.now();

  const days = [];

  for (let i = 6; i >= 0; i--) {
    const dayStart = now - i * 24 * 60 * 60 * 1000;
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;

    const dayRecs = recs.filter(
      (r) => r.timestamp >= dayStart && r.timestamp < dayEnd
    );

    let avgEv = 0;
    if (dayRecs.length > 0) {
      avgEv =
        dayRecs.reduce((sum, r) => sum + r.evDiff, 0) / dayRecs.length;
    }

    days.push({
      day: `D-${i}`,
      count: dayRecs.length,
      avgEv: Number(avgEv.toFixed(2))
    });
  }

  return days;
}

// =============================
// Dashboard V1 相容：getCoachStats
// =============================

export function getCoachStats() {
  const recs = getCoachRecordsV4();
  const total = recs.length;

  if (total === 0) {
    return {
      total: 0,
      avgAccuracy: 0,
      lastLeak: "無紀錄"
    };
  }

  // 用 evDiff 粗略轉成「準確率」
  // evDiff 越接近 0，準確率越高
  let sumAcc = 0;
  recs.forEach((r) => {
    const penalty = Math.abs(r.evDiff); // 單純看虧損絕對值
    const acc = Math.max(0, 100 - penalty * 20); // 每 1 EV 差距扣 20 分
    sumAcc += acc;
  });
  const avgAccuracy = Math.round(sumAcc / total);

  // lastLeak = 目前最嚴重的 leak 類型
  const leak = getLeakProfile();
  const arr: [string, number][] = [
    ["Over-Fold", leak.overFold],
    ["Over-Call", leak.overCall],
    ["Over-Raise", leak.overRaise],
    ["太緊", leak.tooTight],
    ["太鬆", leak.tooLoose]
  ];
  arr.sort((a, b) => b[1] - a[1]);

  let lastLeak = "完全正解";
  if (arr[0][1] > 0) {
    lastLeak = arr[0][0];
  }

  return {
    total,
    avgAccuracy,
    lastLeak
  };
}
