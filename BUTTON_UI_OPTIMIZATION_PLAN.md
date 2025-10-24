# 🎨 按鈕 UI 優化計劃

> 基於 DESIGNNAS 按鈕設計準則進行系統性優化

**分支**: refactor/staging-202510  
**開始時間**: 2025-10-24

---

## 📊 當前狀態分析

### 現有按鈕組件規格 (button.tsx)

```typescript
// 當前尺寸配置
size: {
  default: "h-10 px-4 py-2",    // 40px 高度
  sm: "h-9 rounded-md px-3",     // 36px 高度 ❌
  lg: "h-11 rounded-md px-8",    // 44px 高度
  icon: "h-10 w-10",             // 40px 正方形
}
```

### 設計準則要求

```
✅ 最小高度: 40-44px
✅ 文字大小: 14-20px (當前 text-sm = 14px)
❌ Padding 比例: 垂直應該是水平的 2 倍
❌ sm size 只有 36px，低於建議值
```

---

## 🎯 優化目標

### 1. 尺寸調整

**修正前**:
```typescript
sm: "h-9 rounded-md px-3",    // 36px ❌
default: "h-10 px-4 py-2",     // 40px ✅
lg: "h-11 rounded-md px-8",    // 44px ✅
```

**修正後**:
```typescript
sm: "h-10 px-3 py-2",          // 40px ✅ (提升到最小標準)
default: "h-11 px-4 py-2.5",   // 44px ✅ (符合 Apple 建議)
lg: "h-12 px-8 py-3",          // 48px ✅ (符合 Google 建議)
```

### 2. Padding 優化

**設計準則**: 垂直 padding 應該是水平的 2 倍

當前不符合此準則，需要調整為：
```
px-4 py-2   → px-3 py-3   或  px-4 py-4
px-8 py-2   → px-4 py-4   或  px-6 py-6
```

但這會導致按鈕變得非常高，所以採用折衷方案：
- 保持視覺平衡
- 確保最小觸控區域 40-44px
- 調整比例接近 1:1.5 或 1:2

---

## 🔍 影響範圍分析

### 高風險組件（需要仔細測試）

1. **NumberPad** (src/components/NumberPad.tsx)
   - 9 宮格數字按鈕
   - 當前使用自定義樣式
   - 需要確保按鈕大小一致

2. **DifficultySelector** (src/components/DifficultySelector.tsx)
   - 使用 `size="sm"` 的按鈕
   - 緊湊的佈局
   - 可能需要調整間距

3. **Modal 對話框**
   - GameRulesModal
   - DopamineInfoModal
   - GameCompleteModal
   - 等多個 Modal

### 中風險組件

4. **GameHeader** 
   - 頂部導航按鈕
   - 響應式設計

5. **UserNameInput**
   - 表單提交按鈕

### 低風險組件

6. **Leaderboard**
   - 列表相關按鈕

---

## 📋 優化步驟

### Phase 1: 基礎組件優化

- [ ] 1.1 更新 button.tsx 尺寸配置
- [ ] 1.2 調整 padding 比例
- [ ] 1.3 增強 hover/active/disabled 狀態

### Phase 2: 關鍵組件測試

- [ ] 2.1 NumberPad 按鈕尺寸驗證
- [ ] 2.2 DifficultySelector 佈局檢查
- [ ] 2.3 Modal 對話框按鈕測試

### Phase 3: 響應式驗證

- [ ] 3.1 手機版 (< 768px) 測試
- [ ] 3.2 平板版 (768px - 1024px) 測試
- [ ] 3.3 桌面版 (> 1024px) 測試

### Phase 4: 視覺一致性

- [ ] 4.1 確保所有按鈕層級清晰
  - Primary (default variant)
  - Secondary (outline variant)
  - Tertiary (ghost/link variant)
- [ ] 4.2 檢查顏色對比度
- [ ] 4.3 確保 disabled 狀態明顯

---

## ⚠️ 潛在風險與對策

### 風險 1: 按鈕變太大破壞佈局

**對策**:
- 保守地調整尺寸
- sm size 從 36px 提升到 40px（最小幅度）
- default 從 40px 提升到 44px
- 分階段測試

### 風險 2: NumberPad 格子變形

**對策**:
- NumberPad 使用獨立的尺寸控制
- 保持正方形比例
- 測試不同螢幕尺寸

### 風險 3: Modal 按鈕溢出

**對策**:
- 檢查 Modal 寬度
- 調整按鈕間距
- 必要時使用 flex-wrap

### 風險 4: 手機版按鈕過大

**對策**:
- 使用響應式尺寸
- sm:h-10 md:h-11 lg:h-12
- 確保觸控區域足夠

---

## 🧪 測試清單

### 功能測試

- [ ] 所有按鈕可點擊
- [ ] Hover 狀態正確顯示
- [ ] Disabled 狀態正確顯示
- [ ] Active/Clicked 狀態正確

### 視覺測試

- [ ] 按鈕對齊正確
- [ ] 間距統一
- [ ] 文字居中
- [ ] 圖標對齊

### 響應式測試

- [ ] 手機版佈局正常
- [ ] 平板版佈局正常
- [ ] 桌面版佈局正常
- [ ] 觸控區域足夠 (40-44px)

---

## 📝 實施記錄

### 修改記錄

將在實施過程中更新...

---

**生成時間**: 2025-10-24  
**狀態**: 規劃中

