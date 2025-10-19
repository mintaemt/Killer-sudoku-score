import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useLeaderboardDebug = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDebugInfo = async () => {
      try {
        setLoading(true);

        // 檢查 normal_records 表
        const { data: normalRecords, error: normalRecordsError } = await supabase
          .from('normal_records')
          .select('*')
          .order('completed_at', { ascending: false })
          .limit(10);

        // 檢查 dopamine_records 表
        const { data: dopamineRecords, error: dopamineRecordsError } = await supabase
          .from('dopamine_records')
          .select('*')
          .order('completed_at', { ascending: false })
          .limit(10);

        // 檢查 users 表
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('*')
          .limit(10);

        // 檢查 normal_leaderboard 視圖
        const { data: normalLeaderboard, error: normalLeaderboardError } = await supabase
          .from('normal_leaderboard')
          .select('*')
          .limit(10);

        // 檢查 dopamine_leaderboard 視圖
        const { data: dopamineLeaderboard, error: dopamineLeaderboardError } = await supabase
          .from('dopamine_leaderboard')
          .select('*')
          .limit(10);

        setDebugInfo({
          normalRecords: { data: normalRecords, error: normalRecordsError },
          dopamineRecords: { data: dopamineRecords, error: dopamineRecordsError },
          users: { data: users, error: usersError },
          normalLeaderboard: { data: normalLeaderboard, error: normalLeaderboardError },
          dopamineLeaderboard: { data: dopamineLeaderboard, error: dopamineLeaderboardError }
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
