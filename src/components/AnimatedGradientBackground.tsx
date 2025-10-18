import React, { useEffect, useState } from 'react';

interface AnimatedGradientBackgroundProps {
  isDopamineMode?: boolean;
}

export const AnimatedGradientBackground = ({ isDopamineMode = false }: AnimatedGradientBackgroundProps) => {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 360);
    }, 50); // 每50ms更新一次，創造流暢動畫

    return () => clearInterval(interval);
  }, []);

  if (isDopamineMode) {
    // 多巴胺模式：更鮮豔、更動態的漸層
    return (
      <div 
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(circle farthest-corner at ${20 + Math.sin(animationPhase * 0.01) * 20}% ${20 + Math.cos(animationPhase * 0.01) * 20}%, rgba(255, 0, 150, 0.8) 0%, rgba(255, 0, 150, 0) 50%),
            radial-gradient(circle farthest-side at ${80 + Math.sin(animationPhase * 0.015) * 15}% ${20 + Math.cos(animationPhase * 0.015) * 15}%, rgba(0, 255, 255, 0.6) 0%, rgba(0, 255, 255, 0) 30%),
            radial-gradient(circle farthest-corner at ${80 + Math.sin(animationPhase * 0.012) * 18}% ${80 + Math.cos(animationPhase * 0.012) * 18}%, rgba(255, 255, 0, 0.7) 0%, rgba(255, 255, 0, 0) 40%),
            radial-gradient(circle farthest-corner at ${20 + Math.sin(animationPhase * 0.018) * 22}% ${80 + Math.cos(animationPhase * 0.018) * 22}%, rgba(255, 0, 255, 0.5) 0%, rgba(255, 0, 255, 0) 35%),
            radial-gradient(ellipse at ${50 + Math.sin(animationPhase * 0.008) * 10}% ${50 + Math.cos(animationPhase * 0.008) * 10}%, rgba(0, 150, 255, 0.3) 0%, rgba(0, 150, 255, 0) 60%),
            linear-gradient(${animationPhase}deg, rgba(255, 0, 150, 0.1) 0%, rgba(0, 255, 255, 0.1) 50%, rgba(255, 255, 0, 0.1) 100%)
          `
        }}
      />
    );
  }

  // 普通模式：更柔和、更穩定的漸層
  return (
    <div 
      className="fixed inset-0 -z-10"
      style={{
        background: `
          radial-gradient(circle farthest-corner at ${30 + Math.sin(animationPhase * 0.005) * 10}% ${30 + Math.cos(animationPhase * 0.005) * 10}%, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0) 50%),
          radial-gradient(circle farthest-side at ${70 + Math.sin(animationPhase * 0.007) * 12}% ${30 + Math.cos(animationPhase * 0.007) * 12}%, rgba(147, 51, 234, 0.2) 0%, rgba(147, 51, 234, 0) 30%),
          radial-gradient(circle farthest-corner at ${70 + Math.sin(animationPhase * 0.006) * 15}% ${70 + Math.cos(animationPhase * 0.006) * 15}%, rgba(236, 72, 153, 0.25) 0%, rgba(236, 72, 153, 0) 40%),
          radial-gradient(circle farthest-corner at ${30 + Math.sin(animationPhase * 0.008) * 18}% ${70 + Math.cos(animationPhase * 0.008) * 18}%, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0) 35%),
          radial-gradient(ellipse at ${50 + Math.sin(animationPhase * 0.004) * 8}% ${50 + Math.cos(animationPhase * 0.004) * 8}%, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0) 60%),
          linear-gradient(${animationPhase * 0.5}deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 50%, rgba(236, 72, 153, 0.05) 100%)
        `
      }}
    />
  );
};
