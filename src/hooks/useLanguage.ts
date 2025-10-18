import { useState, useEffect } from 'react';
import { Language } from '@/components/LanguageToggle';

// 語言翻譯對象
const translations = {
  en: {
    // 遊戲相關
    gameTitle: 'Killer Sudoku',
    newGame: 'New Game',
    gameRules: 'Game Rules',
    difficulty: 'Difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    expert: 'Expert',
    hell: 'Hell',
    
    // 多巴胺模式
    dopamineMode: 'Dopamine Mode',
    startChallenge: 'Start Challenge',
    remaining: 'Remaining',
    score: 'Score',
    combo: 'COMBO',
    
    // 排行榜
    leaderboard: 'Leaderboard',
    viewLeaderboard: 'View Leaderboard',
    viewHighestScore: 'View Highest Score',
    achievementWall: 'Achievement Wall',
    highestScoreDisplay: 'Highest Score Display',
    
    // 用戶相關
    welcome: 'Welcome',
    viewStats: 'View Stats',
    normal: 'Normal',
    dopamine: 'Dopamine',
    
    // 通用
    all: 'All',
    close: 'Close',
    back: 'Back',
    restart: 'Restart',
    returnToMain: 'Return to Main Menu',
    wellDone: 'WELL DONE',
    gameOver: 'GAME OVER',
  },
  zh: {
    // 遊戲相關
    gameTitle: '殺手數獨',
    newGame: '新遊戲',
    gameRules: '遊戲規則',
    difficulty: '難度',
    easy: '簡單',
    medium: '中等',
    hard: '困難',
    expert: '專家',
    hell: '地獄',
    
    // 多巴胺模式
    dopamineMode: '多巴胺模式',
    startChallenge: '開始挑戰',
    remaining: '剩餘',
    score: '分數',
    combo: 'COMBO',
    
    // 排行榜
    leaderboard: '排行榜',
    viewLeaderboard: '查看排行榜',
    viewHighestScore: '查看最高分',
    achievementWall: '成就牆',
    highestScoreDisplay: '最高分展示',
    
    // 用戶相關
    welcome: '歡迎',
    viewStats: '查看統計',
    normal: '普通',
    dopamine: '多巴胺',
    
    // 通用
    all: '全部',
    close: '關閉',
    back: '返回',
    restart: '再次挑戰',
    returnToMain: '返回主選單',
    wellDone: '太棒了',
    gameOver: '遊戲結束',
  },
  ko: {
    // 遊戲相關
    gameTitle: '킬러 스도쿠',
    newGame: '새 게임',
    gameRules: '게임 규칙',
    difficulty: '난이도',
    easy: '쉬움',
    medium: '보통',
    hard: '어려움',
    expert: '전문가',
    hell: '지옥',
    
    // 多巴胺 모드
    dopamineMode: '도파민 모드',
    startChallenge: '도전 시작',
    remaining: '남은',
    score: '점수',
    combo: 'COMBO',
    
    // 리더보드
    leaderboard: '리더보드',
    viewLeaderboard: '리더보드 보기',
    viewHighestScore: '최고 점수 보기',
    achievementWall: '성취 벽',
    highestScoreDisplay: '최고 점수 표시',
    
    // 사용자 관련
    welcome: '환영합니다',
    viewStats: '통계 보기',
    normal: '일반',
    dopamine: '도파민',
    
    // 일반
    all: '전체',
    close: '닫기',
    back: '뒤로',
    restart: '다시 도전',
    returnToMain: '메인 메뉴로',
    wellDone: '잘했어요',
    gameOver: '게임 오버',
  },
  ja: {
    // ゲーム関連
    gameTitle: 'キラー数独',
    newGame: '新しいゲーム',
    gameRules: 'ゲームルール',
    difficulty: '難易度',
    easy: '簡単',
    medium: '普通',
    hard: '難しい',
    expert: 'エキスパート',
    hell: '地獄',
    
    // ドーパミンモード
    dopamineMode: 'ドーパミンモード',
    startChallenge: 'チャレンジ開始',
    remaining: '残り',
    score: 'スコア',
    combo: 'COMBO',
    
    // リーダーボード
    leaderboard: 'リーダーボード',
    viewLeaderboard: 'リーダーボードを見る',
    viewHighestScore: '最高スコアを見る',
    achievementWall: '実績ウォール',
    highestScoreDisplay: '最高スコア表示',
    
    // ユーザー関連
    welcome: 'ようこそ',
    viewStats: '統計を見る',
    normal: '通常',
    dopamine: 'ドーパミン',
    
    // 一般
    all: 'すべて',
    close: '閉じる',
    back: '戻る',
    restart: '再挑戦',
    returnToMain: 'メインメニューに戻る',
    wellDone: 'よくできました',
    gameOver: 'ゲームオーバー',
  },
};

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // 監聽語言變更事件
    const handleLanguageChange = (event: CustomEvent) => {
      setLanguage(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    
    // 初始化語言
    const savedLanguage = localStorage.getItem('killer-sudoku-language') as Language;
    if (savedLanguage && ['en', 'zh', 'ko', 'ja'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }

    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || translations.en[key] || key;
  };

  return { language, t };
};
