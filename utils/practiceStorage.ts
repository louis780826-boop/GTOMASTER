// utils/practiceStorage.ts

export function savePracticeRecord(correct: boolean) {
  const key = "practice_records";
  const data = JSON.parse(localStorage.getItem(key) || "[]");

  data.push({
    correct,
    timestamp: Date.now()
  });

  localStorage.setItem(key, JSON.stringify(data));
}

export function getPracticeStats() {
  const key = "practice_records";
  const data: any[] = JSON.parse(localStorage.getItem(key) || "[]");

  const total = data.length;
  const corrects = data.filter(r => r.correct).length;
  const accuracy = total === 0 ? 0 : Math.round((corrects / total) * 100);

  // 連勝
  let streak = 0;
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].correct) streak++;
    else break;
  }

  return {
    total,
    accuracy,
    streak
  };
}
