# Killer Sudoku Score 系統設定指南

## 📋 概述

本指南將協助您設定 Killer Sudoku 的積分系統和排行榜功能。系統使用 Supabase 作為後端資料庫，提供用戶管理、積分計算和排行榜功能。

## 🚀 快速開始

### 1. Supabase 設定

1. 前往 [Supabase](https://supabase.com) 創建新專案
2. 在專案設定中取得以下資訊：
   - Project URL
   - API Key (anon/public)
3. 在 SQL Editor 中執行 `supabase-setup.sql` 腳本

### 2. 環境變數設定

在專案根目錄創建 `.env` 檔案：

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. 安裝依賴

```bash
npm install
# 或
bun install
```

### 4. 啟動開發伺服器

```bash
npm run dev
# 或
bun dev
```

## 🎯 功能特色

### 用戶系統
- 首次訪問時要求輸入姓名
- 自動創建或更新用戶資料
- 本地儲存用戶資訊

### 積分系統
- **基礎分數**：根據難度給予不同基礎分數
  - 簡單：100 分
  - 中等：200 分
  - 困難：300 分
  - 專家：500 分
- **時間獎勵**：完成時間越短，獎勵越高（最多 1000 分）
- **錯誤懲罰**：每個錯誤扣除 50 分
- **最終分數**：不能低於 0 分

### 排行榜系統
- 按難度分類顯示排行榜
- 顯示最佳分數、最佳時間和遊戲次數
- 即時排名更新
- 支援分頁和篩選

## 📊 資料庫結構

### users 表
```sql
- id: UUID (主鍵)
- name: VARCHAR(50) (用戶姓名)
- created_at: TIMESTAMP (創建時間)
- last_login: TIMESTAMP (最後登入時間)
```

### game_records 表
```sql
- id: UUID (主鍵)
- user_id: UUID (外鍵，關聯 users.id)
- difficulty: VARCHAR(20) (難度：easy/medium/hard/expert)
- completion_time: INTEGER (完成時間，秒)
- mistakes: INTEGER (錯誤次數)
- score: INTEGER (計算後的分數)
- completed_at: TIMESTAMP (完成時間)
```

### leaderboard 視圖
```sql
- name: 用戶姓名
- difficulty: 難度
- best_time: 最佳完成時間
- best_score: 最佳分數
- games_played: 遊戲次數
- rank: 排名
```

## 🔧 技術架構

### 前端架構
- **React 18** + **TypeScript**
- **Vite** 建置工具
- **Tailwind CSS** + **shadcn/ui** UI 框架
- **React Router** 路由管理
- **TanStack Query** 狀態管理

### 後端架構
- **Supabase** (PostgreSQL)
- **Row Level Security (RLS)** 資料安全
- **即時訂閱** 排行榜更新

### 核心組件
- `UserNameInput`: 用戶名稱輸入
- `GameCompleteModal`: 遊戲完成模態框
- `Leaderboard`: 排行榜組件
- `useUser`: 用戶管理 Hook
- `useGameRecord`: 遊戲記錄 Hook
- `useLeaderboard`: 排行榜 Hook

## 📁 檔案結構

```
src/
├── components/
│   ├── UserNameInput.tsx      # 用戶名稱輸入組件
│   ├── GameCompleteModal.tsx  # 遊戲完成模態框
│   ├── Leaderboard.tsx        # 排行榜組件
│   └── ...
├── hooks/
│   ├── useUser.ts            # 用戶管理 Hook
│   ├── useGameRecord.ts      # 遊戲記錄 Hook
│   ├── useLeaderboard.ts     # 排行榜 Hook
│   └── ...
├── lib/
│   ├── supabase.ts           # Supabase 客戶端
│   ├── types.ts              # TypeScript 類型定義
│   ├── scoreCalculator.ts    # 積分計算邏輯
│   └── ...
├── pages/
│   ├── Index.tsx             # 主遊戲頁面
│   ├── LeaderboardPage.tsx   # 排行榜頁面
│   └── ...
└── ...
```

## 🎮 使用流程

1. **首次訪問**：系統要求輸入姓名
2. **開始遊戲**：選擇難度並開始遊戲
3. **遊戲進行**：系統追蹤時間和錯誤次數
4. **遊戲完成**：自動計算分數並顯示結果
5. **查看排行榜**：可以查看各難度的排行榜

## 🔒 安全性

- 使用 Supabase RLS 確保資料安全
- 所有 API 請求都經過身份驗證
- 用戶資料本地加密儲存
- 防止 SQL 注入攻擊

## 🚀 部署

### Render 部署
1. 連接 GitHub 倉庫
2. 設定環境變數
3. 選擇 Node.js 建置環境
4. 部署完成後測試功能

### 環境變數設定
在 Render 中設定以下環境變數：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🐛 故障排除

### 常見問題

1. **Supabase 連接失敗**
   - 檢查環境變數是否正確設定
   - 確認 Supabase 專案狀態

2. **排行榜不顯示**
   - 檢查資料庫視圖是否正確創建
   - 確認 RLS 政策設定

3. **積分計算錯誤**
   - 檢查 `scoreCalculator.ts` 邏輯
   - 確認遊戲完成檢查邏輯

### 除錯技巧

1. 檢查瀏覽器開發者工具的控制台
2. 查看 Supabase 日誌
3. 確認網路請求狀態

## 📈 未來擴展

- [ ] 用戶個人資料頁面
- [ ] 成就系統
- [ ] 社交功能（好友對比）
- [ ] 每日挑戰
- [ ] 統計分析
- [ ] 多語言支援

## 📞 支援

如有問題，請檢查：
1. 本 README 文件
2. 程式碼註解
3. Supabase 官方文件
4. React/TypeScript 文件

---

**注意**：請確保在生產環境中使用前，先在開發環境中充分測試所有功能。
