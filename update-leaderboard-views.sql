-- 更新排行榜視圖的排序邏輯
-- 普通模式難度順序：easy -> medium -> hard -> expert（不含 hell）
-- 多巴胺模式難度順序：easy -> medium -> hard -> expert -> hell

-- 1. 更新普通模式排行榜視圖
-- 注意：普通模式只包含 4 個難度（不含 hell）
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
ORDER BY 
  CASE nr.difficulty 
    WHEN 'expert' THEN 1
    WHEN 'hard' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'easy' THEN 4
    ELSE 5
  END, 
  MAX(nr.score) DESC;

-- 2. 更新多巴胺模式排行榜視圖
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

-- 3. 驗證視圖更新
SELECT 'normal_leaderboard updated successfully' as status;
SELECT 'dopamine_leaderboard updated successfully' as status;
