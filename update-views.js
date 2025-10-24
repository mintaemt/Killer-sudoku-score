// 更新排行榜視圖的排序邏輯
// 
// 使用方法：
// 1. 設置環境變數：VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY
// 2. 執行：node update-views.js
//
// 安全提示：請勿在程式碼中硬編碼 API Key！
const { createClient } = require('@supabase/supabase-js');

// 從環境變數讀取 Supabase 配置
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 錯誤：請設置環境變數 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY');
  console.error('   或使用 .env 檔案');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateLeaderboardViews() {
  try {
    console.log('🔄 開始更新排行榜視圖...');

    // 更新普通模式排行榜視圖
    // 注意：普通模式只包含 4 個難度（不含 hell）
    const normalViewSQL = `
      CREATE OR REPLACE VIEW normal_leaderboard AS
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
          WHEN 'expert' THEN 1
          WHEN 'hard' THEN 2
          WHEN 'medium' THEN 3
          WHEN 'easy' THEN 4
          ELSE 5
        END, 
        MAX(nr.score) DESC;
    `;

    const { data: normalResult, error: normalError } = await supabase.rpc('exec_sql', {
      sql: normalViewSQL
    });

    if (normalError) {
      console.error('❌ 更新普通模式排行榜視圖失敗:', normalError);
      return;
    }

    console.log('✅ 普通模式排行榜視圖更新成功');

    // 更新多巴胺模式排行榜視圖
    const dopamineViewSQL = `
      CREATE OR REPLACE VIEW dopamine_leaderboard AS
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
    `;

    const { data: dopamineResult, error: dopamineError } = await supabase.rpc('exec_sql', {
      sql: dopamineViewSQL
    });

    if (dopamineError) {
      console.error('❌ 更新多巴胺模式排行榜視圖失敗:', dopamineError);
      return;
    }

    console.log('✅ 多巴胺模式排行榜視圖更新成功');
    console.log('🎉 所有排行榜視圖更新完成！');

  } catch (error) {
    console.error('❌ 更新過程中發生錯誤:', error);
  }
}

// 執行更新
updateLeaderboardViews();
