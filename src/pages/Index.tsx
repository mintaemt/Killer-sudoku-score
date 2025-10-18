import { useState, useEffect } from "react";
import { KillerSudokuGrid } from "@/components/KillerSudokuGrid";
import { NumberPad } from "@/components/NumberPad";
import { GameHeader } from "@/components/GameHeader";
import { DifficultySelector } from "@/components/DifficultySelector";
import { UserNameInput } from "@/components/UserNameInput";
import { GameCompleteModal } from "@/components/GameCompleteModal";
import { GameRulesModal } from "@/components/GameRulesModal";
import { Leaderboard } from "@/components/Leaderboard";
import { LeaderboardDebug } from "@/components/LeaderboardDebug";
import { generateKillerSudoku } from "@/lib/sudoku-generator";
import { useUser } from "@/hooks/useUser";
import { useGameRecord } from "@/hooks/useGameRecord";
import { Difficulty, GameCompletionResult } from "@/lib/types";
import { calculateScore } from "@/lib/scoreCalculator";

const Index = () => {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [mistakes, setMistakes] = useState(0);
  const [gameData, setGameData] = useState(generateKillerSudoku(difficulty));
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("blue");
  
  // 新增狀態
  const [showUserNameInput, setShowUserNameInput] = useState(false);
  const [showGameCompleteModal, setShowGameCompleteModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [gameCompletionResult, setGameCompletionResult] = useState<GameCompletionResult | null>(null);
  
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
    
    // 訪客模式下不保存記錄，只顯示完成模態框
    if (isVisitorMode) {
      const score = calculateScore({ difficulty, completionTime: time, mistakes });
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
        setTime(0);
        setIsPaused(false);
      }, 0);
    } catch (error) {
      console.error('Error generating game on difficulty change:', error);
    }
  }, [difficulty]);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;
    if (gameData.grid[row][col].given) return;

    const newGrid = gameData.grid.map((r, i) =>
      r.map((cell, j) => {
        if (i === row && j === col) {
          const isCorrect = cell.solution === num;
          if (!isCorrect && num !== 0) {
            setMistakes((prev) => prev + 1);
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
        setTime(0);
        setIsPaused(false);
        setShowGameCompleteModal(false);
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-2 md:p-4" data-theme={currentTheme}>
      <div className="w-full max-w-6xl mx-auto animate-fade-in">
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

      {/* 遊戲規則模態框 */}
      <GameRulesModal 
        isOpen={showRules} 
        onClose={handleCloseRules} 
      />
    </div>
  );
};

export default Index;
