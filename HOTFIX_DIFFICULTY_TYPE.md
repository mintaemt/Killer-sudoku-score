# 🔥 緊急修正：難度類型定義錯誤

**修正日期**: 2025-10-23  
**嚴重程度**: 🔴 Critical  
**來源**: 用戶回饋

---

## 問題描述

在重構過程中發現一個重要的邏輯錯誤：

❌ **錯誤狀況**:
```typescript
// 錯誤：普通模式包含地獄難度
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'hell';
```

✅ **正確狀況**:
- 普通模式（Normal Mode）應該只有 4 個難度：Easy, Medium, Hard, Expert
- 地獄難度（Hell）應該只存在於多巴胺模式（Dopamine Mode）

---

## 修正內容

### 1. `src/lib/types.ts`

**修改前**:
```typescript
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'hell';
export type DopamineDifficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'hell';
```

**修改後**:
```typescript
/**
 * 普通模式難度類型
 * 注意：普通模式不包含地獄難度（hell）
 */
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

/**
 * 多巴胺模式難度類型
 * 包含地獄難度（hell），提供更高難度挑戰
 */
export type DopamineDifficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'hell';
```

### 2. `src/lib/scoreCalculator.ts`

**修改**: 普通模式計分函數移除地獄難度配置

**修改前**:
```typescript
const baseScore = {
  easy: 100,
  medium: 200,
  hard: 300,
  expert: 500,
  hell: 1000  // ❌ 不應該在普通模式中
};

const idealTimes = {
  easy: 360,
  medium: 720,
  hard: 1080,
  expert: 1440,
  hell: 1200  // ❌ 不應該在普通模式中
};
```

**修改後**:
```typescript
// 基礎分數設定（普通模式，不包含地獄難度）
const baseScore: Record<Difficulty, number> = {
  easy: 100,
  medium: 200,
  hard: 300,
  expert: 500
};

// 理想完成時間（普通模式，不包含地獄難度）
const idealTimes: Record<Difficulty, number> = {
  easy: 360,    // 6分鐘
  medium: 720,  // 12分鐘
  hard: 1080,   // 18分鐘
  expert: 1440  // 24分鐘
};
```

---

## 影響分析

### ✅ 正面影響

1. **邏輯正確性** 🎯
   - 確保普通模式不會生成或顯示地獄難度
   - 保持遊戲設計的原始意圖

2. **類型安全** 🛡️
   - TypeScript 編譯更加嚴格
   - 在編譯時期就能發現錯誤使用

3. **程式碼清晰度** 📚
   - 明確區分兩種模式的難度範圍
   - 添加清楚的註釋說明

### ⚠️ 需要注意

1. **GameRecord 類型**
   - 仍然需要支援所有難度（因為多巴胺模式的記錄可能包含 hell）
   - 使用聯合類型: `difficulty: Difficulty | DopamineDifficulty`

2. **UI 組件**
   - `DifficultySelector` 組件已經正確地只顯示 4 個難度
   - 無需修改（驗證過的正確實作）

---

## 驗證清單

- [x] ✅ `Difficulty` 類型只包含 4 個難度
- [x] ✅ `DopamineDifficulty` 類型包含 5 個難度（含 hell）
- [x] ✅ 普通模式計分函數移除地獄難度配置
- [x] ✅ GameRecord 支援所有難度（聯合類型）
- [x] ✅ 無 TypeScript 編譯錯誤
- [x] ✅ 無 Linter 錯誤
- [x] ✅ 文檔已更新 (REFACTOR_CHANGELOG.md, REFACTOR_SUMMARY.md)

---

## 測試建議

### 1. 編譯時檢查 ✅

```bash
# 確認無 TypeScript 錯誤
npm run build
# 或
npx tsc --noEmit
```

**預期結果**: 編譯成功，無類型錯誤

### 2. 執行時檢查

#### 普通模式測試
```
1. 開啟難度選擇器
2. 驗證只顯示 4 個難度選項（Easy, Medium, Hard, Expert）
3. 確認沒有 Hell 選項
```

**預期結果**: ✅ 只顯示 4 個難度

#### 多巴胺模式測試
```
1. 點擊多巴胺模式按鈕
2. 驗證顯示 5 個難度選項（包含 Hell）
3. 測試選擇 Hell 難度並開始遊戲
```

**預期結果**: ✅ Hell 難度正常運作

---

## Git 變更摘要

```bash
# 修改的檔案
modified:   src/lib/types.ts
modified:   src/lib/scoreCalculator.ts
modified:   REFACTOR_CHANGELOG.md
modified:   REFACTOR_SUMMARY.md

# 新增的檔案
new file:   HOTFIX_DIFFICULTY_TYPE.md
```

---

## 後續行動

### 立即執行

1. **驗證編譯** ✅
   ```bash
   npm run build
   ```

2. **測試 UI** ⏳
   - 普通模式難度選擇
   - 多巴胺模式難度選擇

3. **提交變更** ⏳
   ```bash
   git add .
   git commit -m "hotfix: 修正普通模式錯誤包含地獄難度

- 將 Difficulty 類型從 5 個難度改為 4 個
- 地獄難度(hell)只保留在 DopamineDifficulty
- 普通模式計分函數移除地獄難度配置
- 確保遊戲邏輯的正確性

Issue: 用戶回饋發現普通模式不應有地獄難度"
   ```

---

## 感謝

感謝 @soomin 的細心回饋，發現並指出這個重要的邏輯錯誤！

這次修正確保了：
- ✅ 遊戲邏輯的正確性
- ✅ 類型系統的嚴格性
- ✅ 程式碼的可維護性

---

**修正完成日期**: 2025-10-23  
**審查狀態**: ⏳ 待驗證  
**版本**: v1.0

