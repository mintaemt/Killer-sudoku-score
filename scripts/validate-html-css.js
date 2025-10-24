#!/usr/bin/env node

/**
 * HTML 和 CSS 語法驗證腳本
 * 用於在 CI/CD 和本地開發時檢查靜態資源的語法正確性
 */

const fs = require('fs');
const path = require('path');

// 簡單的 CSS 語法檢查
function validateCSS(filePath, cssContent) {
  const errors = [];
  let lineNum = 0;
  
  // 檢查大括號配對
  let braceStack = [];
  let inComment = false;
  let inString = false;
  
  const lines = cssContent.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    lineNum = i + 1;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const prevChar = j > 0 ? line[j-1] : '';
      
      // 處理註解
      if (char === '*' && prevChar === '/') {
        inComment = true;
      }
      if (char === '/' && prevChar === '*') {
        inComment = false;
      }
      
      if (inComment) continue;
      
      // 處理字串
      if (char === '"' || char === "'") {
        inString = !inString;
      }
      
      if (inString) continue;
      
      // 檢查大括號
      if (char === '{') {
        braceStack.push({ line: lineNum, col: j + 1 });
      }
      if (char === '}') {
        if (braceStack.length === 0) {
          errors.push(`第 ${lineNum} 行: 多餘的閉合大括號 '}'`);
        } else {
          braceStack.pop();
        }
      }
    }
  }
  
  // 檢查未關閉的大括號
  if (braceStack.length > 0) {
    braceStack.forEach(brace => {
      errors.push(`第 ${brace.line} 行: 未關閉的大括號 '{'`);
    });
  }
  
  // 檢查常見的 CSS 錯誤
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // 檢查包含中文字符的 CSS 屬性值（通常是打字錯誤）
    if (line.includes(':') && !line.trim().startsWith('//')) {
      const match = line.match(/:\s*([^;{]+)/);
      if (match) {
        const value = match[1];
        // 檢查是否包含中文字符（但不是在註解或字串中）
        if (/[\u4e00-\u9fa5\u3105-\u312f]/.test(value) && !value.includes('/*') && !value.includes('*/')) {
          errors.push(`第 ${lineNum} 行: CSS 屬性值包含中文字符，可能是打字錯誤: "${value.trim()}"`);
        }
      }
    }
  });
  
  return errors;
}

// 檢查 HTML 中的 <style> 標籤
function validateHTMLStyles(filePath) {
  console.log(`\n檢查文件: ${filePath}`);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const errors = [];
  
  // 提取所有 <style> 標籤內容
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;
  
  while ((match = styleRegex.exec(content)) !== null) {
    const cssContent = match[1];
    const cssErrors = validateCSS(filePath, cssContent);
    errors.push(...cssErrors);
  }
  
  if (errors.length === 0) {
    console.log('✅ CSS 語法檢查通過');
    return true;
  } else {
    console.log('❌ 發現 CSS 語法錯誤：');
    errors.forEach(error => console.log(`  - ${error}`));
    return false;
  }
}

// 主函數
function main() {
  console.log('🔍 開始驗證 HTML 和 CSS...\n');
  
  const filesToCheck = [
    'public/legal.html',
    'index.html'
  ];
  
  let allPassed = true;
  
  filesToCheck.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const passed = validateHTMLStyles(fullPath);
      if (!passed) allPassed = false;
    } else {
      console.log(`⚠️  文件不存在: ${file}`);
    }
  });
  
  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('✅ 所有檢查通過！');
    process.exit(0);
  } else {
    console.log('❌ 發現錯誤，請修復後再提交');
    process.exit(1);
  }
}

main();

