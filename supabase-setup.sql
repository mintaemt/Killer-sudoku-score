-- Killer Sudoku Score 資料庫設定腳本
-- 請在 Supabase SQL Editor 中執行此腳本

-- 1. 創建用戶表
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 創建遊戲記錄表
CREATE TABLE IF NOT EXISTS game_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
  completion_time INTEGER NOT NULL, -- 秒數
  mistakes INTEGER NOT NULL DEFAULT 0,
  score INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 創建排行榜視圖
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

-- 4. 啟用 Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_records ENABLE ROW LEVEL SECURITY;

-- 5. 創建 RLS 政策
-- 允許所有人讀取排行榜
CREATE POLICY "Allow read access to leaderboard" ON game_records
FOR SELECT USING (true);

-- 允許插入遊戲記錄
CREATE POLICY "Allow insert game records" ON game_records
FOR INSERT WITH CHECK (true);

-- 允許讀取用戶資料
CREATE POLICY "Allow read access to users" ON users
FOR SELECT USING (true);

-- 允許插入用戶資料
CREATE POLICY "Allow insert users" ON users
FOR INSERT WITH CHECK (true);

-- 允許更新用戶資料
CREATE POLICY "Allow update users" ON users
FOR UPDATE USING (true);

-- 6. 創建索引以提高查詢效能
CREATE INDEX IF NOT EXISTS idx_game_records_user_difficulty ON game_records(user_id, difficulty);
CREATE INDEX IF NOT EXISTS idx_game_records_difficulty_score ON game_records(difficulty, score DESC);
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);

-- 7. 創建函數來獲取用戶排名（可選）
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
