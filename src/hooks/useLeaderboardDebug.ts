import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useLeaderboardDebug = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDebugInfo = async () => {
      try {
        setLoading(true);

        // 檢查 game_records 表
        const { data: gameRecords, error: gameRecordsError } = await supabase
          .from('game_records')
          .select('*')
          .order('completed_at', { ascending: false })
          .limit(10);

        // 檢查 users 表
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('*')
          .limit(10);

        // 檢查 leaderboard 視圖
        const { data: leaderboard, error: leaderboardError } = await supabase
          .from('leaderboard')
          .select('*')
          .limit(10);

        // 檢查簡單模式的排行榜
        const { data: easyLeaderboard, error: easyError } = await supabase
          .from('leaderboard')
          .select('*')
          .eq('difficulty', 'easy')
          .limit(10);

        setDebugInfo({
          gameRecords: { data: gameRecords, error: gameRecordsError },
          users: { data: users, error: usersError },
          leaderboard: { data: leaderboard, error: leaderboardError },
          easyLeaderboard: { data: easyLeaderboard, error: easyError }
        });

      } catch (err) {
        console.error('Error fetching debug info:', err);
        setDebugInfo({ error: err });
      } finally {
        setLoading(false);
      }
    };

    fetchDebugInfo();
  }, []);

  return { debugInfo, loading };
};
