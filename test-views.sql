-- 檢查視圖是否存在的測試腳本
-- 請在 Supabase SQL Editor 中執行此腳本

-- 1. 檢查 normal_leaderboard 視圖
SELECT 'normal_leaderboard 視圖檢查' as test_name;
SELECT * FROM normal_leaderboard LIMIT 5;

-- 2. 檢查 dopamine_leaderboard 視圖  
SELECT 'dopamine_leaderboard 視圖檢查' as test_name;
SELECT * FROM dopamine_leaderboard LIMIT 5;

-- 3. 檢查 normal_records 表
SELECT 'normal_records 表檢查' as test_name;
SELECT * FROM normal_records LIMIT 5;

-- 4. 檢查 dopamine_records 表
SELECT 'dopamine_records 表檢查' as test_name;
SELECT * FROM dopamine_records LIMIT 5;

-- 5. 檢查 users 表
SELECT 'users 表檢查' as test_name;
SELECT * FROM users LIMIT 5;

-- 6. 檢查視圖定義
SELECT '視圖定義檢查' as test_name;
SELECT schemaname, viewname, definition 
FROM pg_views 
WHERE viewname IN ('normal_leaderboard', 'dopamine_leaderboard');
