// 用戶相關類型
export interface User {
  id: string;
  name: string;
  created_at: string;
  last_login: string;
}

/**
 * 遊戲記錄類型
 * 注意：difficulty 包含所有可能的難度（包括多巴胺模式的 hell）
 */
export interface GameRecord {
  id: string;
  user_id: string;
  difficulty: Difficulty | DopamineDifficulty; // 支援普通與多巴胺模式的所有難度
  completion_time: number; // 秒數
  mistakes: number;
  score: number;
  completed_at: string;
}

// 排行榜項目類型
export interface LeaderboardEntry {
  name: string;
  difficulty: string;
  mode: string;
  best_time: number;
  best_score: number;
  games_played: number;
  rank: number;
}

// 遊戲完成結果類型
export interface GameCompletionResult {
  score: number;
  rank?: number;
  isNewRecord?: boolean;
}

/**
 * 普通模式難度類型
 * 注意：普通模式不包含地獄難度（hell）
 */
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

/**
 * 多巴胺模式難度類型
 * 包含地獄難度（hell），提供更高難度挑戰
 */
export type DopamineDifficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'hell';

// 積分計算參數類型
export interface ScoreCalculationParams {
  difficulty: Difficulty;
  completionTime: number; // 秒數
  mistakes: number;
}
