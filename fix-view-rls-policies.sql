-- 修正視圖的 RLS 策略問題
-- 解決 dopamine_leaderboard 和 normal_leaderboard 的 unrestricted 警告
-- 請在 Supabase SQL Editor 中執行此腳本

-- 1. 刪除現有視圖
DROP VIEW IF EXISTS normal_leaderboard CASCADE;
DROP VIEW IF EXISTS dopamine_leaderboard CASCADE;

-- 2. 重新創建視圖，確保正確的 security_invoker 設置
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

-- 3. 確認視圖已重新創建
SELECT 
  schemaname,
  viewname,
  viewowner
FROM pg_views 
WHERE viewname IN ('normal_leaderboard', 'dopamine_leaderboard');

-- 4. 測試視圖查詢
SELECT 'Testing normal_leaderboard access...' as test;
SELECT COUNT(*) as normal_count FROM normal_leaderboard;

SELECT 'Testing dopamine_leaderboard access...' as test;
SELECT COUNT(*) as dopamine_count FROM dopamine_leaderboard;
