-- 修正視圖的 SECURITY DEFINER 問題
-- 根據 Supabase 官方文檔：https://supabase.com/docs/guides/database/database-advisors?queryGroups=lint&lint=0010_security_definer_view
-- 請在 Supabase SQL Editor 中執行此腳本

-- 1. 刪除現有的視圖
DROP VIEW IF EXISTS normal_leaderboard CASCADE;
DROP VIEW IF EXISTS dopamine_leaderboard CASCADE;

-- 2. 重新創建普通模式排行榜視圖（使用 security_invoker=on）
CREATE VIEW normal_leaderboard
WITH (security_invoker=on)
AS
SELECT 
  u.name,
  nr.difficulty,
  MIN(nr.completion_time) as best_time,
  MAX(nr.score) as best_score,
  COUNT(nr.id) as games_played,
  ROW_NUMBER() OVER (PARTITION BY nr.difficulty ORDER BY MAX(nr.score) DESC) as rank
FROM users u
JOIN normal_records nr ON u.id = nr.user_id
GROUP BY u.id, u.name, nr.difficulty
ORDER BY 
  CASE nr.difficulty 
    WHEN 'hell' THEN 1
    WHEN 'expert' THEN 2
    WHEN 'hard' THEN 3
    WHEN 'medium' THEN 4
    WHEN 'easy' THEN 5
    ELSE 6
  END, 
  MAX(nr.score) DESC;

-- 3. 重新創建多巴胺模式排行榜視圖（使用 security_invoker=on）
CREATE VIEW dopamine_leaderboard
WITH (security_invoker=on)
AS
SELECT 
  u.name,
  dr.difficulty,
  MIN(dr.completion_time) as best_time,
  MAX(dr.score) as best_score,
  COUNT(dr.id) as games_played,
  ROW_NUMBER() OVER (PARTITION BY dr.difficulty ORDER BY MAX(dr.score) DESC) as rank
FROM users u
JOIN dopamine_records dr ON u.id = dr.user_id
GROUP BY u.id, u.name, dr.difficulty
ORDER BY 
  CASE dr.difficulty 
    WHEN 'hell' THEN 1
    WHEN 'expert' THEN 2
    WHEN 'hard' THEN 3
    WHEN 'medium' THEN 4
    WHEN 'easy' THEN 5
    ELSE 6
  END, 
  MAX(dr.score) DESC;

-- 4. 確認視圖已重新創建並檢查 security_invoker 設置
SELECT 
  schemaname,
  viewname,
  viewowner,
  definition
FROM pg_views 
WHERE viewname IN ('normal_leaderboard', 'dopamine_leaderboard');

-- 5. 測試視圖查詢
SELECT 'normal_leaderboard' as view_name, COUNT(*) as record_count FROM normal_leaderboard
UNION ALL
SELECT 'dopamine_leaderboard' as view_name, COUNT(*) as record_count FROM dopamine_leaderboard;
