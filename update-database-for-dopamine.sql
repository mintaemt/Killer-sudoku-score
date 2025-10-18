-- 更新資料庫以支援多巴胺模式
-- 請在 Supabase SQL Editor 中執行此腳本

-- 1. 刪除現有的約束條件
ALTER TABLE game_records DROP CONSTRAINT IF EXISTS game_records_difficulty_check;

-- 2. 添加新的約束條件，支援多巴胺模式的 'hell' 難度
ALTER TABLE game_records ADD CONSTRAINT game_records_difficulty_check 
CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert', 'hell'));

-- 3. 更新排行榜視圖以支援多巴胺模式
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  u.name,
  gr.difficulty,
  MIN(gr.completion_time) as best_time,
  MAX(gr.score) as best_score,
  COUNT(gr.id) as games_played,
  ROW_NUMBER() OVER (PARTITION BY gr.difficulty ORDER BY MAX(gr.score) DESC) as rank
FROM users u
JOIN game_records gr ON u.id = gr.user_id
GROUP BY u.id, u.name, gr.difficulty
ORDER BY gr.difficulty, MAX(gr.score) DESC;

-- 4. 更新排名函數以支援多巴胺模式
CREATE OR REPLACE FUNCTION get_user_rank(p_user_id UUID, p_difficulty VARCHAR)
RETURNS INTEGER AS $$
DECLARE
  user_best_score INTEGER;
  rank_position INTEGER;
BEGIN
  -- 獲取用戶在該難度的最佳分數
  SELECT MAX(score) INTO user_best_score
  FROM game_records
  WHERE user_id = p_user_id AND difficulty = p_difficulty;
  
  IF user_best_score IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- 計算排名
  SELECT COUNT(DISTINCT user_id) + 1 INTO rank_position
  FROM game_records
  WHERE difficulty = p_difficulty AND score > user_best_score;
  
  RETURN rank_position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
