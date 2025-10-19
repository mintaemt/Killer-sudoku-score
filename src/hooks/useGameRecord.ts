import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { GameRecord, Difficulty, GameCompletionResult } from '@/lib/types';
import { calculateScore, calculateScoreWithDetails } from '@/lib/scoreCalculator';

export const useGameRecord = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 儲存普通模式遊戲記錄
  const saveNormalGameRecord = async (
    userId: string,
    difficulty: Difficulty,
    completionTime: number,
    mistakes: number
  ): Promise<GameCompletionResult | null> => {
    try {
      setLoading(true);
      setError(null);

      // 計算分數和詳細計算過程
      const scoreDetails = calculateScoreWithDetails({
        difficulty,
        completionTime,
        mistakes
      });
      const score = scoreDetails.finalScore;

      // 儲存遊戲記錄到 normal_records 表
      const { data: gameRecord, error: insertError } = await supabase
        .from('normal_records')
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

      // 儲存分數計算日誌到 normal_score_logs 表
      const { error: logError } = await supabase
        .from('normal_score_logs')
        .insert({
          normal_record_id: gameRecord.id,
          user_id: userId,
          difficulty,
          completion_time: completionTime,
          mistakes,
          base_score: scoreDetails.baseScore,
          ideal_time: scoreDetails.idealTime,
          time_bonus: scoreDetails.timeBonus,
          mistake_penalty: scoreDetails.mistakePenalty,
          calculated_score: scoreDetails.calculatedScore,
          final_score: scoreDetails.finalScore,
          calculation_version: scoreDetails.calculationVersion,
          created_at: new Date().toISOString()
        });

      if (logError) {
        console.error('Error saving normal score log:', logError);
      }

      // 獲取用戶排名
      const rank = await getNormalUserRank(userId, difficulty);

      return {
        score,
        rank,
        isNewRecord: rank === 1 // 如果排名是1，表示是新紀錄
      };

    } catch (err) {
      console.error('Error saving normal game record:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 儲存多巴胺模式遊戲記錄
  const saveDopamineGameRecord = async (
    userId: string,
    difficulty: Difficulty,
    completionTime: number,
    mistakes: number,
    comboCount: number
  ): Promise<GameCompletionResult | null> => {
    try {
      setLoading(true);
      setError(null);

      // 計算分數和詳細計算過程
      const scoreDetails = calculateScoreWithDetails({
        difficulty,
        completionTime,
        mistakes
      });
      const score = scoreDetails.finalScore;

      // 儲存遊戲記錄到 dopamine_records 表
      const { data: gameRecord, error: insertError } = await supabase
        .from('dopamine_records')
        .insert({
          user_id: userId,
          difficulty,
          completion_time: completionTime,
          mistakes,
          score,
          combo_count: comboCount,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // 儲存分數計算日誌到 dopamine_score_logs 表
      const { error: logError } = await supabase
        .from('dopamine_score_logs')
        .insert({
          dopamine_record_id: gameRecord.id,
          user_id: userId,
          difficulty,
          completion_time: completionTime,
          mistakes,
          combo_count: comboCount,
          base_score: scoreDetails.baseScore,
          ideal_time: scoreDetails.idealTime,
          time_bonus: scoreDetails.timeBonus,
          mistake_penalty: scoreDetails.mistakePenalty,
          combo_bonus: scoreDetails.comboBonus || 0,
          calculated_score: scoreDetails.calculatedScore,
          final_score: scoreDetails.finalScore,
          calculation_version: scoreDetails.calculationVersion,
          created_at: new Date().toISOString()
        });

      if (logError) {
        console.error('Error saving dopamine score log:', logError);
      }

      // 獲取用戶排名
      const rank = await getDopamineUserRank(userId, difficulty);

      return {
        score,
        rank,
        isNewRecord: rank === 1 // 如果排名是1，表示是新紀錄
      };

    } catch (err) {
      console.error('Error saving dopamine game record:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 獲取普通模式用戶在特定難度的排名
  const getNormalUserRank = async (userId: string, difficulty: Difficulty): Promise<number | null> => {
    try {
      const { data, error } = await supabase.rpc('get_normal_user_rank', {
        p_user_id: userId,
        p_difficulty: difficulty
      });

      if (error) {
        console.error('Error getting normal user rank:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error getting normal user rank:', err);
      return null;
    }
  };

  // 獲取多巴胺模式用戶在特定難度的排名
  const getDopamineUserRank = async (userId: string, difficulty: Difficulty): Promise<number | null> => {
    try {
      const { data, error } = await supabase.rpc('get_dopamine_user_rank', {
        p_user_id: userId,
        p_difficulty: difficulty
      });

      if (error) {
        console.error('Error getting dopamine user rank:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error getting dopamine user rank:', err);
      return null;
    }
  };

  // 獲取普通模式用戶的最佳成績
  const getNormalUserBestScore = async (userId: string, difficulty: Difficulty): Promise<GameRecord | null> => {
    try {
      const { data, error } = await supabase
        .from('normal_records')
        .select('*')
        .eq('user_id', userId)
        .eq('difficulty', difficulty)
        .order('score', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error getting normal user best score:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error getting normal user best score:', err);
      return null;
    }
  };

  // 獲取多巴胺模式用戶的最佳成績
  const getDopamineUserBestScore = async (userId: string, difficulty: Difficulty): Promise<GameRecord | null> => {
    try {
      const { data, error } = await supabase
        .from('dopamine_records')
        .select('*')
        .eq('user_id', userId)
        .eq('difficulty', difficulty)
        .order('score', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error getting dopamine user best score:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error getting dopamine user best score:', err);
      return null;
    }
  };

  // 獲取所有用戶在特定難度的最高分（普通模式）
  const getAllNormalUsersTopScore = async (difficulty: Difficulty) => {
    try {
      const { data, error } = await supabase
        .from('normal_records')
        .select('score, completion_time, difficulty')
        .eq('difficulty', difficulty)
        .order('score', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        return [];
      }

      return [data];
    } catch (err) {
      console.error('Error getting all normal users top score:', err);
      return [];
    }
  };

  // 獲取所有用戶在特定難度的最高分（多巴胺模式）
  const getAllDopamineUsersTopScore = async (difficulty: Difficulty) => {
    try {
      const { data, error } = await supabase
        .from('dopamine_records')
        .select('score, completion_time, difficulty')
        .eq('difficulty', difficulty)
        .order('score', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        return [];
      }

      return [data];
    } catch (err) {
      console.error('Error getting all dopamine users top score:', err);
      return [];
    }
  };

  return {
    loading,
    error,
    saveNormalGameRecord,
    saveDopamineGameRecord,
    getNormalUserRank,
    getDopamineUserRank,
    getNormalUserBestScore,
    getDopamineUserBestScore,
    getAllNormalUsersTopScore,
    getAllDopamineUsersTopScore
  };
};