# 📱 AdSense 動態廣告配置指南

## 🎯 **功能說明**

當用戶提示次數用完後，點擊「觀看廣告獲得提示」按鈕會：
1. 觸發 AdSense 動態廣告
2. 顯示廣告內容
3. 廣告結束後自動增加提示次數
4. 關閉模態框

## 🔧 **配置步驟**

### 1. **獲取 AdSense 廣告單元 ID**

1. 登入 [Google AdSense](https://www.google.com/adsense/)
2. 前往「廣告」→「按廣告單元」
3. 創建新的「顯示廣告」
4. 選擇「響應式」格式
5. 複製 `data-ad-slot` 的值

### 2. **更新代碼中的廣告單元 ID**

在 `src/pages/Index.tsx` 第 725 行，將 `xxxxxxxxxx` 替換為您的廣告單元 ID：

```tsx
data-ad-slot="您的廣告單元ID"  // 替換 xxxxxxxxxx
```

### 3. **測試廣告功能**

1. 啟動遊戲
2. 使用完 3 次免費提示
3. 點擊「觀看廣告獲得提示」
4. 確認廣告正常顯示

## 📋 **代碼結構**

### **HintAdModal.tsx**
- `handleWatchAd()` 函數：觸發 AdSense 廣告
- 廣告載入檢查
- 錯誤處理機制
- 自動回調處理

### **Index.tsx**
- AdSense 廣告容器（隱藏狀態）
- 使用您的 AdSense client ID

### **index.html**
- AdSense 腳本載入
- 已配置正確的 client ID

## ⚠️ **注意事項**

1. **廣告單元 ID**：必須替換 `xxxxxxxxxx` 為實際的廣告單元 ID
2. **審核狀態**：確保 AdSense 帳戶已通過審核
3. **廣告政策**：遵守 Google AdSense 政策
4. **測試環境**：在正式環境測試廣告功能

## 🚀 **部署後步驟**

1. 更新 `data-ad-slot` 為實際廣告單元 ID
2. 提交代碼變更
3. 部署到生產環境
4. 測試廣告功能
5. 監控 AdSense 報告

## 📊 **預期效果**

- ✅ 用戶點擊按鈕後立即顯示廣告
- ✅ 廣告結束後自動增加提示次數
- ✅ 良好的用戶體驗
- ✅ 符合 AdSense 政策

---

**需要協助？** 請檢查 AdSense 控制台中的廣告單元設定，並確保已正確配置響應式廣告格式。
