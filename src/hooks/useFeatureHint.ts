import { useState, useEffect } from 'react';

const FEATURE_HINT_KEY = 'killer-sudoku-feature-hint';
const HINT_COOLDOWN = 24 * 60 * 60 * 1000; // 24小時

export const useFeatureHint = () => {
  const [shouldShowHint, setShouldShowHint] = useState(false);

  useEffect(() => {
    const checkHintStatus = () => {
      try {
        const stored = localStorage.getItem(FEATURE_HINT_KEY);
        if (!stored) {
          // 第一次訪問，顯示提示
          setShouldShowHint(true);
          return;
        }

        const { dismissedAt } = JSON.parse(stored);
        const now = Date.now();
        const timeSinceDismissed = now - dismissedAt;

        // 如果距離上次關閉超過24小時，再次顯示提示
        if (timeSinceDismissed >= HINT_COOLDOWN) {
          setShouldShowHint(true);
        }
      } catch (error) {
        console.error('Error checking feature hint status:', error);
        // 如果出錯，預設顯示提示
        setShouldShowHint(true);
      }
    };

    checkHintStatus();
  }, []);

  const dismissHint = () => {
    try {
      const hintData = {
        dismissedAt: Date.now()
      };
      localStorage.setItem(FEATURE_HINT_KEY, JSON.stringify(hintData));
      setShouldShowHint(false);
    } catch (error) {
      console.error('Error dismissing feature hint:', error);
      setShouldShowHint(false);
    }
  };

  const resetHint = () => {
    try {
      localStorage.removeItem(FEATURE_HINT_KEY);
      setShouldShowHint(true);
    } catch (error) {
      console.error('Error resetting feature hint:', error);
      setShouldShowHint(true);
    }
  };

  return {
    shouldShowHint,
    dismissHint,
    resetHint
  };
};
