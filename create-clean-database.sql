-- 建立全新的乾淨資料庫結構
-- 請在 Supabase SQL Editor 中執行此腳本
-- 在執行 clear-all-data.sql 之後執行此腳本

-- 1. 創建普通模式記錄表
CREATE TABLE IF NOT EXISTS normal_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
  completion_time INTEGER NOT NULL, -- 秒數
  mistakes INTEGER NOT NULL DEFAULT 0,
  score INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 創建多巴胺模式記錄表
CREATE TABLE IF NOT EXISTS dopamine_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert', 'hell')),
  completion_time INTEGER NOT NULL, -- 秒數
  mistakes INTEGER NOT NULL DEFAULT 0,
  score INTEGER NOT NULL,
  combo_count INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 創建普通模式分數計算日誌表
CREATE TABLE IF NOT EXISTS normal_score_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  normal_record_id UUID REFERENCES normal_records(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  difficulty VARCHAR(20) NOT NULL,
  completion_time INTEGER NOT NULL,
  mistakes INTEGER NOT NULL,
  base_score INTEGER NOT NULL,
  ideal_time INTEGER NOT NULL,
  time_bonus DECIMAL(10,2) NOT NULL,
  mistake_penalty INTEGER NOT NULL,
  calculated_score DECIMAL(10,2) NOT NULL,
  final_score INTEGER NOT NULL,
  calculation_version VARCHAR(20) DEFAULT 'v1.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 創建多巴胺模式分數計算日誌表
CREATE TABLE IF NOT EXISTS dopamine_score_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dopamine_record_id UUID REFERENCES dopamine_records(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  difficulty VARCHAR(20) NOT NULL,
  completion_time INTEGER NOT NULL,
  mistakes INTEGER NOT NULL,
  combo_count INTEGER NOT NULL,
  base_score INTEGER NOT NULL,
  ideal_time INTEGER NOT NULL,
  time_bonus DECIMAL(10,2) NOT NULL,
  mistake_penalty INTEGER NOT NULL,
  combo_bonus DECIMAL(10,2) NOT NULL,
  calculated_score DECIMAL(10,2) NOT NULL,
  final_score INTEGER NOT NULL,
  calculation_version VARCHAR(20) DEFAULT 'v1.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 創建普通模式排行榜視圖
CREATE OR REPLACE VIEW normal_leaderboard
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

-- 6. 創建多巴胺模式排行榜視圖
CREATE OR REPLACE VIEW dopamine_leaderboard
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

-- 7. 創建普通模式排名函數
CREATE OR REPLACE FUNCTION get_normal_user_rank(p_user_id UUID, p_difficulty VARCHAR)
RETURNS INTEGER AS $$
DECLARE
  user_best_score INTEGER;
  rank_position INTEGER;
BEGIN
  -- 獲取用戶在該難度的最佳分數
  SELECT MAX(score) INTO user_best_score
  FROM normal_records
  WHERE user_id = p_user_id AND difficulty = p_difficulty;
  
  IF user_best_score IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- 計算排名
  SELECT COUNT(DISTINCT user_id) + 1 INTO rank_position
  FROM normal_records
  WHERE difficulty = p_difficulty AND score > user_best_score;
  
  RETURN rank_position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 8. 創建多巴胺模式排名函數
CREATE OR REPLACE FUNCTION get_dopamine_user_rank(p_user_id UUID, p_difficulty VARCHAR)
RETURNS INTEGER AS $$
DECLARE
  user_best_score INTEGER;
  rank_position INTEGER;
BEGIN
  -- 獲取用戶在該難度的最佳分數
  SELECT MAX(score) INTO user_best_score
  FROM dopamine_records
  WHERE user_id = p_user_id AND difficulty = p_difficulty;
  
  IF user_best_score IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- 計算排名
  SELECT COUNT(DISTINCT user_id) + 1 INTO rank_position
  FROM dopamine_records
  WHERE difficulty = p_difficulty AND score > user_best_score;
  
  RETURN rank_position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 9. 啟用 Row Level Security (RLS)
ALTER TABLE normal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE dopamine_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE normal_score_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dopamine_score_logs ENABLE ROW LEVEL SECURITY;

-- 10. 創建 RLS 政策
-- 允許所有人讀取排行榜
CREATE POLICY "Allow read access to normal_records" ON normal_records
FOR SELECT USING (true);

CREATE POLICY "Allow read access to dopamine_records" ON dopamine_records
FOR SELECT USING (true);

-- 允許插入遊戲記錄
CREATE POLICY "Allow insert normal_records" ON normal_records
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow insert dopamine_records" ON dopamine_records
FOR INSERT WITH CHECK (true);

-- 11. 創建索引以提高查詢效能
CREATE INDEX IF NOT EXISTS idx_normal_records_user_difficulty ON normal_records(user_id, difficulty);
CREATE INDEX IF NOT EXISTS idx_dopamine_records_user_difficulty ON dopamine_records(user_id, difficulty);
CREATE INDEX IF NOT EXISTS idx_normal_records_score ON normal_records(difficulty, score DESC);
CREATE INDEX IF NOT EXISTS idx_dopamine_records_score ON dopamine_records(difficulty, score DESC);

-- 12. 確認創建完成
SELECT 'All new tables, views, and functions have been created successfully' as status;
