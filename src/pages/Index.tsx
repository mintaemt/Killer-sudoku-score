import { useState, useEffect } from "react";
import { KillerSudokuGrid } from "@/components/KillerSudokuGrid";
import { NumberPad } from "@/components/NumberPad";
import { GameHeader } from "@/components/GameHeader";
import { DifficultySelector } from "@/components/DifficultySelector";
import { DopamineProgressBar } from "@/components/DopamineProgressBar";
import { DopamineGameOverModal } from "@/components/DopamineGameOverModal";
import { DopamineWinModal } from "@/components/DopamineWinModal";
import { AnimatedGradientBackground } from "@/components/AnimatedGradientBackground";
import { UserNameInput } from "@/components/UserNameInput";
import { GameCompleteModal } from "@/components/GameCompleteModal";
import { GameRulesModal } from "@/components/GameRulesModal";
import { Leaderboard } from "@/components/Leaderboard";
import { LeaderboardDebug } from "@/components/LeaderboardDebug";
import { FeatureHintModal } from "@/components/FeatureHintModal";
import { HintAdModal } from "@/components/HintAdModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { checkEnvironment, testSupabaseConnection } from "@/lib/envChecker";
import { generateKillerSudoku, generateDopamineSudoku } from "@/lib/sudoku-generator";
import { useUser } from "@/hooks/useUser";
import { useGameRecord } from "@/hooks/useGameRecord";
import { useFeatureHint } from "@/hooks/useFeatureHint";
import { Difficulty, DopamineDifficulty, GameCompletionResult } from "@/lib/types";
import { calculateScore, calculateDopamineScore } from "@/lib/scoreCalculator";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [mistakes, setMistakes] = useState(0);
  const [gameData, setGameData] = useState(generateKillerSudoku(difficulty));
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("blue");
  
  // 多巴胺模式狀態
  const [isDopamineMode, setIsDopamineMode] = useState(false);
  const [dopamineDifficulty, setDopamineDifficulty] = useState<DopamineDifficulty>('medium');
  const [timeLimit, setTimeLimit] = useState(300); // 動態時間限制
  const [comboCount, setComboCount] = useState(0);
  const [lastCorrectTime, setLastCorrectTime] = useState(0);
  const [remainingCells, setRemainingCells] = useState(81);
  const [showDopamineGameOver, setShowDopamineGameOver] = useState(false);
  const [dopamineGameOverData, setDopamineGameOverData] = useState<any>(null);
  const [showDopamineWin, setShowDopamineWin] = useState(false);
  const [dopamineWinData, setDopamineWinData] = useState<any>(null);
  
  // 新增狀態
  const [showUserNameInput, setShowUserNameInput] = useState(false);
  const [showGameCompleteModal, setShowGameCompleteModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [currentLeaderboardMode, setCurrentLeaderboardMode] = useState<'normal' | 'dopamine'>('normal');
  const [showRules, setShowRules] = useState(false);
  const [gameCompletionResult, setGameCompletionResult] = useState<GameCompletionResult | null>(null);
  
  // 普通模式錯誤處理狀態
  const [isDisqualified, setIsDisqualified] = useState(false);
  
  // 註解功能狀態
  const [showNotes, setShowNotes] = useState(false);
  
  // 提示功能狀態
  const [hintCount, setHintCount] = useState(3);
  const [showHintAdModal, setShowHintAdModal] = useState(false);
  
  // 功能提示狀態
  const [showFeatureHint, setShowFeatureHint] = useState(false);
  
  // Hooks
const { user, loading: userLoading, createOrUpdateUser, enterVisitorMode, isVisitorMode, isLoggedIn } = useUser();
  const { shouldShowHint, dismissHint } = useFeatureHint();
  const { saveNormalGameRecord, saveDopamineGameRecord, getNormalUserBestScore, getDopamineUserBestScore, getAllDopamineUsersTopScore } = useGameRecord();

  // 檢查用戶是否已登入
  useEffect(() => {
    if (!userLoading && !isLoggedIn) {
      setShowUserNameInput(true);
    } else if (!userLoading && isLoggedIn) {
      setShowUserNameInput(false);
    }
  }, [userLoading, isLoggedIn, user, isVisitorMode]);

  // 遊戲完成檢查
  useEffect(() => {
    if (isGameComplete()) {
      handleGameComplete();
    }
  }, [gameData, user, isVisitorMode, isDopamineMode]);

  // 檢查遊戲是否完成
  const isGameComplete = (): boolean => {
    const completed = gameData.grid.every(row => 
      row.every(cell => cell.value === cell.solution)
    );
    if (completed) {
      console.log('🎉 遊戲完成檢查通過！');
    }
    return completed;
  };

  // 處理遊戲完成
  const handleGameComplete = async () => {
    console.log('🚀 handleGameComplete 被調用');
    console.log('👤 用戶狀態:', { user: !!user, isVisitorMode, isDopamineMode });
    
    if (!user && !isVisitorMode) {
      console.log('❌ 用戶未登入且非訪客模式，退出');
      return;
    }

    console.log('✅ 通過用戶檢查，繼續處理');
    setIsPaused(true);
    
    let score: number;
    
    if (isDopamineMode) {
      // 多巴胺模式計分
      const dopamineScore = calculateDopamineScore({
        difficulty: dopamineDifficulty,
        timeLeft: time,
        remainingCells,
        comboCount,
        mistakes,
        completionTime: timeLimit - time
      });
      score = dopamineScore.finalScore;
      
      // 多巴胺模式完成時顯示 Win 畫面
      handleDopamineWin();
      return;
    } else {
      // 普通模式計分
      score = calculateScore({ difficulty, completionTime: time, mistakes });
    }
    
    // 訪客模式下不保存記錄，只顯示完成模態框
    if (isVisitorMode) {
      console.log('👤 訪客模式，顯示完成模態框');
      setGameCompletionResult({ 
        score, 
        rank: null, 
        isNewRecord: false 
      });
      setShowGameCompleteModal(true);
      
      // 檢查是否應該顯示功能提示
      if (shouldShowHint) {
        setShowFeatureHint(true);
      }
      return;
    }
    
    // 普通模式：如果失格則不保存記錄
    if (!isDopamineMode && isDisqualified) {
      console.log('❌ 普通模式失格，顯示完成模態框但不保存記錄');
      setGameCompletionResult({ 
        score, 
        rank: null, 
        isNewRecord: false 
      });
      setShowGameCompleteModal(true);
      return;
    }
    
    try {
      console.log('💾 開始保存普通模式記錄');
      const result = await saveNormalGameRecord(user!.id, difficulty, time, mistakes);
      if (result) {
        console.log('✅ 記錄保存成功，顯示完成模態框');
        setGameCompletionResult(result);
        setShowGameCompleteModal(true);
      } else {
        console.log('❌ 記錄保存失敗，但仍顯示完成模態框');
        // 即使保存失敗，也顯示獲勝資訊卡
        setGameCompletionResult({ 
          score, 
          rank: null, 
          isNewRecord: false 
        });
        setShowGameCompleteModal(true);
      }
    } catch (error) {
      console.error('❌ 處理遊戲完成時發生錯誤:', error);
      // 即使發生錯誤，也顯示獲勝資訊卡
      console.log('🔄 發生錯誤但仍顯示完成模態框');
      setGameCompletionResult({ 
        score, 
        rank: null, 
        isNewRecord: false 
      });
      setShowGameCompleteModal(true);
    }
  };

  // 處理用戶名稱提交
  const handleUserNameSubmit = async (name: string) => {
    const userData = await createOrUpdateUser(name);
    if (userData) {
      setShowUserNameInput(false);
      // 用戶狀態會自動更新，不需要重新載入頁面
    }
  };

  // 處理訪客模式
  const handleVisitorMode = () => {
    enterVisitorMode();
    setShowUserNameInput(false);
  };

  // 處理功能提示相關
  const handleFeatureHintClose = () => {
    setShowFeatureHint(false);
    dismissHint(); // 記錄用戶選擇繼續訪客模式
  };

  const handleBecomeUser = () => {
    setShowFeatureHint(false);
    setShowUserNameInput(true); // 跳轉到用戶註冊頁面
  };

  useEffect(() => {
    try {
      setTimeout(() => {
        const newGameData = generateKillerSudoku(difficulty);
        setGameData(newGameData);
        setMistakes(0);
        setSelectedCell(null);
        
        // 重置多巴胺模式狀態
        setIsDopamineMode(false);
        setTime(0); // 正數計時
        setIsDisqualified(false);
        
        setIsPaused(false);
      }, 0);
    } catch (error) {
      console.error('Error generating game on difficulty change:', error);
    }
  }, [difficulty]);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      if (isDopamineMode) {
        // 多巴胺模式：倒數計時
        setTime((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            // 時間到，遊戲結束
            handleDopamineGameOver();
            return 0;
          }
          return newTime;
        });
      } else {
        // 普通模式：正數計時
        setTime((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isDopamineMode]);

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;
    
    // 註解模式：添加或移除候選數字
    if (showNotes) {
      const newGrid = gameData.grid.map((r, i) =>
        r.map((cell, j) => {
          if (i === row && j === col) {
            const currentCandidates = cell.candidates || [];
            const newCandidates = currentCandidates.includes(num)
              ? currentCandidates.filter(c => c !== num) // 移除數字
              : [...currentCandidates, num]; // 添加數字
            return { ...cell, candidates: newCandidates };
          }
          return cell;
        })
      );
      setGameData({ ...gameData, grid: newGrid });
      return;
    }

    // 正常模式：輸入數字
    if (gameData.grid[row][col].given) return;

    const newGrid = gameData.grid.map((r, i) =>
      r.map((cell, j) => {
        if (i === row && j === col) {
          const isCorrect = cell.solution === num;
          if (!isCorrect && num !== 0) {
            setMistakes((prev) => {
              const newMistakes = prev + 1;
              // 多巴胺模式：錯誤滿3次直接 Game Over
              if (isDopamineMode && newMistakes >= 3) {
                handleDopamineGameOver();
              }
              // 普通模式：錯誤滿3次後標記為失格
              if (!isDopamineMode && newMistakes >= 3) {
                setIsDisqualified(true);
              }
              return newMistakes;
            });
            // 錯誤時重置 Combo
            if (isDopamineMode) {
              setComboCount(0);
            }
          } else if (isCorrect && num !== 0) {
            // 正確答案時處理 Combo（只有當格子從空變為有值時才處理）
            if (isDopamineMode && cell.value === null) {
              const currentTime = Date.now();
              if (currentTime - lastCorrectTime < 5000) { // 5秒內
                setComboCount(prev => prev + 1);
              } else {
                setComboCount(1);
              }
              setLastCorrectTime(currentTime);
              setRemainingCells(prev => prev - 1);
            }
          }
          return { ...cell, value: num === 0 ? null : num, isError: !isCorrect && num !== 0 };
        }
        return cell;
      })
    );

    setGameData({ ...gameData, grid: newGrid });
  };

  const handleClear = () => {
    if (!selectedCell) return;
    
    // 註解模式：清除所有候選數字
    if (showNotes) {
      const { row, col } = selectedCell;
      const newGrid = gameData.grid.map((r, i) =>
        r.map((cell, j) => {
          if (i === row && j === col) {
            return { ...cell, candidates: [] };
          }
          return cell;
        })
      );
      setGameData({ ...gameData, grid: newGrid });
      return;
    }
    
    // 正常模式：清除數字
    handleNumberInput(0);
  };

  // 註解功能處理函數
  const handleToggleNotes = () => {
    setShowNotes(!showNotes);
  };

  const handleHint = () => {
    if (hintCount > 0) {
      // 有剩餘提示次數，提供提示
      if (selectedCell) {
        const { row, col } = selectedCell;
        const cell = gameData.grid[row][col];
        
        // 防呆機制：只有空白格子才能使用提示
        if (!cell.given && !cell.value) {
          // 使用 cell.solution 獲取正確答案
          const solution = cell.solution;
          if (solution) {
            // 填入正確答案
            const newGrid = gameData.grid.map((row, rowIndex) =>
              row.map((cell, colIndex) =>
                rowIndex === row && colIndex === col
                  ? { ...cell, value: solution, candidates: [] }
                  : cell
              )
            );
            setGameData({ ...gameData, grid: newGrid });
            
            // 減少提示次數
            setHintCount(hintCount - 1);
            
            // 清除選擇
            setSelectedCell(null);
          }
        }
        // 如果格子已有值，不執行任何操作（防呆機制）
      }
    } else {
      // 沒有剩餘提示次數，顯示廣告模態框
      setShowHintAdModal(true);
    }
  };

  const handleWatchAd = () => {
    // 觀看廣告後獲得額外提示次數
    setHintCount(hintCount + 3);
    setShowHintAdModal(false);
  };

  const handleNewGame = () => {
    try {
      // 使用 setTimeout 來避免阻塞 UI
      setTimeout(() => {
        if (isDopamineMode) {
          // 多巴胺模式：重新生成相同難度的多巴胺遊戲
          const data = generateKillerSudoku(dopamineDifficulty);
          
          // 根據難度設定時間限制
          const timeLimits = {
            easy: 360,    // 6分鐘
            medium: 720,  // 12分鐘
            hard: 1080,   // 18分鐘
            expert: 1440, // 24分鐘
            hell: 1200    // 20分鐘
          };
          
          setTimeLimit(timeLimits[dopamineDifficulty]);
          setGameData(data);
          setMistakes(0);
          setSelectedCell(null);
          setTime(timeLimits[dopamineDifficulty]);
          setComboCount(0);
          setLastCorrectTime(0);
          setRemainingCells(81);
          setHintCount(3);
        } else {
          // 普通模式：重新生成普通遊戲
          const newGameData = generateKillerSudoku(difficulty);
          setGameData(newGameData);
          setMistakes(0);
          setSelectedCell(null);
          setTime(0);
          setHintCount(3);
        }
        
        setIsDisqualified(false);
        setIsPaused(false);
        setShowGameCompleteModal(false);
        setShowDopamineGameOver(false);
        setShowDopamineWin(false);
        setGameCompletionResult(null);
      }, 0);
    } catch (error) {
      console.error('Error generating new game:', error);
      // 如果出錯，至少重置遊戲狀態
      setMistakes(0);
      setSelectedCell(null);
      setTime(0);
      setIsPaused(false);
      setShowGameCompleteModal(false);
      setShowDopamineGameOver(false);
      setGameCompletionResult(null);
    }
  };

  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
  };

  // 處理排行榜顯示
  const handleShowLeaderboard = (mode: 'normal' | 'dopamine' = 'normal') => {
    setShowLeaderboard(true);
    setShowGameCompleteModal(false);
    // 設置當前查看的模式
    setCurrentLeaderboardMode(mode);
  };

  const handleCloseLeaderboard = () => {
    setShowLeaderboard(false);
  };

  const handleShowRules = () => {
    setShowRules(true);
  };

  const handleCloseRules = () => {
    setShowRules(false);
  };

  // 處理多巴胺模式啟動
  const handleDopamineMode = (difficulty: DopamineDifficulty) => {
    const data = generateKillerSudoku(difficulty);
    
    // 根據難度設定時間限制
    const timeLimits = {
      easy: 360,    // 6分鐘
      medium: 720,  // 12分鐘
      hard: 1080,   // 18分鐘
      expert: 1440, // 24分鐘
      hell: 1200    // 20分鐘
    };
    
    setDopamineDifficulty(difficulty);
    setTimeLimit(timeLimits[difficulty]);
    setGameData(data);
    setMistakes(0);
    setSelectedCell(null);
    setTime(timeLimits[difficulty]);
    setComboCount(0);
    setLastCorrectTime(0);
    setRemainingCells(81);
    setIsDopamineMode(true);
    setIsPaused(false);
    setShowGameCompleteModal(false);
    setShowDopamineGameOver(false);
    setGameCompletionResult(null);
  };

  // 一鍵答題測試函數 - 自動填入所有答案
  const handleTestComplete = () => {
    console.log('⚡ 一鍵解題開始');
    
    // 自動填入所有答案
    const newGrid = gameData.grid.map((row) =>
      row.map((cell) => ({
        ...cell,
        value: cell.solution, // 填入正確答案
        isCorrect: true, // 標記為正確
        isGiven: cell.given // 保持原始給定狀態
      }))
    );
    
    setGameData({ ...gameData, grid: newGrid });
    
    // 更新多巴胺模式相關狀態
    if (isDopamineMode) {
      setRemainingCells(0); // 所有格子都填完了
      setComboCount(0); // 重置combo
    }
    
    // 直接觸發遊戲完成，像多巴胺模式一樣
    setTimeout(() => {
      console.log(`🎯 觸發遊戲完成 - 模式: ${isDopamineMode ? '多巴胺' : '普通'}`);
      if (isDopamineMode) {
        handleDopamineWin();
      } else {
        // 普通模式：先設置基本結果，然後調用處理函數
        console.log('🔧 設置基本遊戲完成結果');
        setGameCompletionResult({ 
          score: calculateScore({ difficulty, completionTime: time, mistakes }),
          rank: null, 
          isNewRecord: false 
        });
        handleGameComplete();
      }
    }, 100); // 短暫延遲確保狀態更新
  };

  // 測試WIN資訊卡（用於測試）
  const handleTestWin = async () => {
    const score = calculateDopamineScore({
      difficulty: dopamineDifficulty,
      timeLeft: time,
      remainingCells,
      comboCount,
      mistakes,
      completionTime: timeLimit - time
    }).finalScore;

    let isNewRecord = false;

    // 獲取該難度的最高分
    if (user && !isVisitorMode) {
      try {
        const bestScore = await getDopamineUserBestScore(user.id, dopamineDifficulty);
        
        if (bestScore && bestScore.score === score) {
          isNewRecord = true;
        }
      } catch (error) {
        console.error('獲取最高分失敗:', error);
      }
    }

    // 獲取所有用戶在該難度的最高分
    const topScores = await getAllDopamineUsersTopScore(dopamineDifficulty);

    setDopamineWinData({
      score,
      timeLeft: time,
      difficulty: dopamineDifficulty,
      comboCount,
      mistakes,
      topScores,
      isNewRecord
    });
    
    setShowDopamineWin(true);
    setIsPaused(true);
  };

  // 檢查環境變數
  useEffect(() => {
    checkEnvironment();
    testSupabaseConnection();
  }, []);

  // 返回主選單
  const handleReturnToMain = () => {
    setIsDopamineMode(false);
    setShowDopamineWin(false);
    setShowDopamineGameOver(false);
    setComboCount(0);
    setLastCorrectTime(0);
    setRemainingCells(81);
    setMistakes(0);
    setTime(0);
    setIsPaused(false);
    setSelectedCell(null);
    // 重置為普通模式
    setDifficulty('easy');
    setGameData(generateKillerSudoku('easy'));
  };

  // 處理多巴胺模式 Game Over
  const handleDopamineGameOver = () => {
    console.log('💀 多巴胺模式 Game Over');
    
    setDopamineGameOverData({
      difficulty: dopamineDifficulty,
      score: calculateDopamineScore({
        difficulty: dopamineDifficulty,
        timeLeft: time,
        remainingCells,
        comboCount,
        mistakes,
        completionTime: timeLimit - time
      }).finalScore,
      timeLeft: time,
      comboCount,
      mistakes
    });
    
    setShowDopamineGameOver(true);
    setIsPaused(true);
  };

  // 處理多巴胺模式 Win
  const handleDopamineWin = async () => {
    const score = calculateDopamineScore({
      difficulty: dopamineDifficulty,
      timeLeft: time,
      remainingCells,
      comboCount,
      mistakes,
      completionTime: timeLimit - time
    }).finalScore;

    let isNewRecord = false;

    // 保存多巴胺模式遊戲記錄
    if (user && !isVisitorMode) {
      try {
        const result = await saveDopamineGameRecord(
          user.id,
          dopamineDifficulty, // 使用多巴胺難度
          timeLimit - time,   // 完成時間
          mistakes,
          comboCount
        );
        
        if (result) {
          console.log('多巴胺模式遊戲記錄已保存:', result);
          
          // 獲取該難度的最高分
          const bestScore = await getDopamineUserBestScore(user.id, dopamineDifficulty);
          
          if (bestScore && bestScore.score === score) {
            // 如果當前分數等於最佳分數，說明是新的最高分
            isNewRecord = true;
          }
        }
      } catch (error) {
        console.error('保存多巴胺模式遊戲記錄失敗:', error);
      }
    }

    // 獲取所有用戶在該難度的最高分
    const topScores = await getAllDopamineUsersTopScore(dopamineDifficulty);

    setDopamineWinData({
      score,
      timeLeft: time,
      difficulty: dopamineDifficulty,
      comboCount,
      mistakes,
      topScores,
      isNewRecord
    });
    
    setShowDopamineWin(true);
    setIsPaused(true);
  };

  return (
    <>
    <div className={`min-h-screen flex items-center justify-center p-2 md:p-4 ${isDopamineMode ? 'pt-20 sm:pt-16' : ''}`} data-theme={currentTheme}>
      <div className="w-full max-w-6xl mx-auto animate-fade-in">
        {/* 動態漸層背景 */}
        <AnimatedGradientBackground isDopamineMode={isDopamineMode} />
        
        {/* 多巴胺模式進度條 */}
        <DopamineProgressBar
          remainingCells={remainingCells}
          comboCount={comboCount}
          currentScore={calculateDopamineScore({
            difficulty: dopamineDifficulty,
            timeLeft: time,
            remainingCells,
            comboCount,
            mistakes,
            completionTime: timeLimit - time
          }).finalScore}
          timeLeft={time}
          timeLimit={timeLimit}
          isVisible={isDopamineMode}
        />
        
        {/* 移動裝置佈局 */}
        <div className="block md:hidden">
          <div className="space-y-2">
            <GameHeader 
              onNewGame={handleNewGame}
              onThemeChange={handleThemeChange}
              currentTheme={currentTheme}
              onShowLeaderboard={handleShowLeaderboard}
              onShowRules={handleShowRules}
            />
            
            <DifficultySelector 
              difficulty={difficulty} 
              onDifficultyChange={setDifficulty}
              mistakes={mistakes}
              time={time}
              isPaused={isPaused}
              onTogglePause={handleTogglePause}
              onDopamineMode={handleDopamineMode}
              onToggleNotes={handleToggleNotes}
              showNotes={showNotes}
              onBecomeUser={handleBecomeUser}
              onHint={handleHint}
              hintCount={hintCount}
              selectedCell={selectedCell}
              currentTheme={currentTheme}
            />

            <div className="space-y-2">
              <KillerSudokuGrid
                grid={gameData.grid}
                cages={gameData.cages}
                selectedCell={selectedCell}
                onCellSelect={setSelectedCell}
              />

              <NumberPad
                onNumberSelect={handleNumberInput}
                onClear={handleClear}
                disabled={!selectedCell}
                currentTheme={currentTheme}
                onTestComplete={handleTestComplete}
              />
          </div>
        </div>
        </div>

        {/* 桌面/平板佈局 */}
        <div className="hidden md:block relative">
          <div className="flex items-center justify-center gap-6 h-[500px]">
            {/* 左側：九宮格 - 使用固定尺寸確保大小合適 */}
            <div className="flex-shrink-0">
              <div className="w-[500px] h-[500px]">
              <KillerSudokuGrid
                grid={gameData.grid}
                cages={gameData.cages}
                selectedCell={selectedCell}
                onCellSelect={setSelectedCell}
              />
              </div>
            </div>

            {/* 右側：垂直排列所有其他元件 - 統一間距系統 */}
            <div className="flex flex-col w-[430px] h-[500px] space-y-3">
              {/* GameHeader - 與九宮格上緣切齊 */}
              <div>
                <GameHeader 
                  onNewGame={handleNewGame}
                  onThemeChange={handleThemeChange}
                  currentTheme={currentTheme}
                  onShowLeaderboard={handleShowLeaderboard}
                  onShowRules={handleShowRules}
                />
              </div>


              {/* DifficultySelector */}
              <div>
                <DifficultySelector 
                  difficulty={difficulty} 
                  onDifficultyChange={setDifficulty}
                  mistakes={mistakes}
                  time={time}
                  isPaused={isPaused}
                  onTogglePause={handleTogglePause}
                  onDopamineMode={handleDopamineMode}
                  onToggleNotes={handleToggleNotes}
                  showNotes={showNotes}
                  onBecomeUser={handleBecomeUser}
                  onHint={handleHint}
                  hintCount={hintCount}
                  selectedCell={selectedCell}
                  currentTheme={currentTheme}
                />
              </div>

              {/* Clear 按鈕 */}
              <div>
                <NumberPad
                  onNumberSelect={handleNumberInput}
                  onClear={handleClear}
                  disabled={!selectedCell}
                  showClearOnly={true}
                  currentTheme={currentTheme}
                  onTestComplete={handleTestComplete}
                />
              </div>

              {/* NumberPad - 自動填滿剩餘空間並與九宮格底部對齊 */}
              <div className="flex-1 flex justify-end">
                <NumberPad
                  onNumberSelect={handleNumberInput}
                  onClear={handleClear}
                  disabled={!selectedCell}
                  showNumbersOnly={true}
                  currentTheme={currentTheme}
                  onTestComplete={handleTestComplete}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 用戶名稱輸入模態框 */}
      {showUserNameInput && (
        <UserNameInput
          onSubmit={handleUserNameSubmit}
          onVisitorMode={handleVisitorMode}
          loading={userLoading}
        />
      )}

      {/* 遊戲完成模態框 */}
      {showGameCompleteModal && (
        <GameCompleteModal
          isOpen={showGameCompleteModal}
          onClose={() => setShowGameCompleteModal(false)}
          onNewGame={handleNewGame}
          onShowLeaderboard={handleShowLeaderboard}
          score={gameCompletionResult?.score || 0}
          completionTime={time}
          mistakes={mistakes}
          difficulty={difficulty}
          rank={gameCompletionResult?.rank}
          isNewRecord={gameCompletionResult?.isNewRecord || false}
          currentUserId={user?.id}
        />
      )}

      {/* 排行榜模態框 */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-[400px] max-h-[90vh] overflow-auto">
            <Card className="bg-background">
              <Leaderboard
                currentUserId={user?.name}
                onClose={handleCloseLeaderboard}
                mode={currentLeaderboardMode}
              />
            </Card>
          </div>
        </div>
      )}

      {/* 多巴胺模式 Win 模態框 */}
      {showDopamineWin && dopamineWinData && (
        <DopamineWinModal
          isOpen={showDopamineWin}
          onClose={() => setShowDopamineWin(false)}
          onRestart={() => handleDopamineMode(dopamineDifficulty)}
          onReturnToMain={handleReturnToMain}
          score={dopamineWinData.score}
          timeLeft={dopamineWinData.timeLeft}
          difficulty={dopamineWinData.difficulty}
          comboCount={dopamineWinData.comboCount}
          mistakes={dopamineWinData.mistakes}
          topScores={dopamineWinData.topScores}
          isNewRecord={dopamineWinData.isNewRecord}
        />
      )}

      {/* 多巴胺模式 Game Over 模態框 */}
      {showDopamineGameOver && dopamineGameOverData && (
        <DopamineGameOverModal
          isOpen={showDopamineGameOver}
          onClose={() => setShowDopamineGameOver(false)}
          onRestart={() => handleDopamineMode(dopamineDifficulty)}
          onReturnToMain={handleReturnToMain}
          score={0}
          timeLeft={0}
          difficulty={dopamineGameOverData.difficulty}
          comboCount={0}
          mistakes={0}
          topScores={[]}
        />
      )}

      {/* 遊戲規則模態框 */}
      <GameRulesModal 
        isOpen={showRules} 
        onClose={handleCloseRules} 
      />

      {/* 功能提示模態框 */}
      <FeatureHintModal
        isOpen={showFeatureHint}
        onClose={handleFeatureHintClose}
        onBecomeUser={handleBecomeUser}
      />

      {/* 提示廣告模態框 */}
      <HintAdModal
        isOpen={showHintAdModal}
        onClose={() => setShowHintAdModal(false)}
        onWatchAd={handleWatchAd}
      />

    </div>

    {/* 簡潔 Footer - 放在主容器外 */}
    <footer className="py-3 bg-background/20 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4">
        {/* 桌面版：三欄佈局 */}
        <div className="hidden md:flex items-center justify-center relative">
          {/* 左邊：版權資訊 */}
          <div className="absolute left-4 text-xs text-muted-foreground/50">
            © 2025 mintae. All rights reserved.
          </div>
          
          {/* 中間：法律文件連結 */}
          <div className="text-xs text-muted-foreground/60 space-x-3">
            <a href="/terms-of-service.html" className="hover:text-muted-foreground transition-colors">Terms</a>
            <span>•</span>
            <a href="/privacy-policy.html" className="hover:text-muted-foreground transition-colors">Privacy</a>
            <span>•</span>
            <a href="/cookie-policy.html" className="hover:text-muted-foreground transition-colors">Cookies</a>
            <span>•</span>
            <a href="/contact.html" className="hover:text-muted-foreground transition-colors">Contact</a>
          </div>
          
          {/* 右邊：GitHub icon */}
          <div className="absolute right-4 text-xs">
            <a 
              href="https://github.com/mintaemt/Killer-sudoku-score" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              title="GitHub Repository"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* 行動版：兩行佈局 */}
        <div className="block md:hidden">
          {/* 第一行：法律文件連結居中 */}
          <div className="text-center mb-2">
            <div className="text-xs text-muted-foreground/60 space-x-3">
              <a href="/terms-of-service.html" className="hover:text-muted-foreground transition-colors">Terms</a>
              <span>•</span>
              <a href="/privacy-policy.html" className="hover:text-muted-foreground transition-colors">Privacy</a>
              <span>•</span>
              <a href="/cookie-policy.html" className="hover:text-muted-foreground transition-colors">Cookies</a>
              <span>•</span>
              <a href="/contact.html" className="hover:text-muted-foreground transition-colors">Contact</a>
            </div>
          </div>
          
          {/* 第二行：版權資訊居中，GitHub icon 在句尾 */}
          <div className="text-center">
            <div className="text-xs text-muted-foreground/50 inline-flex items-center">
              © 2025 mintae. All rights reserved.
              <a 
                href="https://github.com/mintaemt/Killer-sudoku-score" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground/60 hover:text-muted-foreground transition-colors ml-[10px]"
                title="GitHub Repository"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Index;
