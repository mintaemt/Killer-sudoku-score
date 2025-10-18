-- 添加mode欄位到game_records表以區分普通模式和多巴胺模式
-- 請在 Supabase SQL Editor 中執行此腳本

-- 1. 添加mode欄位
ALTER TABLE game_records ADD COLUMN IF NOT EXISTS mode VARCHAR(20) DEFAULT 'normal' CHECK (mode IN ('normal', 'dopamine'));

-- 2. 更新現有記錄為普通模式
UPDATE game_records SET mode = 'normal' WHERE mode IS NULL;

-- 3. 更新分數計算日誌表
ALTER TABLE score_calculation_logs ADD COLUMN IF NOT EXISTS mode VARCHAR(20) DEFAULT 'normal' CHECK (mode IN ('normal', 'dopamine'));

-- 4. 更新現有分數計算日誌
UPDATE score_calculation_logs SET mode = 'normal' WHERE mode IS NULL;

-- 5. 更新排行榜視圖以支援模式區分
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  u.name,
  gr.difficulty,
  gr.mode,
  MIN(gr.completion_time) as best_time,
  MAX(gr.score) as best_score,
  COUNT(gr.id) as games_played,
  ROW_NUMBER() OVER (PARTITION BY gr.difficulty, gr.mode ORDER BY MAX(gr.score) DESC) as rank
FROM users u
JOIN game_records gr ON u.id = gr.user_id
GROUP BY u.id, u.name, gr.difficulty, gr.mode
ORDER BY gr.difficulty, gr.mode, MAX(gr.score) DESC;

-- 6. 更新排名函數以支援模式區分
CREATE OR REPLACE FUNCTION get_user_rank(p_user_id UUID, p_difficulty VARCHAR, p_mode VARCHAR DEFAULT 'normal')
RETURNS INTEGER AS $$
DECLARE
  user_best_score INTEGER;
  rank_position INTEGER;
BEGIN
  -- 獲取用戶在該難度和模式的最佳分數
  SELECT MAX(score) INTO user_best_score
  FROM game_records
  WHERE user_id = p_user_id AND difficulty = p_difficulty AND mode = p_mode;
  
  IF user_best_score IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- 計算排名
  SELECT COUNT(DISTINCT user_id) + 1 INTO rank_position
  FROM game_records
  WHERE difficulty = p_difficulty AND mode = p_mode AND score > user_best_score;
  
  RETURN rank_position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
