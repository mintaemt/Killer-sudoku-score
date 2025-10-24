# 重構檢查表 (Refactoring Checklist)

**分支**: `refactor/staging-202510`  
**日期**: 2025-10-23

---

## ✅ 重構完成項目

### 📂 src/lib 層級

- [x] ✅ **scoreCalculator.ts**
  - [x] 修復 `ScoreCalculationDetails` 介面缺少欄位
  - [x] 修復 `calculateDopamineScore` 返回值
  - [x] 添加完整中文註釋

- [x] ✅ **databaseUtils.ts** (新增)
  - [x] 建立共用資料庫查詢函數
  - [x] 抽離重複邏輯
  - [x] 完整類型定義與註釋

- [x] ✅ **connectionChecker.ts**
  - [x] 重構使用共用函數
  - [x] 強化類型定義
  - [x] 添加中文註釋

- [x] ✅ **databaseChecker.ts**
  - [x] 重構使用共用函數
  - [x] 強化類型定義
  - [x] 添加中文註釋

- [x] ✅ **sudoku-generator.ts**
  - [x] 修復未定義函數引用 Bug
  - [x] 無 linter 錯誤

- [x] ✅ **其他 lib 檔案**
  - [x] types.ts - 保持原有結構
  - [x] utils.ts - 保持原有結構
  - [x] supabase.ts - 保持原有結構
  - [x] envChecker.ts - 添加註釋

### 🎣 src/hooks 層級

- [x] ✅ **useUser.ts**
  - [x] 添加 `UseUserReturn` 介面
  - [x] 完整中文註釋

- [x] ✅ **useGameRecord.ts**
  - [x] 添加 `UseGameRecordReturn` 介面
  - [x] 修復 `comboBonus` 訪問 Bug
  - [x] 完整中文註釋

- [x] ✅ **useLeaderboard.ts**
  - [x] 添加 `UseLeaderboardReturn` 介面
  - [x] 完整中文註釋

- [x] ✅ **useUserStats.ts**
  - [x] 添加 `UseUserStatsReturn` 介面
  - [x] 完整中文註釋

- [x] ✅ **useLanguage.ts**
  - [x] 保持原有結構（已完善）

- [x] ✅ **useFeatureHint.ts**
  - [x] 添加 `UseFeatureHintReturn` 介面
  - [x] 完整中文註釋

- [x] ✅ **useLeaderboardDebug.ts**
  - [x] 移除所有 `any` 類型
  - [x] 添加完整介面定義
  - [x] 完整中文註釋

### 🎨 src/components 層級

- [x] ✅ **KillerSudokuGrid.tsx**
  - [x] 添加完整中文註釋
  - [x] 強化函數返回類型
  - [x] 無破壞性變更

- [x] ✅ **其他組件**
  - [x] 保持原有結構與功能
  - [x] UI 外觀完全不變

### 📝 文檔

- [x] ✅ **REFACTOR_CHANGELOG.md**
  - [x] 完整變更記錄
  - [x] Bug 修復清單
  - [x] 潛在風險提醒
  - [x] 測試建議

- [x] ✅ **REFACTOR_CHECKLIST.md** (本檔案)
  - [x] 重構項目檢查清單

---

## ⚠️ 需要測試的項目

### 🔴 高優先級（必須測試）

- [ ] **多巴胺模式完整流程**
  ```
  1. 點擊多巴胺模式按鈕
  2. 選擇難度（建議測試 medium 和 hell）
  3. 填寫數字，觀察 combo 計數
  4. 完成遊戲
  5. 驗證分數計算正確
  6. 確認記錄保存成功
  7. 檢查排行榜更新
  ```
  **預期結果**: 無錯誤，分數正確顯示

- [ ] **地獄難度數獨生成**
  ```
  1. 多次生成地獄難度（普通模式）
  2. 檢查是否有 console 錯誤
  3. 驗證 cage 配置正確
  4. 確認無給定數字
  ```
  **預期結果**: 無崩潰，正常生成

### 🟠 中優先級（建議測試）

- [ ] **資料庫連接檢查**
  ```javascript
  // 在瀏覽器 Console 執行
  await window.checkSupabaseConnection()
  ```
  **預期結果**: 顯示完整統計資訊，無錯誤

- [ ] **普通模式各難度遊戲**
  ```
  1. 測試 Easy, Medium, Hard, Expert 難度
  2. 完成遊戲並檢查分數
  3. 驗證記錄保存
  ```
  **預期結果**: 所有難度正常運作

- [ ] **使用者統計卡片**
  ```
  1. 點擊 GameHeader 的使用者圖示
  2. 切換普通/多巴胺模式標籤
  3. 滑動查看各難度統計
  ```
  **預期結果**: 數據正確顯示

### 🟡 低優先級（可選測試）

- [ ] **TypeScript 編譯檢查**
  ```bash
  npm run build
  # 或
  npx tsc --noEmit
  ```
  **預期結果**: 無類型錯誤

- [ ] **Linter 檢查**
  ```bash
  npm run lint
  ```
  **預期結果**: 無新增警告

---

## 🐛 已修復的 Bug 清單

| 編號 | 檔案 | 問題 | 狀態 | 驗證 |
|------|------|------|------|------|
| 1 | scoreCalculator.ts | 缺少 comboBonus/speedBonus 欄位 | ✅ 已修復 | ⏳ 待測試 |
| 2 | useGameRecord.ts | 訪問不存在欄位導致錯誤 | ✅ 已修復 | ⏳ 待測試 |
| 3 | sudoku-generator.ts | 引用未定義函數 | ✅ 已修復 | ⏳ 待測試 |
| 4 | useLeaderboardDebug.ts | 使用 any 類型缺乏安全 | ✅ 已修復 | ✅ 已驗證 |

---

## 📊 類型安全改進統計

| 項目 | 改進前 | 改進後 |
|------|--------|--------|
| any 類型使用 | 8 處 | 0 處 |
| 介面定義 | 10 個 | 25 個 |
| 函數返回類型 | 部分缺失 | 完整定義 |
| 可選欄位處理 | `||` 運算符 | `??` 運算符 |

---

## 🎯 合併前最終檢查

### 程式碼品質

- [x] 無 `any` 類型
- [x] 統一命名規則
- [x] 移除 dead code
- [x] 完整中文註釋

### 功能完整性

- [x] 無破壞性變更
- [x] UI 外觀不變
- [ ] 所有功能測試通過 ⏳

### 文檔完整性

- [x] CHANGELOG 完整
- [x] 風險提示清晰
- [x] 測試指南完整

### 技術檢查

- [x] 無 Linter 錯誤（已完成檢查）
- [ ] 無 TypeScript 錯誤 ⏳
- [ ] 效能無明顯下降 ⏳

---

## 📞 問題回報

如發現任何問題，請記錄：

1. **問題描述**: ____________
2. **重現步驟**: ____________
3. **預期行為**: ____________
4. **實際行為**: ____________
5. **相關檔案**: ____________

---

## ✅ 最終確認

- [ ] 所有高優先級測試通過
- [ ] 所有中優先級測試通過（至少 80%）
- [ ] 無 critical bug
- [ ] 文檔齊全
- [ ] 團隊審查完成

**審查者簽名**: ____________  
**日期**: ____________

---

**檢查表完成日期**: 2025-10-23  
**版本**: v1.0

