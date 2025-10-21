-- 修正函數的 search_path 問題
-- 解決 get_normal_user_rank 和 get_dopamine_user_rank 的 search_path 警告
-- 請在 Supabase SQL Editor 中執行此腳本

-- 1. 修正 get_normal_user_rank 函數的 search_path
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

-- 2. 修正 get_dopamine_user_rank 函數的 search_path
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

-- 3. 確認函數已修正
SELECT 
  proname as function_name,
  proconfig as config
FROM pg_proc 
WHERE proname IN ('get_normal_user_rank', 'get_dopamine_user_rank')
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- 4. 測試函數是否正常運作
SELECT 'Testing get_normal_user_rank function...' as test;
-- 注意：這裡需要有效的 user_id 和 difficulty 參數
-- SELECT * FROM get_normal_user_rank('your-user-id-here', 'easy');

SELECT 'Testing get_dopamine_user_rank function...' as test;
-- 注意：這裡需要有效的 user_id 和 difficulty 參數
-- SELECT * FROM get_dopamine_user_rank('your-user-id-here', 'easy');
