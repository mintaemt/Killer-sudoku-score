import { useLeaderboardDebug } from '@/hooks/useLeaderboardDebug';

export const LeaderboardDebug = () => {
  const { debugInfo, loading } = useLeaderboardDebug();

  if (loading) {
    return <div>載入調試信息中...</div>;
  }

  if (!debugInfo) {
    return <div>無法載入調試信息</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-bold">排行榜調試信息</h3>
      
      <div>
        <h4 className="font-semibold">普通模式記錄 (normal_records):</h4>
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
          {JSON.stringify(debugInfo.normalRecords, null, 2)}
        </pre>
      </div>

      <div>
        <h4 className="font-semibold">多巴胺模式記錄 (dopamine_records):</h4>
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
          {JSON.stringify(debugInfo.dopamineRecords, null, 2)}
        </pre>
      </div>

      <div>
        <h4 className="font-semibold">用戶 (users):</h4>
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
          {JSON.stringify(debugInfo.users, null, 2)}
        </pre>
      </div>

      <div>
        <h4 className="font-semibold">普通模式排行榜 (normal_leaderboard):</h4>
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
          {JSON.stringify(debugInfo.normalLeaderboard, null, 2)}
        </pre>
      </div>

      <div>
        <h4 className="font-semibold">多巴胺模式排行榜 (dopamine_leaderboard):</h4>
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
          {JSON.stringify(debugInfo.dopamineLeaderboard, null, 2)}
        </pre>
      </div>
    </div>
  );
};
