import React, { useEffect, useState } from 'react';

interface AnimatedGradientBackgroundProps {
  isDopamineMode?: boolean;
}

// 主題顏色定義 (HSL to RGB 轉換)
const themeColors = {
  blue: { h: 210, s: 100, l: 50 },     // hsl(210, 100%, 50%)
  orange: { h: 25, s: 100, l: 50 },    // hsl(25, 100%, 50%)
  green: { h: 142, s: 76, l: 36 },     // hsl(142, 76%, 36%)
  purple: { h: 262, s: 83, l: 58 },    // hsl(262, 83%, 58%)
  pink: { h: 330, s: 81, l: 60 },      // hsl(330, 81%, 60%)
  teal: { h: 173, s: 80, l: 40 }       // hsl(173, 80%, 40%)
};

// HSL to RGB 轉換函數
const hslToRgb = (h: number, s: number, l: number) => {
  h = h / 360;
  s = s / 100;
  l = l / 100;
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;
  
  let r, g, b;
  if (h < 1/6) {
    r = c; g = x; b = 0;
  } else if (h < 2/6) {
    r = x; g = c; b = 0;
  } else if (h < 3/6) {
    r = 0; g = c; b = x;
  } else if (h < 4/6) {
    r = 0; g = x; b = c;
  } else if (h < 5/6) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }
  
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
};

// 獲取主題顏色的RGB值
const getThemeColorRgb = (themeKey: keyof typeof themeColors) => {
  const color = themeColors[themeKey];
  return hslToRgb(color.h, color.s, color.l);
};

export const AnimatedGradientBackground = ({ isDopamineMode = false }: AnimatedGradientBackgroundProps) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => prev + 2); // 持續累積，不重置
    }, 50); // 減少間隔時間，提高更新頻率

    return () => clearInterval(interval);
  }, []);

  // 檢測實際主題（HTML屬性）
  useEffect(() => {
    const checkTheme = () => {
      // 檢測HTML的實際主題屬性，而不是系統偏好
      const htmlElement = document.documentElement;
      const hasDarkClass = htmlElement.classList.contains('dark');
      const hasDarkAttribute = htmlElement.getAttribute('data-theme') === 'dark';
      
      // 如果HTML有dark class或data-theme="dark"，則為dark mode
      const isDark = hasDarkClass || hasDarkAttribute;
      setIsDarkMode(isDark);
      
      // 調試：檢查檢測結果
      console.log('HTML dark class:', hasDarkClass, 'HTML dark attribute:', hasDarkAttribute, 'Setting isDarkMode to:', isDark);
    };
    
    checkTheme();
    
    // 監聽HTML屬性變化
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    });
    
    return () => observer.disconnect();
  }, []);

  if (isDopamineMode) {
    // 多巴胺模式：使用所有6種主題顏色的動態漸層
    const blue = getThemeColorRgb('blue');
    const orange = getThemeColorRgb('orange');
    const green = getThemeColorRgb('green');
    const purple = getThemeColorRgb('purple');
    const pink = getThemeColorRgb('pink');
    const teal = getThemeColorRgb('teal');
    
    return (
      <div 
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(circle farthest-corner at ${15 + Math.sin(animationPhase * 0.018) * 15}% ${15 + Math.cos(animationPhase * 0.018) * 15}%, rgba(${blue.r}, ${blue.g}, ${blue.b}, 0.525) 0%, rgba(${blue.r}, ${blue.g}, ${blue.b}, 0) 50%),
            radial-gradient(circle farthest-corner at ${20 + Math.sin(animationPhase * 0.02) * 20}% ${20 + Math.cos(animationPhase * 0.02) * 20}%, rgba(${orange.r}, ${orange.g}, ${orange.b}, 0.45) 0%, rgba(${orange.r}, ${orange.g}, ${orange.b}, 0) 50%),
            radial-gradient(circle farthest-corner at ${80 + Math.sin(animationPhase * 0.025) * 18}% ${80 + Math.cos(animationPhase * 0.025) * 18}%, rgba(${green.r}, ${green.g}, ${green.b}, 0.375) 0%, rgba(${green.r}, ${green.g}, ${green.b}, 0) 40%),
            radial-gradient(circle farthest-corner at ${20 + Math.sin(animationPhase * 0.035) * 22}% ${80 + Math.cos(animationPhase * 0.035) * 22}%, rgba(${purple.r}, ${purple.g}, ${purple.b}, 0.225) 0%, rgba(${purple.r}, ${purple.g}, ${purple.b}, 0) 35%),
            radial-gradient(ellipse at ${50 + Math.sin(animationPhase * 0.015) * 10}% ${50 + Math.cos(animationPhase * 0.015) * 10}%, rgba(${pink.r}, ${pink.g}, ${pink.b}, 0.15) 0%, rgba(${pink.r}, ${pink.g}, ${pink.b}, 0) 60%),
            linear-gradient(${animationPhase % 360}deg, rgba(${teal.r}, ${teal.g}, ${teal.b}, 0.075) 0%, rgba(${purple.r}, ${purple.g}, ${purple.b}, 0.075) 50%, rgba(${pink.r}, ${pink.g}, ${pink.b}, 0.075) 100%)
          `
        }}
      />
    );
  }

  // 普通模式：根據light/dark mode調整透明度
  const blue = getThemeColorRgb('blue');
  const orange = getThemeColorRgb('orange');
  const green = getThemeColorRgb('green');
  const purple = getThemeColorRgb('purple');
  const pink = getThemeColorRgb('pink');
  const teal = getThemeColorRgb('teal');
  
  // 根據主題模式調整透明度
  const blueOpacity = isDarkMode ? 0.12 : 0.45; // light mode 複製多巴胺模式後降低15%
  const orangeOpacity = isDarkMode ? 0.15 : 0.38;
  const greenOpacity = isDarkMode ? 0.12 : 0.32;
  const purpleOpacity = isDarkMode ? 0.08 : 0.19;
  const pinkOpacity = isDarkMode ? 0.05 : 0.13;
  const linearOpacity = isDarkMode ? 0.01 : 0.06;
  
  return (
    <div 
      className="fixed inset-0 -z-10"
      style={{
        background: `
          radial-gradient(circle farthest-corner at ${15 + Math.sin(animationPhase * 0.018) * 15}% ${15 + Math.cos(animationPhase * 0.018) * 15}%, rgba(${blue.r}, ${blue.g}, ${blue.b}, ${blueOpacity}) 0%, rgba(${blue.r}, ${blue.g}, ${blue.b}, 0) 50%),
          radial-gradient(circle farthest-corner at ${20 + Math.sin(animationPhase * 0.02) * 20}% ${20 + Math.cos(animationPhase * 0.02) * 20}%, rgba(${orange.r}, ${orange.g}, ${orange.b}, ${orangeOpacity}) 0%, rgba(${orange.r}, ${orange.g}, ${orange.b}, 0) 50%),
          radial-gradient(circle farthest-corner at ${80 + Math.sin(animationPhase * 0.025) * 18}% ${80 + Math.cos(animationPhase * 0.025) * 18}%, rgba(${green.r}, ${green.g}, ${green.b}, ${greenOpacity}) 0%, rgba(${green.r}, ${green.g}, ${green.b}, 0) 40%),
          radial-gradient(circle farthest-corner at ${20 + Math.sin(animationPhase * 0.035) * 22}% ${80 + Math.cos(animationPhase * 0.035) * 22}%, rgba(${purple.r}, ${purple.g}, ${purple.b}, ${purpleOpacity}) 0%, rgba(${purple.r}, ${purple.g}, ${purple.b}, 0) 35%),
          radial-gradient(ellipse at ${50 + Math.sin(animationPhase * 0.015) * 10}% ${50 + Math.cos(animationPhase * 0.015) * 10}%, rgba(${pink.r}, ${pink.g}, ${pink.b}, ${pinkOpacity}) 0%, rgba(${pink.r}, ${pink.g}, ${pink.b}, 0) 60%),
          linear-gradient(${animationPhase % 360}deg, rgba(${teal.r}, ${teal.g}, ${teal.b}, ${linearOpacity}) 0%, rgba(${purple.r}, ${purple.g}, ${purple.b}, ${linearOpacity}) 50%, rgba(${pink.r}, ${pink.g}, ${pink.b}, ${linearOpacity}) 100%)
        `
      }}
    />
  );
};