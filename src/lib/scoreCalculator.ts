import { Difficulty, ScoreCalculationParams } from './types';

// 分數計算詳細結果類型
export interface ScoreCalculationDetails {
  baseScore: number;
  idealTime: number;
  timeBonus: number;
  mistakePenalty: number;
  calculatedScore: number;
  finalScore: number;
  calculationVersion: string;
}

/**
 * 計算分數並返回詳細的計算過程
 */
export const calculateScoreWithDetails = ({
  difficulty,
  completionTime,
  mistakes
}: ScoreCalculationParams): ScoreCalculationDetails => {
  // 基礎分數設定
  const baseScore = {
    easy: 100,
    medium: 200,
    hard: 300,
    expert: 500
  };

  // 理想完成時間
  const idealTimes = {
    easy: 600,    // 10分鐘
    medium: 900,  // 15分鐘
    hard: 1200,   // 20分鐘
    expert: 1800  // 30分鐘
  };

  const idealTime = idealTimes[difficulty];
  
  // 時間獎勵計算
  let timeBonus = 0;
  if (completionTime <= idealTime) {
    timeBonus = Math.min(500, (idealTime - completionTime) * 0.5);
  } else {
    timeBonus = Math.max(0, 100 - (completionTime - idealTime) * 0.1);
  }
  
  // 錯誤懲罰
  const mistakePenalty = mistakes * 20;
  
  // 計算最終分數
  const calculatedScore = baseScore[difficulty] + timeBonus - mistakePenalty;
  const finalScore = Math.max(
    baseScore[difficulty] * 0.2, // 最低分數為基礎分數的20%
    calculatedScore
  );
  
  return {
    baseScore: baseScore[difficulty],
    idealTime,
    timeBonus,
    mistakePenalty,
    calculatedScore,
    finalScore: Math.round(finalScore),
    calculationVersion: 'v1.0'
  };
};

/**
 * 積分計算邏輯（簡化版本，向後兼容）
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
  const details = calculateScoreWithDetails({ difficulty, completionTime, mistakes });
  return details.finalScore;
};

/**
 * 格式化時間顯示（秒數轉換為分:秒格式）
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// 多巴胺模式計分參數
export interface DopamineScoreParams {
  baseDifficulty: Difficulty; // 基礎難度 (easy/medium/hard/expert)
  timeLeft: number;           // 剩餘時間
  remainingCells: number;     // 剩餘格子數
  comboCount: number;         // 連擊數
  mistakes: number;           // 錯誤數
  completionTime: number;     // 總完成時間
}

/**
 * 多巴胺模式計分系統
 */
export const calculateDopamineScore = ({
  baseDifficulty,
  timeLeft,
  remainingCells,
  comboCount,
  mistakes,
  completionTime
}: DopamineScoreParams): ScoreCalculationDetails => {
  // 基礎分數 (更高)
  const baseScore = {
    easy: 200,    // 2倍
    medium: 400,  // 2倍
    hard: 600,    // 2倍
    expert: 1000  // 2倍
  };

  // 時間獎勵 (剩餘時間越多分數越高)
  const timeBonus = timeLeft * 2; // 每秒2分

  // Combo 獎勵 (指數增長)
  const comboBonus = Math.pow(comboCount, 1.5) * 10;

  // 速度獎勵 (完成越快分數越高)
  const speedBonus = Math.max(0, (300 - completionTime) * 5);

  // 錯誤懲罰 (更嚴厲)
  const mistakePenalty = mistakes * 50; // 每個錯誤50分

  const calculatedScore = baseScore[baseDifficulty] + timeBonus + comboBonus + speedBonus - mistakePenalty;
  const finalScore = Math.max(baseScore[baseDifficulty] * 0.3, calculatedScore);

  return {
    baseScore: baseScore[baseDifficulty],
    idealTime: 300, // 5分鐘
    timeBonus,
    mistakePenalty,
    calculatedScore,
    finalScore: Math.round(finalScore),
    calculationVersion: 'dopamine-v1.0'
  };
};

/**
 * 格式化分數顯示（添加千分位逗號）
 */
export const formatScore = (score: number): string => {
  return score.toLocaleString();
};
