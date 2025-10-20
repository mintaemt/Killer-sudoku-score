// 更新排行榜視圖的排序邏輯
const { createClient } = require('@supabase/supabase-js');

// 從環境變量或直接設置 Supabase 配置
const supabaseUrl = 'https://mintaemt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pbnRhZW10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzQwMjcsImV4cCI6MjA1MDU1MDAyN30.VJ4xJ4xJ4xJ4xJ4xJ4xJ4xJ4xJ4xJ4xJ4xJ4xJ4xJ4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateLeaderboardViews() {
  try {
    console.log('🔄 開始更新排行榜視圖...');

    // 更新普通模式排行榜視圖
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
          WHEN 'easy' THEN 1
          WHEN 'medium' THEN 2
          WHEN 'hard' THEN 3
          WHEN 'expert' THEN 4
          WHEN 'hell' THEN 5
          ELSE 6
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
          WHEN 'easy' THEN 1
          WHEN 'medium' THEN 2
          WHEN 'hard' THEN 3
          WHEN 'expert' THEN 4
          WHEN 'hell' THEN 5
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
