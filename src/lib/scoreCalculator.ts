import { Difficulty, DopamineDifficulty, ScoreCalculationParams } from './types';

/**
 * 分數計算詳細結果類型
 * 記錄完整的計分過程，用於透明化計分邏輯
 */
export interface ScoreCalculationDetails {
  baseScore: number;          // 基礎分數（根據難度）
  idealTime: number;           // 理想完成時間（秒）
  timeBonus: number;           // 時間獎勵分數
  mistakePenalty: number;      // 錯誤懲罰分數
  comboBonus?: number;         // 連擊獎勵分數（多巴胺模式）
  speedBonus?: number;         // 速度獎勵分數（多巴胺模式）
  calculatedScore: number;     // 計算後的分數（未經最低分限制）
  finalScore: number;          // 最終分數（經過最低分限制）
  calculationVersion: string;  // 計算版本號
}

/**
 * 計算分數並返回詳細的計算過程
 */
export const calculateScoreWithDetails = ({
  difficulty,
  completionTime,
  mistakes
}: ScoreCalculationParams): ScoreCalculationDetails => {
  // 基礎分數設定（普通模式，不包含地獄難度）
  const baseScore: Record<Difficulty, number> = {
    easy: 100,
    medium: 200,
    hard: 300,
    expert: 500
  };

  // 理想完成時間（普通模式，不包含地獄難度）
  const idealTimes: Record<Difficulty, number> = {
    easy: 360,    // 6分鐘
    medium: 720,  // 12分鐘
    hard: 1080,   // 18分鐘
    expert: 1440  // 24分鐘
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
  difficulty: DopamineDifficulty; // 多巴胺模式難度
  timeLeft: number;               // 剩餘時間
  remainingCells: number;         // 剩餘格子數
  comboCount: number;             // 連擊數
  mistakes: number;               // 錯誤數
  completionTime: number;         // 總完成時間
}

/**
 * 多巴胺模式計分系統
 */
export const calculateDopamineScore = ({
  difficulty,
  timeLeft,
  remainingCells,
  comboCount,
  mistakes,
  completionTime
}: DopamineScoreParams): ScoreCalculationDetails => {
  // 基礎分數和時間限制
  const difficultyConfig = {
    easy: { baseScore: 200, timeLimit: 360 },      // 6分鐘
    medium: { baseScore: 400, timeLimit: 720 },    // 12分鐘
    hard: { baseScore: 600, timeLimit: 1080 },     // 18分鐘
    expert: { baseScore: 1000, timeLimit: 1440 },  // 24分鐘
    hell: { baseScore: 2000, timeLimit: 1200 }      // 20分鐘
  };

  const config = difficultyConfig[difficulty];
  
  // 時間獎勵 (剩餘時間越多分數越高)
  const timeBonus = timeLeft * (difficulty === 'hell' ? 5 : 3); // 地獄模式時間獎勵更高

  // Combo 獎勵 (指數增長)
  const comboBonus = Math.pow(comboCount, 1.5) * (difficulty === 'hell' ? 20 : 10);

  // 速度獎勵 (完成越快分數越高)
  const speedBonus = Math.max(0, (config.timeLimit - completionTime) * (difficulty === 'hell' ? 10 : 5));

  // 錯誤懲罰 (更嚴厲)
  const mistakePenalty = mistakes * (difficulty === 'hell' ? 100 : 50);

  const calculatedScore = config.baseScore + timeBonus + comboBonus + speedBonus - mistakePenalty;
  const finalScore = Math.max(config.baseScore * 0.3, calculatedScore);

  return {
    baseScore: config.baseScore,
    idealTime: config.timeLimit,
    timeBonus,
    mistakePenalty,
    comboBonus,
    speedBonus,
    calculatedScore,
    finalScore: Math.round(finalScore),
    calculationVersion: 'dopamine-v2.0'
  };
};

/**
 * 格式化分數顯示（添加千分位逗號）
 */
export const formatScore = (score: number): string => {
  return score.toLocaleString();
};
