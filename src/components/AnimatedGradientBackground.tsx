import React, { useEffect, useState } from 'react';

interface AnimatedGradientBackgroundProps {
  isDopamineMode?: boolean;
}

// 主題顏色定義 (HSL to RGB 轉換)
const themeColors = {
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

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => prev + 2); // 持續累積，不重置
    }, 50); // 減少間隔時間，提高更新頻率

    return () => clearInterval(interval);
  }, []);

  if (isDopamineMode) {
    // 多巴胺模式：使用主題顏色的動態漸層
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
            radial-gradient(circle farthest-corner at ${20 + Math.sin(animationPhase * 0.02) * 20}% ${20 + Math.cos(animationPhase * 0.02) * 20}%, rgba(${orange.r}, ${orange.g}, ${orange.b}, 0.6) 0%, rgba(${orange.r}, ${orange.g}, ${orange.b}, 0) 50%),
            radial-gradient(circle farthest-corner at ${80 + Math.sin(animationPhase * 0.025) * 18}% ${80 + Math.cos(animationPhase * 0.025) * 18}%, rgba(${green.r}, ${green.g}, ${green.b}, 0.5) 0%, rgba(${green.r}, ${green.g}, ${green.b}, 0) 40%),
            radial-gradient(circle farthest-corner at ${20 + Math.sin(animationPhase * 0.035) * 22}% ${80 + Math.cos(animationPhase * 0.035) * 22}%, rgba(${purple.r}, ${purple.g}, ${purple.b}, 0.3) 0%, rgba(${purple.r}, ${purple.g}, ${purple.b}, 0) 35%),
            radial-gradient(ellipse at ${50 + Math.sin(animationPhase * 0.015) * 10}% ${50 + Math.cos(animationPhase * 0.015) * 10}%, rgba(${pink.r}, ${pink.g}, ${pink.b}, 0.2) 0%, rgba(${pink.r}, ${pink.g}, ${pink.b}, 0) 60%),
            linear-gradient(${animationPhase % 360}deg, rgba(${teal.r}, ${teal.g}, ${teal.b}, 0.1) 0%, rgba(${purple.r}, ${purple.g}, ${purple.b}, 0.1) 50%, rgba(${pink.r}, ${pink.g}, ${pink.b}, 0.1) 100%)
          `
        }}
      />
    );
  }

  // 普通模式：使用主題顏色的柔和漸層
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
          radial-gradient(circle farthest-corner at ${30 + Math.sin(animationPhase * 0.01) * 10}% ${30 + Math.cos(animationPhase * 0.01) * 10}%, rgba(${orange.r}, ${orange.g}, ${orange.b}, 0.15) 0%, rgba(${orange.r}, ${orange.g}, ${orange.b}, 0) 50%),
          radial-gradient(circle farthest-corner at ${70 + Math.sin(animationPhase * 0.012) * 15}% ${70 + Math.cos(animationPhase * 0.012) * 15}%, rgba(${green.r}, ${green.g}, ${green.b}, 0.13) 0%, rgba(${green.r}, ${green.g}, ${green.b}, 0) 40%),
          radial-gradient(circle farthest-corner at ${30 + Math.sin(animationPhase * 0.016) * 18}% ${70 + Math.cos(animationPhase * 0.016) * 18}%, rgba(${purple.r}, ${purple.g}, ${purple.b}, 0.07) 0%, rgba(${purple.r}, ${purple.g}, ${purple.b}, 0) 35%),
          radial-gradient(ellipse at ${50 + Math.sin(animationPhase * 0.008) * 8}% ${50 + Math.cos(animationPhase * 0.008) * 8}%, rgba(${pink.r}, ${pink.g}, ${pink.b}, 0.03) 0%, rgba(${pink.r}, ${pink.g}, ${pink.b}, 0) 60%),
          linear-gradient(${animationPhase % 360}deg, rgba(${teal.r}, ${teal.g}, ${teal.b}, 0.01) 0%, rgba(${purple.r}, ${purple.g}, ${purple.b}, 0.01) 50%, rgba(${pink.r}, ${pink.g}, ${pink.b}, 0.01) 100%)
        `
      }}
    />
  );
};