import { calculateScore } from './scoreCalculator';

// 測試積分計算邏輯
const testCases = [
  {
    name: "簡單模式 - 6:36完成，5次錯誤",
    difficulty: "easy" as const,
    completionTime: 396, // 6:36
    mistakes: 5,
    expectedRange: [80, 120] // 預期分數範圍
  },
  {
    name: "簡單模式 - 5:00完成，0次錯誤",
    difficulty: "easy" as const,
    completionTime: 300, // 5:00
    mistakes: 0,
    expectedRange: [200, 250] // 預期分數範圍
  },
  {
    name: "中等模式 - 15:00完成，3次錯誤",
    difficulty: "medium" as const,
    completionTime: 900, // 15:00
    mistakes: 3,
    expectedRange: [140, 180] // 預期分數範圍
  },
  {
    name: "困難模式 - 25:00完成，8次錯誤",
    difficulty: "hard" as const,
    completionTime: 1500, // 25:00
    mistakes: 8,
    expectedRange: [60, 100] // 預期分數範圍
  }
];

console.log("=== 積分計算測試 ===");
testCases.forEach(testCase => {
  const score = calculateScore({
    difficulty: testCase.difficulty,
    completionTime: testCase.completionTime,
    mistakes: testCase.mistakes
  });
  
  const timeMinutes = Math.floor(testCase.completionTime / 60);
  const timeSeconds = testCase.completionTime % 60;
  const timeStr = `${timeMinutes}:${timeSeconds.toString().padStart(2, '0')}`;
  
  console.log(`\n${testCase.name}`);
  console.log(`時間: ${timeStr}, 錯誤: ${testCase.mistakes}次`);
  console.log(`計算分數: ${score}分`);
  console.log(`預期範圍: ${testCase.expectedRange[0]}-${testCase.expectedRange[1]}分`);
  console.log(`結果: ${score >= testCase.expectedRange[0] && score <= testCase.expectedRange[1] ? '✅ 通過' : '❌ 失敗'}`);
});

export { testCases };
