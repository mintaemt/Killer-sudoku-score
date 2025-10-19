-- 完全清空資料庫並重新建立乾淨的結構
-- 請在 Supabase SQL Editor 中執行此腳本
-- ⚠️ 警告：此腳本會刪除所有現有數據！

-- 1. 刪除所有現有的視圖
DROP VIEW IF EXISTS leaderboard CASCADE;
DROP VIEW IF EXISTS normal_leaderboard CASCADE;
DROP VIEW IF EXISTS dopamine_leaderboard CASCADE;

-- 2. 刪除所有現有的函數
DROP FUNCTION IF EXISTS get_user_rank(UUID, VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS get_normal_user_rank(UUID, VARCHAR);
DROP FUNCTION IF EXISTS get_dopamine_user_rank(UUID, VARCHAR);

-- 3. 刪除所有現有的表格（會自動刪除相關的日誌表）
DROP TABLE IF EXISTS score_calculation_logs CASCADE;
DROP TABLE IF EXISTS normal_score_logs CASCADE;
DROP TABLE IF EXISTS dopamine_score_logs CASCADE;
DROP TABLE IF EXISTS game_records CASCADE;
DROP TABLE IF EXISTS normal_records CASCADE;
DROP TABLE IF EXISTS dopamine_records CASCADE;

-- 4. 清空用戶表（保留表結構，只清空數據）
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- 5. 確認清空完成
SELECT 'All existing data has been cleared successfully' as status;
