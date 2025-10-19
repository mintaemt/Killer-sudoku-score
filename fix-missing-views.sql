-- 快速修復：創建缺失的視圖
-- 請在 Supabase SQL Editor 中執行此腳本

-- 1. 創建普通模式排行榜視圖
CREATE OR REPLACE VIEW normal_leaderboard AS
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
ORDER BY nr.difficulty, MAX(nr.score) DESC;

-- 2. 創建多巴胺模式排行榜視圖
CREATE OR REPLACE VIEW dopamine_leaderboard AS
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
ORDER BY dr.difficulty, MAX(dr.score) DESC;

-- 3. 確認創建完成
SELECT 'Views created successfully' as status;
