/**
 * 排行榜資料管理 Hook
 * 處理普通模式與多巴胺模式的排行榜查詢與使用者排名
 */

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { LeaderboardEntry, Difficulty } from '@/lib/types';

/**
 * Hook 返回值介面
 */
interface UseLeaderboardReturn {
  leaderboard: LeaderboardEntry[];                       // 排行榜資料
  loading: boolean;                                      // 載入狀態
  error: string | null;                                  // 錯誤訊息
  refetch: () => Promise<void>;                          // 重新載入排行榜
  getUserRank: (userId: string, difficulty: Difficulty) => Promise<number | null>;  // 獲取使用者排名
  getUserBestScore: (userId: string, difficulty: Difficulty) => Promise<LeaderboardEntry | null>;  // 獲取使用者最佳成績
}

/**
 * 排行榜資料管理 Hook
 * @param difficulty 難度（可選）
 * @param mode 模式（普通或多巴胺）
 * @returns 排行榜資料與操作函數
 */
export const useLeaderboard = (
  difficulty?: Difficulty,
  mode: 'normal' | 'dopamine' = 'normal'
): UseLeaderboardReturn => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  const fetchLeaderboard = async () => {
    // 防止重複請求與避免 stale closure
    if (isFetchingRef.current) return;

    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      const viewName = mode === 'normal' ? 'normal_leaderboard' : 'dopamine_leaderboard';
      console.log(`🔍 嘗試讀取視圖: ${viewName}, 難度: ${difficulty || 'all'}`);

      let query = supabase.from(viewName).select('*');

      if (difficulty) {
        query = query.eq('difficulty', difficulty);
      } else if (mode === 'normal') {
        // Enforce normal difficulties only
        query = query.in('difficulty', ['easy', 'medium', 'hard', 'expert']);
      }

      // 限制顯示筆數，提升效能
      query = query.limit(50);

      const { data, error } = await query;

      if (error) {
        console.error(`❌ 讀取 ${viewName} 視圖失敗:`, error);
        throw error;
      }

      console.log(`✅ 成功讀取 ${viewName} 視圖:`, data);
      setLeaderboard(data || []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('詳細錯誤信息:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [difficulty, mode]);

  // 獲取用戶在特定難度的排名
  const getUserRank = async (userId: string, difficulty: Difficulty): Promise<number | null> => {
    try {
      const functionName = mode === 'normal' ? 'get_normal_user_rank' : 'get_dopamine_user_rank';
      const { data, error } = await supabase.rpc(functionName, {
        p_user_id: userId,
        p_difficulty: difficulty
      });

      if (error) {
        console.error('Error getting user rank:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error getting user rank:', err);
      return null;
    }
  };

  // 獲取用戶的最佳成績
  const getUserBestScore = async (userId: string, difficulty: Difficulty): Promise<LeaderboardEntry | null> => {
    try {
      const tableName = mode === 'normal' ? 'normal_records' : 'dopamine_records';
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('user_id', userId)
        .eq('difficulty', difficulty)
        .order('score', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error getting user best score:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error getting user best score:', err);
      return null;
    }
  };

  return {
    leaderboard,
    loading,
    error,
    refetch: fetchLeaderboard,
    getUserRank,
    getUserBestScore
  };
};