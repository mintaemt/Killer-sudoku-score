import React, { useEffect, useState } from 'react';

interface AnimatedGradientBackgroundProps {
  isDopamineMode?: boolean;
}

export const AnimatedGradientBackground = ({ isDopamineMode = false }: AnimatedGradientBackgroundProps) => {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 0.5) % 360); // 減慢動畫速度，減少閃爍
    }, 100); // 增加間隔時間

    return () => clearInterval(interval);
  }, []);

  if (isDopamineMode) {
    // 多巴胺模式：稍微柔和的漸層，基於 gradients-bg 的色系
    return (
      <div 
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(circle farthest-corner at ${20 + Math.sin(animationPhase * 0.01) * 20}% ${20 + Math.cos(animationPhase * 0.01) * 20}%, rgba(225, 243, 97, 0.6) 0%, rgba(225, 243, 97, 0) 50%),
            radial-gradient(circle farthest-side at ${80 + Math.sin(animationPhase * 0.015) * 15}% ${20 + Math.cos(animationPhase * 0.015) * 15}%, rgba(181, 176, 177, 0.4) 0%, rgba(181, 176, 177, 0) 30%),
            radial-gradient(circle farthest-corner at ${80 + Math.sin(animationPhase * 0.012) * 18}% ${80 + Math.cos(animationPhase * 0.012) * 18}%, rgba(204, 104, 119, 0.5) 0%, rgba(204, 104, 119, 0) 40%),
            radial-gradient(circle farthest-corner at ${20 + Math.sin(animationPhase * 0.018) * 22}% ${80 + Math.cos(animationPhase * 0.018) * 22}%, rgba(155, 221, 240, 0.3) 0%, rgba(155, 221, 240, 0) 35%),
            radial-gradient(ellipse at ${50 + Math.sin(animationPhase * 0.008) * 10}% ${50 + Math.cos(animationPhase * 0.008) * 10}%, rgba(254, 43, 0, 0.2) 0%, rgba(254, 43, 0, 0) 60%),
            linear-gradient(${animationPhase}deg, rgba(225, 243, 97, 0.1) 0%, rgba(204, 104, 119, 0.1) 50%, rgba(155, 221, 240, 0.1) 100%)
          `
        }}
      />
    );
  }

  // 普通模式：更柔和的漸層，基於 gradients-bg 的色系
  return (
    <div 
      className="fixed inset-0 -z-10"
      style={{
        background: `
          radial-gradient(circle farthest-corner at ${30 + Math.sin(animationPhase * 0.005) * 10}% ${30 + Math.cos(animationPhase * 0.005) * 10}%, rgba(225, 243, 97, 0.2) 0%, rgba(225, 243, 97, 0) 50%),
          radial-gradient(circle farthest-side at ${70 + Math.sin(animationPhase * 0.007) * 12}% ${30 + Math.cos(animationPhase * 0.007) * 12}%, rgba(181, 176, 177, 0.15) 0%, rgba(181, 176, 177, 0) 30%),
          radial-gradient(circle farthest-corner at ${70 + Math.sin(animationPhase * 0.006) * 15}% ${70 + Math.cos(animationPhase * 0.006) * 15}%, rgba(204, 104, 119, 0.18) 0%, rgba(204, 104, 119, 0) 40%),
          radial-gradient(circle farthest-corner at ${30 + Math.sin(animationPhase * 0.008) * 18}% ${70 + Math.cos(animationPhase * 0.008) * 18}%, rgba(155, 221, 240, 0.12) 0%, rgba(155, 221, 240, 0) 35%),
          radial-gradient(ellipse at ${50 + Math.sin(animationPhase * 0.004) * 8}% ${50 + Math.cos(animationPhase * 0.004) * 8}%, rgba(254, 43, 0, 0.08) 0%, rgba(254, 43, 0, 0) 60%),
          linear-gradient(${animationPhase * 0.5}deg, rgba(225, 243, 97, 0.03) 0%, rgba(204, 104, 119, 0.03) 50%, rgba(155, 221, 240, 0.03) 100%)
        `
      }}
    />
  );
};