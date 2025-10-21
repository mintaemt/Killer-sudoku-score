-- 修正函數的 search_path 問題
-- 解決 get_normal_user_rank、get_dopamine_user_rank 和 get_user_rank 的 search_path 警告
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

-- 3. 處理舊的 get_user_rank 函數（如果存在）
-- 這個函數可能已經被 get_normal_user_rank 和 get_dopamine_user_rank 取代
-- 如果 Supabase Advisor 還在報告這個函數的問題，我們需要刪除它
-- 嘗試不同的參數組合來確保完全刪除
DROP FUNCTION IF EXISTS get_user_rank(UUID, VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS get_user_rank(UUID, TEXT, TEXT);
DROP FUNCTION IF EXISTS get_user_rank(uuid, varchar, varchar);
DROP FUNCTION IF EXISTS get_user_rank(uuid, text, text);

-- 如果以上都不行，嘗試刪除所有 get_user_rank 函數的重載
DO $$
DECLARE
    func_record RECORD;
BEGIN
    FOR func_record IN 
        SELECT proname, oidvectortypes(proargtypes) as argtypes
        FROM pg_proc 
        WHERE proname = 'get_user_rank' 
        AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || quote_ident(func_record.proname) || '(' || func_record.argtypes || ')';
    END LOOP;
END $$;

-- 4. 確認函數已修正
SELECT 
  proname as function_name,
  proconfig as config
FROM pg_proc 
WHERE proname IN ('get_normal_user_rank', 'get_dopamine_user_rank')
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- 5. 檢查 get_user_rank 函數是否還存在
SELECT 
  proname as function_name,
  oidvectortypes(proargtypes) as argtypes,
  proconfig as config
FROM pg_proc 
WHERE proname = 'get_user_rank'
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- 6. 測試函數是否正常運作
SELECT 'Testing get_normal_user_rank function...' as test;
-- 注意：這裡需要有效的 user_id 和 difficulty 參數
-- SELECT * FROM get_normal_user_rank('your-user-id-here', 'easy');

SELECT 'Testing get_dopamine_user_rank function...' as test;
-- 注意：這裡需要有效的 user_id 和 difficulty 參數
-- SELECT * FROM get_dopamine_user_rank('your-user-id-here', 'easy');
