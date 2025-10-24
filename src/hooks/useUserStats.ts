/**
 * 使用者統計資料 Hook
 * 提供使用者在不同難度與模式下的遊戲統計資訊
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DopamineDifficulty } from '@/lib/types';

/**
 * 使用者統計資料介面
 * 注意：使用 DopamineDifficulty 以支援所有可能的難度（包括多巴胺模式的 hell）
 */
export interface UserStats {
  totalGames: number;           // 總遊戲數
  bestScore: number;            // 最佳分數
  bestTime: number;             // 最佳時間（秒）
  averageScore: number;         // 平均分數
  totalMistakes: number;        // 總錯誤數
  difficultyStats: {            // 各難度統計（包含所有可能的難度）
    [key in DopamineDifficulty]: {
      gamesPlayed: number;      // 遊戲數量
      bestScore: number;        // 最佳分數
      bestTime: number;         // 最佳時間（秒）
      averageScore: number;     // 平均分數
    };
  };
}

/**
 * Hook 返回值介面
 */
interface UseUserStatsReturn {
  stats: UserStats | null;      // 統計資料
  loading: boolean;             // 載入狀態
  error: string | null;         // 錯誤訊息
}

/**
 * 使用者統計資料 Hook
 * @param userId 使用者 ID（null 表示未登入）
 * @param mode 模式（普通或多巴胺）
 * @returns 統計資料與狀態
 */
export const useUserStats = (
  userId: string | null,
  mode: 'normal' | 'dopamine' = 'normal'
): UseUserStatsReturn => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      // 沒有用戶ID時，設置為空統計
      setStats({
        totalGames: 0,
        bestScore: 0,
        bestTime: 0,
        averageScore: 0,
        totalMistakes: 0,
        difficultyStats: {
          easy: { gamesPlayed: 0, bestScore: 0, bestTime: 0, averageScore: 0 },
          medium: { gamesPlayed: 0, bestScore: 0, bestTime: 0, averageScore: 0 },
          hard: { gamesPlayed: 0, bestScore: 0, bestTime: 0, averageScore: 0 },
          expert: { gamesPlayed: 0, bestScore: 0, bestTime: 0, averageScore: 0 },
          hell: { gamesPlayed: 0, bestScore: 0, bestTime: 0, averageScore: 0 },
        },
      });
      return;
    }

    const fetchUserStats = async () => {
      setLoading(true);
      setError(null);

      try {
        // 根據模式選擇正確的表格
        const tableName = mode === 'normal' ? 'normal_records' : 'dopamine_records';
        
        // 獲取用戶的指定模式遊戲記錄
        const { data: gameRecords, error: fetchError } = await supabase
          .from(tableName)
          .select('*')
          .eq('user_id', userId)
          .order('completed_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        if (!gameRecords || gameRecords.length === 0) {
          // 沒有遊戲記錄時，設置為空統計
          setStats({
            totalGames: 0,
            bestScore: 0,
            bestTime: 0,
            averageScore: 0,
            totalMistakes: 0,
            difficultyStats: {
              easy: { gamesPlayed: 0, bestScore: 0, bestTime: 0, averageScore: 0 },
              medium: { gamesPlayed: 0, bestScore: 0, bestTime: 0, averageScore: 0 },
              hard: { gamesPlayed: 0, bestScore: 0, bestTime: 0, averageScore: 0 },
              expert: { gamesPlayed: 0, bestScore: 0, bestTime: 0, averageScore: 0 },
              hell: { gamesPlayed: 0, bestScore: 0, bestTime: 0, averageScore: 0 },
            },
          });
          return;
        }

        // 直接使用獲取的記錄（已經根據模式選擇了正確的表格）
        const filteredRecords = gameRecords;

        if (filteredRecords.length === 0) {
          // 沒有記錄時，設置為空統計而不是 null
          setStats({
            totalGames: 0,
            bestScore: 0,
            bestTime: 0,
            averageScore: 0,
            totalMistakes: 0,
            difficultyStats: {
              easy: { gamesPlayed: 0, bestScore: 0, bestTime: 0, averageScore: 0 },
              medium: { gamesPlayed: 0, bestScore: 0, bestTime: 0, averageScore: 0 },
              hard: { gamesPlayed: 0, bestScore: 0, bestTime: 0, averageScore: 0 },
              expert: { gamesPlayed: 0, bestScore: 0, bestTime: 0, averageScore: 0 },
              hell: { gamesPlayed: 0, bestScore: 0, bestTime: 0, averageScore: 0 },
            },
          });
          return;
        }

        // 計算統計數據
        const totalGames = filteredRecords.length;
        const bestScore = Math.max(...filteredRecords.map(record => record.score));
        const bestTime = Math.min(...filteredRecords.map(record => record.completion_time));
        const averageScore = filteredRecords.reduce((sum, record) => sum + record.score, 0) / totalGames;
        const totalMistakes = filteredRecords.reduce((sum, record) => sum + record.mistakes, 0);

        // 按難度分組統計
        const difficultyStats = {
          easy: { gamesPlayed: 0, bestScore: 0, bestTime: 0, averageScore: 0 },
          medium: { gamesPlayed: 0, bestScore: 0, bestTime: 0, averageScore: 0 },
          hard: { gamesPlayed: 0, bestScore: 0, bestTime: 0, averageScore: 0 },
          expert: { gamesPlayed: 0, bestScore: 0, bestTime: 0, averageScore: 0 },
          hell: { gamesPlayed: 0, bestScore: 0, bestTime: 0, averageScore: 0 },
        };

        // 計算各難度的統計（包含所有可能的難度）
        const difficulties: DopamineDifficulty[] = ['easy', 'medium', 'hard', 'expert', 'hell'];
        difficulties.forEach(difficulty => {
          const difficultyRecords = filteredRecords.filter(record => record.difficulty === difficulty);
          if (difficultyRecords.length > 0) {
            difficultyStats[difficulty] = {
              gamesPlayed: difficultyRecords.length,
              bestScore: Math.max(...difficultyRecords.map(record => record.score)),
              bestTime: Math.min(...difficultyRecords.map(record => record.completion_time)),
              averageScore: difficultyRecords.reduce((sum, record) => sum + record.score, 0) / difficultyRecords.length,
            };
          }
        });

        setStats({
          totalGames,
          bestScore,
          bestTime,
          averageScore,
          totalMistakes,
          difficultyStats,
        });

      } catch (err) {
        console.error('Error fetching user stats:', err);
        setError('獲取用戶統計失敗');
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [userId, mode]);

  return {
    stats,
    loading,
    error,
  };
};
