import { useState, useEffect } from 'react';
import { Language } from '@/components/LanguageToggle';

// 語言翻譯對象
const translations = {
  en: {
    // 遊戲相關
    gameTitle: 'Sudoku',
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
    
    // 多巴胺資訊卡
    dopamineInfoTitle: 'Dopamine Mode',
    dopamineInfoSubtitle: 'Challenge Your Limits!',
    dopamineFeatures: 'Mode Features',
    dopamineRules: 'Game Rules',
    basicAchievement: 'Basic Achievement',
    moderateChallenge: 'Moderate Challenge',
    highAchievement: 'High Achievement',
    topChallenge: 'Top Challenge',
    highestAchievement: 'Highest Achievement',
    selectDifficulty: 'Select Difficulty',
    startDopamineChallenge: 'Start Challenge',
    
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
    
    // 主題
    currentTheme: 'Current theme',
    clickToToggle: 'Click to toggle between light and dark',
    
    // 載入狀態
    loadingStats: 'Loading stats...',
    
    // 用戶統計
    bestScore: 'Best Score',
    bestTime: 'Best Time',
    totalGames: 'Total Games',
    
    // 遊戲規則
    gameRules: 'Game Rules',
    scoringSystem: 'Scoring System',
    rules: 'Rules',
    scoring: 'Scoring',
  },
  zh: {
    // 遊戲相關
    gameTitle: '數獨',
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
    
    // 多巴胺資訊卡
    dopamineInfoTitle: '多巴胺模式',
    dopamineInfoSubtitle: '挑戰你的極限！',
    dopamineFeatures: '模式特色',
    dopamineRules: '遊戲規則',
    basicAchievement: '基礎成就感',
    moderateChallenge: '適度挑戰',
    highAchievement: '高成就感',
    topChallenge: '頂級挑戰',
    highestAchievement: '最高成就感',
    selectDifficulty: '選擇難度',
    startDopamineChallenge: '開始挑戰',
    
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
    
    // 主題
    currentTheme: '當前主題',
    clickToToggle: '點擊切換明暗模式',
    
    // 載入狀態
    loadingStats: '載入統計中...',
    
    // 用戶統計
    bestScore: '最佳分數',
    bestTime: '最佳時間',
    totalGames: '總遊戲數',
    
    // 遊戲規則
    gameRules: '遊戲規則',
    scoringSystem: '計分系統',
    rules: '規則',
    scoring: '計分',
  },
  ko: {
    // 遊戲相關
    gameTitle: '수도쿠',
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
    
    // 도파민 정보 카드
    dopamineInfoTitle: '도파민 모드',
    dopamineInfoSubtitle: '한계에 도전하세요!',
    dopamineFeatures: '모드 특징',
    dopamineRules: '게임 규칙',
    basicAchievement: '기본 성취감',
    moderateChallenge: '적당한 도전',
    highAchievement: '높은 성취감',
    topChallenge: '최고 도전',
    highestAchievement: '최고 성취감',
    selectDifficulty: '난이도 선택',
    startDopamineChallenge: '도전 시작',
    
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
    
    // 테마
    currentTheme: '현재 테마',
    clickToToggle: '라이트/다크 모드 전환',
    
    // 로딩 상태
    loadingStats: '통계 로딩 중...',
    
    // 사용자 통계
    bestScore: '최고 점수',
    bestTime: '최고 시간',
    totalGames: '총 게임 수',
    
    // 게임 규칙
    gameRules: '게임 규칙',
    scoringSystem: '점수 시스템',
    rules: '규칙',
    scoring: '점수',
  },
  ja: {
    // ゲーム関連
    gameTitle: '数独',
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
    
    // ドーパミン情報カード
    dopamineInfoTitle: 'ドーパミンモード',
    dopamineInfoSubtitle: '限界に挑戦しよう！',
    dopamineFeatures: 'モード特徴',
    dopamineRules: 'ゲームルール',
    basicAchievement: '基本達成感',
    moderateChallenge: '適度な挑戦',
    highAchievement: '高い達成感',
    topChallenge: '最高挑戦',
    highestAchievement: '最高達成感',
    selectDifficulty: '難易度選択',
    startDopamineChallenge: 'チャレンジ開始',
    
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
    
    // テーマ
    currentTheme: '現在のテーマ',
    clickToToggle: 'ライト/ダークモード切り替え',
    
    // ローディング状態
    loadingStats: '統計読み込み中...',
    
    // ユーザー統計
    bestScore: '最高スコア',
    bestTime: '最高時間',
    totalGames: '総ゲーム数',
    
    // ゲームルール
    gameRules: 'ゲームルール',
    scoringSystem: 'スコアシステム',
    rules: 'ルール',
    scoring: 'スコア',
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
