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
import { generateKillerSudoku, generateDopamineSudoku } from "@/lib/sudoku-generator";
import { useUser } from "@/hooks/useUser";
import { useGameRecord } from "@/hooks/useGameRecord";
import { Difficulty, DopamineDifficulty, GameCompletionResult } from "@/lib/types";
import { calculateScore, calculateDopamineScore } from "@/lib/scoreCalculator";
import { cn } from "@/lib/utils";

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
  const [showRules, setShowRules] = useState(false);
  const [gameCompletionResult, setGameCompletionResult] = useState<GameCompletionResult | null>(null);
  
  // 普通模式錯誤處理狀態
  const [isDisqualified, setIsDisqualified] = useState(false);
  
  // Hooks
  const { user, loading: userLoading, createOrUpdateUser, enterVisitorMode, isVisitorMode, isLoggedIn } = useUser();
  const { saveGameRecord } = useGameRecord();

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
  }, [gameData]);

  // 檢查遊戲是否完成
  const isGameComplete = (): boolean => {
    return gameData.grid.every(row => 
      row.every(cell => cell.value === cell.solution)
    );
  };

  // 處理遊戲完成
  const handleGameComplete = async () => {
    if (!user && !isVisitorMode) return;

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
      setGameCompletionResult({ 
        score, 
        rank: null, 
        isNewRecord: false 
      });
      setShowGameCompleteModal(true);
      return;
    }
    
    // 普通模式：如果失格則不保存記錄
    if (!isDopamineMode && isDisqualified) {
      setGameCompletionResult({ 
        score, 
        rank: null, 
        isNewRecord: false 
      });
      setShowGameCompleteModal(true);
      return;
    }
    
    try {
      const result = await saveGameRecord(user!.id, difficulty, time, mistakes);
      if (result) {
        setGameCompletionResult(result);
        setShowGameCompleteModal(true);
      }
    } catch (error) {
      console.error('Error handling game completion:', error);
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
            // 正確答案時處理 Combo
            if (isDopamineMode) {
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
    handleNumberInput(0);
  };

  const handleNewGame = () => {
    try {
      // 使用 setTimeout 來避免阻塞 UI
      setTimeout(() => {
        const newGameData = generateKillerSudoku(difficulty);
        setGameData(newGameData);
        setMistakes(0);
        setSelectedCell(null);
        
        // 重置多巴胺模式狀態
        setIsDopamineMode(false);
        setTime(0);
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
  const handleShowLeaderboard = () => {
    setShowLeaderboard(true);
    setShowGameCompleteModal(false);
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
  const handleDopamineMode = () => {
    const { data, difficulty: generatedDifficulty } = generateDopamineSudoku();
    
    // 根據難度設定時間限制
    const timeLimits = {
      easy: 360,    // 6分鐘
      medium: 720,  // 12分鐘
      hard: 1080,   // 18分鐘
      expert: 1440, // 24分鐘
      hell: 1200    // 20分鐘
    };
    
    setDopamineDifficulty(generatedDifficulty);
    setTimeLimit(timeLimits[generatedDifficulty]);
    setGameData(data);
    setMistakes(0);
    setSelectedCell(null);
    setTime(timeLimits[generatedDifficulty]);
    setComboCount(0);
    setLastCorrectTime(0);
    setRemainingCells(81);
    setIsDopamineMode(true);
    setIsPaused(false);
    setShowGameCompleteModal(false);
    setShowDopamineGameOver(false);
    setGameCompletionResult(null);
  };

  // 處理多巴胺模式 Game Over
  const handleDopamineGameOver = () => {
    setDopamineGameOverData({
      difficulty: dopamineDifficulty
    });
    
    setShowDopamineGameOver(true);
    setIsPaused(true);
  };

  // 處理多巴胺模式 Win
  const handleDopamineWin = () => {
    const score = calculateDopamineScore({
      difficulty: dopamineDifficulty,
      timeLeft: time,
      remainingCells,
      comboCount,
      mistakes,
      completionTime: timeLimit - time
    }).finalScore;

    setDopamineWinData({
      score,
      timeLeft: time,
      difficulty: dopamineDifficulty,
      comboCount,
      mistakes,
      topScore: null // 目前沒有最高分資料
    });
    
    setShowDopamineWin(true);
    setIsPaused(true);
  };

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center p-2 md:p-4",
      isDopamineMode && "dopamine-mode-border"
    )} data-theme={currentTheme}>
      <div className={cn(
        "w-full max-w-6xl mx-auto animate-fade-in",
        isDopamineMode && "dopamine-content"
      )}>
        {/* 動態漸層背景 */}
        <AnimatedGradientBackground isDopamineMode={isDopamineMode} />
        
        {/* 多巴胺模式進度條 */}
        <DopamineProgressBar
          timeLeft={time}
          remainingCells={remainingCells}
          comboCount={comboCount}
          isVisible={isDopamineMode}
        />
        {/* 移動裝置佈局 - 保持原有垂直佈局 */}
        <div className="block md:hidden space-y-4">
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
          />

          <div className="space-y-4">
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
            />
          </div>
        </div>

        {/* 桌面/平板佈局 - 根據 wireframe 設計 */}
        <div className="hidden md:block">
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
            <div className="flex flex-col w-[400px] h-[500px] space-y-3">
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
      {showGameCompleteModal && gameCompletionResult && (
        <GameCompleteModal
          isOpen={showGameCompleteModal}
          onClose={() => setShowGameCompleteModal(false)}
          onNewGame={handleNewGame}
          onShowLeaderboard={handleShowLeaderboard}
          score={gameCompletionResult.score}
          completionTime={time}
          mistakes={mistakes}
          difficulty={difficulty}
          rank={gameCompletionResult.rank}
          isNewRecord={gameCompletionResult.isNewRecord}
        />
      )}

      {/* 排行榜模態框 */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-auto">
            <Leaderboard
              currentUserId={user?.name}
              onClose={handleCloseLeaderboard}
            />
          </div>
        </div>
      )}

      {/* 多巴胺模式 Win 模態框 */}
      {showDopamineWin && dopamineWinData && (
        <DopamineWinModal
          isOpen={showDopamineWin}
          onClose={() => setShowDopamineWin(false)}
          onRestart={handleDopamineMode}
          score={dopamineWinData.score}
          timeLeft={dopamineWinData.timeLeft}
          difficulty={dopamineWinData.difficulty}
          comboCount={dopamineWinData.comboCount}
          mistakes={dopamineWinData.mistakes}
          topScore={dopamineWinData.topScore}
        />
      )}

      {/* 多巴胺模式 Game Over 模態框 */}
      {showDopamineGameOver && dopamineGameOverData && (
        <DopamineGameOverModal
          isOpen={showDopamineGameOver}
          onClose={() => setShowDopamineGameOver(false)}
          onRestart={handleDopamineMode}
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
      </div>
    </div>
  );
};

export default Index;
