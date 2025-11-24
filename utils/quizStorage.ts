export function addQuizRecord(record: {
  timestamp: number;
  isCorrect: boolean;
  questionId: string;
}) {
  const raw = localStorage.getItem("quiz_records");
  const list = raw ? JSON.parse(raw) : [];
  list.push(record);
  localStorage.setItem("quiz_records", JSON.stringify(list.slice(-300)));
}

export function getQuizRecords() {
  const raw = localStorage.getItem("quiz_records");
  return raw ? JSON.parse(raw) : [];
}

export function getLast7DaysQuizData() {
  const records = getQuizRecords();
  const today = new Date();
  const dailyCount = Array(7).fill(0);
  const correctCount = Array(7).fill(0);

  for (const r of records) {
    const diffDays = Math.floor((today.getTime() - new Date(r.timestamp).getTime()) / 86400000);
    if (diffDays >= 0 && diffDays < 7) {
      dailyCount[6 - diffDays] += 1;
      if (r.isCorrect) correctCount[6 - diffDays] += 1;
    }
  }
  return { dailyCount, correctCount };
}
