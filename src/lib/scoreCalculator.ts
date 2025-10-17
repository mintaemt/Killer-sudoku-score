import { Difficulty, ScoreCalculationParams } from './types';

/**
 * 積分計算邏輯
 * 
 * 計分規則：
 * 1. 基礎分數：根據難度給予不同基礎分數
 * 2. 時間獎勵：完成時間越短，獎勵越高（最多1000分）
 * 3. 錯誤懲罰：每個錯誤扣除50分
 * 4. 最終分數不能低於0
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
  // 假設理想完成時間：easy(300s), medium(600s), hard(900s), expert(1200s)
  const idealTimes = {
    easy: 300,
    medium: 600,
    hard: 900,
    expert: 1200
  };

  const idealTime = idealTimes[difficulty];
  
  // 時間獎勵：如果完成時間少於理想時間，給予額外獎勵
  // 最多獎勵1000分
  const timeBonus = Math.max(0, Math.min(1000, (idealTime - completionTime) * 2));
  
  // 錯誤懲罰：每個錯誤扣除50分
  const mistakePenalty = mistakes * 50;
  
  // 計算最終分數
  const finalScore = Math.max(0, baseScore[difficulty] + timeBonus - mistakePenalty);
  
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
