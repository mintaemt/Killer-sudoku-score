import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LeaderboardEntry, Difficulty } from '@/lib/types';

export const useLeaderboard = (difficulty?: Difficulty) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [difficulty]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('leaderboard')
        .select('*')
        .order('best_score', { ascending: false })
        .limit(50);

      // 如果指定了難度，則篩選該難度
      if (difficulty) {
        query = query.eq('difficulty', difficulty);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setLeaderboard(data || []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('載入排行榜失敗');
    } finally {
      setLoading(false);
    }
  };

  // 獲取用戶在特定難度的排名
  const getUserRank = async (userId: string, difficulty: Difficulty): Promise<number | null> => {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('rank')
        .eq('user_id', userId)
        .eq('difficulty', difficulty)
        .single();

      if (error) {
        console.error('Error getting user rank:', error);
        return null;
      }

      return data?.rank || null;
    } catch (err) {
      console.error('Error getting user rank:', err);
      return null;
    }
  };

  // 獲取用戶的最佳成績
  const getUserBestScore = async (userId: string, difficulty: Difficulty): Promise<LeaderboardEntry | null> => {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('user_id', userId)
        .eq('difficulty', difficulty)
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
