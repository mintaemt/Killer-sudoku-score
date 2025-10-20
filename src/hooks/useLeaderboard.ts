import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LeaderboardEntry, Difficulty } from '@/lib/types';

export const useLeaderboard = (difficulty?: Difficulty, mode: 'normal' | 'dopamine' = 'normal') => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const viewName = mode === 'normal' ? 'normal_leaderboard' : 'dopamine_leaderboard';
      console.log(`🔍 嘗試讀取視圖: ${viewName}, 難度: ${difficulty || 'all'}`);
      
      let query = supabase.from(viewName).select('*');

      if (difficulty) {
        query = query.eq('difficulty', difficulty);
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