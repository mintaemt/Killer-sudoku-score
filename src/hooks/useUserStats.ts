import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Difficulty } from '@/lib/types';

export interface UserStats {
  totalGames: number;
  bestScore: number;
  bestTime: number;
  averageScore: number;
  totalMistakes: number;
  difficultyStats: {
    [key in Difficulty]: {
      gamesPlayed: number;
      bestScore: number;
      bestTime: number;
      averageScore: number;
    };
  };
}

export const useUserStats = (userId: string | null, mode: 'normal' | 'dopamine' = 'normal') => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setStats(null);
      return;
    }

    const fetchUserStats = async () => {
      setLoading(true);
      setError(null);

      try {
        // 獲取用戶的指定模式遊戲記錄
        const { data: gameRecords, error: fetchError } = await supabase
          .from('game_records')
          .select('*')
          .eq('user_id', userId)
          .order('completed_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        if (!gameRecords || gameRecords.length === 0) {
          setStats(null);
          return;
        }

        // 根據mode過濾記錄（如果mode欄位存在）
        let filteredRecords = gameRecords;
        if (gameRecords.length > 0 && gameRecords[0].hasOwnProperty('mode')) {
          filteredRecords = gameRecords.filter(record => record.mode === mode);
        } else {
          // 如果沒有mode欄位，根據模式決定是否顯示記錄
          if (mode === 'dopamine') {
            // 多巴胺模式：不顯示任何記錄（因為沒有多巴胺記錄）
            filteredRecords = [];
          } else {
            // 普通模式：顯示所有記錄
            filteredRecords = gameRecords;
          }
        }

        if (filteredRecords.length === 0) {
          setStats(null);
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

        // 計算各難度的統計
        const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert', 'hell'];
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
