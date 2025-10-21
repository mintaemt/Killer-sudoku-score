-- 修正分數日誌表的 RLS 政策問題
-- 解決 dopamine_score_logs 和 normal_score_logs 的 RLS 政策缺失警告
-- 請在 Supabase SQL Editor 中執行此腳本

-- 1. 為 normal_score_logs 表創建 RLS 政策
-- 允許所有人讀取分數日誌（用於調試和分析）
CREATE POLICY "Allow read access to normal_score_logs" ON normal_score_logs
FOR SELECT USING (true);

-- 允許插入分數日誌記錄
CREATE POLICY "Allow insert normal_score_logs" ON normal_score_logs
FOR INSERT WITH CHECK (true);

-- 2. 為 dopamine_score_logs 表創建 RLS 政策
-- 允許所有人讀取分數日誌（用於調試和分析）
CREATE POLICY "Allow read access to dopamine_score_logs" ON dopamine_score_logs
FOR SELECT USING (true);

-- 允許插入分數日誌記錄
CREATE POLICY "Allow insert dopamine_score_logs" ON dopamine_score_logs
FOR INSERT WITH CHECK (true);

-- 3. 確認 RLS 政策已創建
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('normal_score_logs', 'dopamine_score_logs')
  AND schemaname = 'public';

-- 4. 確認表的 RLS 狀態
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('normal_score_logs', 'dopamine_score_logs')
  AND schemaname = 'public';
