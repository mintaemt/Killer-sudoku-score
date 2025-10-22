# Killer Sudoku Score

一個具有計分系統和排行榜功能的殺手數獨遊戲，使用現代網頁技術建構。

## 1. 遊戲特色

### 兩種遊戲模式
- **普通模式** - 經典的殺手數獨玩法，注重準確性和完成時間
- **多巴胺模式** - 限時挑戰模式，包含連擊系統和動態計分

### 核心功能
- **殺手數獨遊戲** - 完整的數獨謎題與籠子約束條件
- **智能計分系統** - 基於完成時間、錯誤次數和難度的分數計算
- **即時排行榜** - 與其他玩家競爭並追蹤個人進度
- **多種主題** - 六種色彩主題選擇（藍、橙、綠、紫、粉、青綠）
- **深色/淺色模式** - 自動系統主題偵測與手動切換
- **響應式設計** - 針對桌面和行動裝置優化
- **用戶系統** - 支援訪客模式和用戶註冊
- **多巴胺模式** - 限時挑戰與連擊獎勵系統

## 2. 快速開始

### 系統需求
- Node.js 18+ 
- npm 或 yarn

### 安裝步驟

```bash
# 1. 複製專案
git clone https://github.com/mintaemt/Killer-sudoku-score.git

# 2. 進入專案目錄
cd Killer-sudoku-score

# 3. 安裝相依套件
npm install

# 4. 啟動開發伺服器
npm run dev
```

開啟瀏覽器前往 `http://localhost:5173` 開始遊戲！

## 3. 技術棧

### 前端框架
- **Vite** - 快速的建構工具和開發伺服器
- **React 18** - 現代UI函式庫與Hooks
- **TypeScript** - 型別安全的JavaScript開發
- **React Router** - 客戶端路由管理

### UI 元件與樣式
- **shadcn/ui** - 美觀且無障礙的UI元件庫
- **Radix UI** - 無樣式的UI原語
- **Tailwind CSS** - 實用優先的CSS框架
- **Lucide React** - 現代化的圖示庫

### 狀態管理與資料
- **React Query** - 伺服器狀態管理
- **Supabase** - 後端即服務平台
- **PostgreSQL** - 關聯式資料庫

### 開發工具
- **ESLint** - 程式碼品質檢查
- **PostCSS** - CSS後處理器
- **Autoprefixer** - CSS自動前綴

## 4. 專案結構

```
src/
├── components/          # React元件
│   ├── ui/             # 基礎UI元件
│   ├── KillerSudokuGrid.tsx
│   ├── NumberPad.tsx
│   ├── DifficultySelector.tsx
│   └── ...
├── hooks/              # 自定義Hooks
│   ├── useUser.ts
│   ├── useGameRecord.ts
│   └── ...
├── lib/                # 工具函式庫
│   ├── supabase.ts
│   ├── scoreCalculator.ts
│   ├── sudoku-generator.ts
│   └── ...
├── pages/              # 頁面元件
└── main.tsx           # 應用程式入口點
```

## 5. 遊戲規則

### 普通模式
- 使用數字1-9填滿9x9網格
- 每個數字在行、列、3x3宮格中只能出現一次
- 籠子內的數字總和必須等於指定的目標值
- 分數基於完成時間和錯誤次數計算

### 多巴胺模式
- 限時挑戰模式
- 連續正確答案可獲得連擊獎勵
- 錯誤超過3次或時間到即遊戲結束
- 分數包含時間獎勵、連擊獎勵和準確性

## 6. 計分系統

### 普通模式計分
- **基礎分數**: 根據難度設定
- **時間獎勵**: 完成時間越短獎勵越高
- **錯誤懲罰**: 每次錯誤扣除分數

### 多巴胺模式計分
- **基礎分數**: 根據難度設定
- **時間獎勵**: 剩餘時間越多獎勵越高
- **連擊獎勵**: 連續正確答案的額外分數
- **錯誤懲罰**: 每次錯誤扣除分數

## 7. 部署

### 靜態託管平台
此專案可部署到任何靜態託管服務：

- **Render** (推薦) - 使用提供的 `render.yaml` 設定檔
- **Vercel**
- **Netlify**
- **GitHub Pages**

### 環境變數設定
部署時需要設定以下環境變數：

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 8. 資料庫結構

專案使用Supabase PostgreSQL資料庫，包含以下主要表格：

- `users` - 用戶資料
- `normal_records` - 普通模式遊戲記錄
- `dopamine_records` - 多巴胺模式遊戲記錄
- `normal_score_logs` - 普通模式計分日誌
- `dopamine_score_logs` - 多巴胺模式計分日誌

## 9. 主題系統

支援六種色彩主題：
- 藍色主題 (預設)
- 橙色主題
- 綠色主題
- 紫色主題
- 粉色主題
- 青綠色主題

## 10. 響應式設計

- **桌面版**: 九宮格與控制面板並排顯示
- **行動版**: 垂直堆疊佈局，優化觸控操作
- **平板版**: 自適應佈局，兼顧兩種體驗

## 11. 貢獻指南

歡迎提交Issue和Pull Request！

1. Fork 此專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟Pull Request

## 12. 授權條款

此專案目前未設定特定的授權條款。如需使用或修改此專案，請聯繫作者。

## 作者

**MINTAE feat. Cursor / Grok / Lovable**

📧 **聯絡方式**: [mintae.tw@gmail.com](mailto:mintae.tw@gmail.com)  
🐙 **GitHub**: [@mintaemt](https://github.com/mintaemt)  
💼 **LinkedIn**: [mintae7](https://www.linkedin.com/in/mintae7)

## 致謝

感謝所有開源專案和工具的貢獻者，讓這個專案得以實現。

---

如果這個專案對您有幫助，請給個星星支持！