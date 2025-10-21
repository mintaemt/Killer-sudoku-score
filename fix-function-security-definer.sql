-- 修正函數的 SECURITY DEFINER 屬性
-- 請在 Supabase SQL Editor 中執行此腳本

-- 1. 重新創建普通模式排名函數（不使用 SECURITY DEFINER）
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
$$ LANGUAGE plpgsql;

-- 2. 重新創建多巴胺模式排名函數（不使用 SECURITY DEFINER）
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
$$ LANGUAGE plpgsql;

-- 3. 確認函數已重新創建
SELECT 
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines 
WHERE routine_name IN ('get_normal_user_rank', 'get_dopamine_user_rank')
AND routine_schema = 'public';

-- 4. 測試函數（需要提供有效的 user_id 和 difficulty）
-- SELECT get_normal_user_rank('your-user-id-here', 'easy') as normal_rank;
-- SELECT get_dopamine_user_rank('your-user-id-here', 'easy') as dopamine_rank;
