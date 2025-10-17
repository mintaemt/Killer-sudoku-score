import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { GameRecord, Difficulty, GameCompletionResult } from '@/lib/types';
import { calculateScore } from '@/lib/scoreCalculator';

export const useGameRecord = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 儲存遊戲記錄
  const saveGameRecord = async (
    userId: string,
    difficulty: Difficulty,
    completionTime: number,
    mistakes: number
  ): Promise<GameCompletionResult | null> => {
    try {
      setLoading(true);
      setError(null);

      // 計算分數
      const score = calculateScore({
        difficulty,
        completionTime,
        mistakes
      });

      // 儲存遊戲記錄到資料庫
      const { data: gameRecord, error: insertError } = await supabase
        .from('game_records')
        .insert({
          user_id: userId,
          difficulty,
          completion_time: completionTime,
          mistakes,
          score,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // 獲取用戶在該難度的排名
      const rank = await getUserRank(userId, difficulty);

      return {
        score,
        rank,
        isNewRecord: false // 可以根據需要實作新紀錄檢查
      };
    } catch (err) {
      console.error('Error saving game record:', err);
      setError('儲存遊戲記錄失敗');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 獲取用戶在特定難度的排名
  const getUserRank = async (userId: string, difficulty: Difficulty): Promise<number | null> => {
    try {
      // 先獲取用戶的最佳分數
      const { data: userBest, error: userError } = await supabase
        .from('game_records')
        .select('score')
        .eq('user_id', userId)
        .eq('difficulty', difficulty)
        .order('score', { ascending: false })
        .limit(1)
        .single();

      if (userError || !userBest) {
        return null;
      }

      // 計算有多少用戶的分數比當前用戶高
      const { data: betterScores, error: rankError } = await supabase
        .from('game_records')
        .select('user_id')
        .eq('difficulty', difficulty)
        .gt('score', userBest.score);

      if (rankError) {
        console.error('Error getting user rank:', rankError);
        return null;
      }

      // 排名 = 比當前用戶分數高的用戶數量 + 1
      const uniqueUsers = new Set(betterScores?.map(record => record.user_id) || []);
      return uniqueUsers.size + 1;
    } catch (err) {
      console.error('Error getting user rank:', err);
      return null;
    }
  };

  // 獲取用戶的最佳成績
  const getUserBestScore = async (userId: string, difficulty: Difficulty): Promise<GameRecord | null> => {
    try {
      const { data, error } = await supabase
        .from('game_records')
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
    loading,
    error,
    saveGameRecord,
    getUserRank,
    getUserBestScore
  };
};
