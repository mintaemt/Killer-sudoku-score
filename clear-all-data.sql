-- 清除所有舊資料表內容，解決外鍵衝突與髒資料
-- 請在 Supabase SQL Editor 中執行

TRUNCATE TABLE normal_score_logs CASCADE;
TRUNCATE TABLE dopamine_score_logs CASCADE;
TRUNCATE TABLE normal_records CASCADE;
TRUNCATE TABLE dopamine_records CASCADE;
TRUNCATE TABLE users CASCADE;

-- 執行完畢後，您的資料庫將完全乾淨，且不影響 auth.users 登入資訊
