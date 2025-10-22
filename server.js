const express = require('express');
const path = require('path');
const app = express();

// 靜態文件服務
app.use(express.static(path.join(__dirname, 'dist')));

// SPA路由處理 - 所有路由都返回index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
