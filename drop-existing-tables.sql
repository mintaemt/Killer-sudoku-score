-- 刪除現有表格和相關對象
-- 請在 Supabase SQL Editor 中執行此腳本

-- 1. 刪除現有的排行榜視圖
DROP VIEW IF EXISTS leaderboard;

-- 2. 刪除現有的排名函數
DROP FUNCTION IF EXISTS get_user_rank(UUID, VARCHAR, VARCHAR);

-- 3. 刪除分數計算日誌表
DROP TABLE IF EXISTS score_calculation_logs CASCADE;

-- 4. 刪除遊戲記錄表
DROP TABLE IF EXISTS game_records CASCADE;

-- 5. 確認刪除完成
SELECT 'All existing tables and views have been dropped successfully' as status;
