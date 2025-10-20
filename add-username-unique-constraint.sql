-- 添加用戶名稱唯一約束（不區分大小寫）
-- 請在 Supabase SQL Editor 中執行此腳本

-- 1. 首先創建一個不區分大小寫的唯一索引
-- 這會防止重複的用戶名稱（例如：Peter, peter, PeTeR 都被視為相同）
CREATE UNIQUE INDEX IF NOT EXISTS users_name_unique_ci 
ON users (LOWER(name));

-- 2. 如果需要，也可以添加一個檢查約束來確保名稱不為空
ALTER TABLE users 
ADD CONSTRAINT users_name_not_empty 
CHECK (TRIM(name) != '');

-- 3. 確認約束已添加
SELECT 
  indexname, 
  indexdef 
FROM pg_indexes 
WHERE tablename = 'users' AND indexname = 'users_name_unique_ci';

-- 4. 顯示所有約束
SELECT 
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'users'::regclass;
