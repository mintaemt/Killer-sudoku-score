// 用戶相關類型
export interface User {
  id: string;
  name: string;
  created_at: string;
  last_login: string;
}

// 遊戲記錄類型
export interface GameRecord {
  id: string;
  user_id: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  completion_time: number; // 秒數
  mistakes: number;
  score: number;
  completed_at: string;
}

// 排行榜項目類型
export interface LeaderboardEntry {
  name: string;
  difficulty: string;
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

// 難度類型
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'dopamine';

// 積分計算參數類型
export interface ScoreCalculationParams {
  difficulty: Difficulty;
  completionTime: number; // 秒數
  mistakes: number;
}
