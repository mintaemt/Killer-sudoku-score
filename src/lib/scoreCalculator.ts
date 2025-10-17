import { Difficulty, ScoreCalculationParams } from './types';

/**
 * 積分計算邏輯
 * 
 * 計分規則：
 * 1. 基礎分數：根據難度給予不同基礎分數
 * 2. 時間獎勵：完成時間越短，獎勵越高
 * 3. 錯誤懲罰：每個錯誤扣除分數，但不會讓總分為0
 * 4. 最終分數不能低於基礎分數的20%
 */
export const calculateScore = ({
  difficulty,
  completionTime,
  mistakes
}: ScoreCalculationParams): number => {
  // 基礎分數設定
  const baseScore = {
    easy: 100,
    medium: 200,
    hard: 300,
    expert: 500
  };

  // 時間獎勵計算（完成時間越短獎勵越高）
  // 調整理想完成時間，讓時間獎勵更合理
  const idealTimes = {
    easy: 600,    // 10分鐘
    medium: 900,  // 15分鐘
    hard: 1200,   // 20分鐘
    expert: 1800  // 30分鐘
  };

  const idealTime = idealTimes[difficulty];
  
  // 時間獎勵：基於完成時間與理想時間的比例
  // 如果完成時間少於理想時間，給予獎勵
  // 如果完成時間多於理想時間，給予較少獎勵但不為負
  let timeBonus = 0;
  if (completionTime <= idealTime) {
    // 提前完成：給予額外獎勵
    timeBonus = Math.min(500, (idealTime - completionTime) * 0.5);
  } else {
    // 超時完成：給予少量獎勵
    timeBonus = Math.max(0, 100 - (completionTime - idealTime) * 0.1);
  }
  
  // 錯誤懲罰：每個錯誤扣除分數，但不會過度懲罰
  const mistakePenalty = mistakes * 20; // 從50分降低到20分
  
  // 計算最終分數
  const finalScore = Math.max(
    baseScore[difficulty] * 0.2, // 最低分數為基礎分數的20%
    baseScore[difficulty] + timeBonus - mistakePenalty
  );
  
  return Math.round(finalScore);
};

/**
 * 格式化時間顯示（秒數轉換為分:秒格式）
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * 格式化分數顯示（添加千分位逗號）
 */
export const formatScore = (score: number): string => {
  return score.toLocaleString();
};
