import { Difficulty, DopamineDifficulty } from "@/lib/types";

export interface Cell {
  value: number | null;
  solution: number;
  given: boolean;
  isError?: boolean;
}

export interface Cage {
  id: number;
  cells: { row: number; col: number }[];
  sum: number;
}

export interface KillerSudokuData {
  grid: Cell[][];
  cages: Cage[];
  puzzleId: string; // 唯一題目ID
}

// 題目歷史記錄（實際應用中應該存儲在服務器或本地存儲中）
const generatedPuzzles = new Set<string>();

// 生成隨機的已解決數獨網格 - 使用更簡單可靠的方法
function generateRandomSolvedGrid(): number[][] {
  // 使用預定義的基礎模式，然後進行隨機變換
  const baseGrid = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [4, 5, 6, 7, 8, 9, 1, 2, 3],
    [7, 8, 9, 1, 2, 3, 4, 5, 6],
    [2, 3, 4, 5, 6, 7, 8, 9, 1],
    [5, 6, 7, 8, 9, 1, 2, 3, 4],
    [8, 9, 1, 2, 3, 4, 5, 6, 7],
    [3, 4, 5, 6, 7, 8, 9, 1, 2],
    [6, 7, 8, 9, 1, 2, 3, 4, 5],
    [9, 1, 2, 3, 4, 5, 6, 7, 8]
  ];

  // 創建深拷貝
  const grid = baseGrid.map(row => [...row]);

  // 隨機變換行
  for (let i = 0; i < 3; i++) {
    const blockStart = i * 3;
    const rows = [blockStart, blockStart + 1, blockStart + 2];
    
    // 隨機交換行
    for (let j = 0; j < 2; j++) {
      const row1 = rows[Math.floor(Math.random() * 3)];
      const row2 = rows[Math.floor(Math.random() * 3)];
      if (row1 !== row2) {
        [grid[row1], grid[row2]] = [grid[row2], grid[row1]];
      }
    }
  }

  // 隨機變換列
  for (let i = 0; i < 3; i++) {
    const blockStart = i * 3;
    const cols = [blockStart, blockStart + 1, blockStart + 2];
    
    // 隨機交換列
    for (let j = 0; j < 2; j++) {
      const col1 = cols[Math.floor(Math.random() * 3)];
      const col2 = cols[Math.floor(Math.random() * 3)];
      if (col1 !== col2) {
        for (let row = 0; row < 9; row++) {
          [grid[row][col1], grid[row][col2]] = [grid[row][col2], grid[row][col1]];
        }
      }
    }
  }

  // 隨機變換數字
  const numberMap = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = numberMap.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numberMap[i], numberMap[j]] = [numberMap[j], numberMap[i]];
  }

  // 應用數字變換
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      grid[row][col] = numberMap[grid[row][col] - 1];
    }
  }

  return grid;
}

// 檢查數獨網格是否有唯一解
function hasUniqueSolution(grid: number[][], cages: Cage[]): boolean {
  // 簡化的唯一解檢查 - 實際應用中需要更複雜的算法
  // 這裡我們檢查基本的約束條件
  for (const cage of cages) {
    const cageValues = cage.cells.map(cell => grid[cell.row][cell.col]);
    const sum = cageValues.reduce((a, b) => a + b, 0);
    
    if (sum !== cage.sum) return false;
    
    // 檢查cage內是否有重複數字
    const uniqueValues = new Set(cageValues);
    if (uniqueValues.size !== cageValues.length) return false;
  }
  
  return true;
}

// 生成隨機的 cage 配置 - 優化單格 cage 數量
function generateRandomCages(grid: number[][]): Cage[] {
  const cages: Cage[] = [];
  const used = Array(9)
    .fill(null)
    .map(() => Array(9).fill(false));
  let cageId = 0;

  // 創建所有位置列表
  const allPositions = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      allPositions.push({ row, col });
    }
  }

  // 隨機打亂位置順序
  for (let i = allPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]];
  }

  // 計算目標單格 cage 數量（限制在 5-8 個，約 10-15%）
  const maxSingleCages = 8; // 最多 8 個單格 cage
  const minSingleCages = 5; // 最少 5 個單格 cage
  let singleCageCount = 0;
  let totalCages = 0;

  // 為每個位置生成 cage
  for (const startPos of allPositions) {
    if (used[startPos.row][startPos.col]) continue;

    const cageCells: { row: number; col: number }[] = [startPos];
    used[startPos.row][startPos.col] = true;
    let sum = grid[startPos.row][startPos.col];

    // 決定 cage 大小 - 優先生成多格 cage
    let targetSize: number;
    const remainingPositions = allPositions.filter(pos => !used[pos.row][pos.col]).length;
    
    // 如果已經達到最大單格 cage 數量，強制生成多格 cage
    if (singleCageCount >= maxSingleCages) {
      targetSize = Math.floor(Math.random() * 3) + 2; // 2-4 格
    }
    // 如果還需要更多單格 cage 且剩餘位置足夠
    else if (singleCageCount < minSingleCages && remainingPositions > minSingleCages - singleCageCount) {
      // 有 30% 機率生成單格 cage
      targetSize = Math.random() < 0.3 ? 1 : Math.floor(Math.random() * 3) + 2;
    } else {
      // 正常情況下，優先生成多格 cage
      const rand = Math.random();
      if (rand < 0.1) {
        targetSize = 1; // 10% 機率生成單格 cage
      } else if (rand < 0.6) {
        targetSize = 2; // 50% 機率生成 2 格 cage
      } else if (rand < 0.9) {
        targetSize = 3; // 30% 機率生成 3 格 cage
      } else {
        targetSize = 4; // 10% 機率生成 4 格 cage
      }
    }

    let attempts = 0;
    const maxAttempts = 15; // 增加嘗試次數

    while (cageCells.length < targetSize && attempts < maxAttempts) {
      // 獲取當前 cage 的鄰居
      const neighbors: { row: number; col: number }[] = [];
      
      for (const cell of cageCells) {
        const adjacent = [
          { row: cell.row - 1, col: cell.col },
          { row: cell.row + 1, col: cell.col },
          { row: cell.row, col: cell.col - 1 },
          { row: cell.row, col: cell.col + 1 },
        ];
        
        for (const adj of adjacent) {
          if (adj.row >= 0 && adj.row < 9 && 
              adj.col >= 0 && adj.col < 9 && 
              !used[adj.row][adj.col] &&
              !neighbors.some(n => n.row === adj.row && n.col === adj.col)) {
            neighbors.push(adj);
          }
        }
      }

      if (neighbors.length === 0) break;

      // 隨機選擇一個鄰居
      const selected = neighbors[Math.floor(Math.random() * neighbors.length)];
      cageCells.push(selected);
      used[selected.row][selected.col] = true;
      sum += grid[selected.row][selected.col];
      attempts++;
    }

    // 記錄單格 cage 數量
    if (cageCells.length === 1) {
      singleCageCount++;
    }
    totalCages++;

    // 添加 cage
    cages.push({
      id: cageId++,
      cells: cageCells,
      sum,
    });
  }

  console.log(`Generated ${totalCages} cages with ${singleCageCount} single-cell cages (${(singleCageCount/totalCages*100).toFixed(1)}%)`);
  
  // 後處理：嘗試合併一些單格 cage 來進一步減少單格 cage 數量
  const optimizedCages = optimizeCages(cages, grid);
  
  return optimizedCages;
}

// 優化 cage 配置，減少單格 cage 數量
function optimizeCages(cages: Cage[], grid: number[][]): Cage[] {
  const optimizedCages = [...cages];
  const singleCages = optimizedCages.filter(cage => cage.cells.length === 1);
  
  // 如果單格 cage 數量仍然太多，嘗試合併一些
  if (singleCages.length > 6) {
    console.log(`Optimizing cages: ${singleCages.length} single-cell cages found`);
    
    // 嘗試合併相鄰的單格 cage
    for (let i = 0; i < singleCages.length - 1 && singleCages.length > 6; i++) {
      const cage1 = singleCages[i];
      const cell1 = cage1.cells[0];
      
      // 尋找相鄰的單格 cage
      for (let j = i + 1; j < singleCages.length; j++) {
        const cage2 = singleCages[j];
        const cell2 = cage2.cells[0];
        
        // 檢查是否相鄰
        const isAdjacent = (
          (Math.abs(cell1.row - cell2.row) === 1 && cell1.col === cell2.col) ||
          (Math.abs(cell1.col - cell2.col) === 1 && cell1.row === cell2.row)
        );
        
        if (isAdjacent) {
          // 合併兩個單格 cage
          const mergedCage: Cage = {
            id: cage1.id,
            cells: [cell1, cell2],
            sum: cage1.sum + cage2.sum
          };
          
          // 替換原來的 cage
          const cage1Index = optimizedCages.findIndex(c => c.id === cage1.id);
          const cage2Index = optimizedCages.findIndex(c => c.id === cage2.id);
          
          if (cage1Index !== -1 && cage2Index !== -1) {
            optimizedCages[cage1Index] = mergedCage;
            optimizedCages.splice(cage2Index, 1);
            
            // 更新 singleCages 列表
            singleCages.splice(j, 1);
            singleCages.splice(i, 1);
            i--; // 調整索引
            break;
          }
        }
      }
    }
    
    const finalSingleCages = optimizedCages.filter(cage => cage.cells.length === 1).length;
    console.log(`After optimization: ${finalSingleCages} single-cell cages (${(finalSingleCages/optimizedCages.length*100).toFixed(1)}%)`);
  }
  
  return optimizedCages;
}

// 生成題目唯一ID
function generatePuzzleId(grid: number[][], cages: Cage[]): string {
  try {
    const gridString = grid.map(row => row.join('')).join('');
    const cageString = cages.map(cage => 
      `${cage.sum}:${cage.cells.map(c => `${c.row},${c.col}`).join(';')}`
    ).join('|');
    
    // 使用簡單的哈希函數
    let hash = 0;
    const str = gridString + cageString;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 轉換為32位整數
    }
    
    return Math.abs(hash).toString(36);
  } catch (error) {
    console.error('Error generating puzzle ID:', error);
    return Math.random().toString(36).substring(2);
  }
}

export function generateKillerSudoku(difficulty: Difficulty): KillerSudokuData {
  try {
    // 簡化版本：直接生成，減少複雜檢查
    const solution = generateRandomSolvedGrid();
    const cages = generateRandomCages(solution);
    const puzzleId = generatePuzzleId(solution, cages);
    
    // 記錄已生成的題目（簡化版本）
    generatedPuzzles.add(puzzleId);
    
    // 根據難度決定顯示的數字數量
    const givensCount = {
      easy: 30,      // 簡單：30個數字，適合初學者
      medium: 25,    // 中等：25個數字，需要一些推理
      hard: 10,      // 困難：10個數字，需要較強邏輯推理
      expert: 1,     // 專家：僅1個數字，極具挑戰性
    }[difficulty];

    const grid: Cell[][] = solution.map((row) =>
      row.map((val) => ({
        value: null,
        solution: val,
        given: false,
      }))
    );

    // 根據難度選擇要顯示的格子
    if (difficulty === 'expert') {
      // Expert 難度：隨機放置一個數字
      const positions = [];
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          positions.push({ row: i, col: j });
        }
      }
      
      // 隨機選擇一個位置
      const randomPos = positions[Math.floor(Math.random() * positions.length)];
      grid[randomPos.row][randomPos.col].given = true;
      grid[randomPos.row][randomPos.col].value = solution[randomPos.row][randomPos.col];
    } else {
      // 其他難度：隨機選擇要顯示的格子
      const positions = [];
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          positions.push({ row: i, col: j });
        }
      }

      // 打亂位置順序
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }

      // 設置給定的格子
      for (let i = 0; i < givensCount; i++) {
        const { row, col } = positions[i];
        grid[row][col].given = true;
        grid[row][col].value = solution[row][col];
      }
    }

    return { grid, cages, puzzleId };
  } catch (error) {
    console.error('Critical error in generateKillerSudoku:', error);
    
    // 返回一個最基本的題目作為後備
    const fallbackGrid: Cell[][] = Array(9).fill(null).map(() => 
      Array(9).fill(null).map(() => ({
        value: null,
        solution: 1,
        given: false,
      }))
    );
    
    const fallbackCages: Cage[] = [{
      id: 0,
      cells: [{ row: 0, col: 0 }],
      sum: 1
    }];
    
    return { 
      grid: fallbackGrid, 
      cages: fallbackCages, 
      puzzleId: 'fallback-' + Math.random().toString(36).substring(2)
    };
  }
}

/**
 * 生成地獄難度數獨 - 無給定數字，限制單格 cage
 */
function generateHellDifficultySudoku(): KillerSudokuData {
  try {
    const solvedGrid = generateRandomSolvedGrid();
    
    // 生成 cage，但限制單格 cage 數量
    let cages = generateCages(solvedGrid);
    
    // 檢查單格 cage 數量，如果超過2個則重新生成
    let attempts = 0;
    while (attempts < 20) { // 增加嘗試次數
      const singleCageCount = cages.filter(cage => cage.cells.length === 1).length;
      if (singleCageCount <= 2) {
        break;
      }
      
      // 重新生成 cage
      cages = generateCages(solvedGrid);
      attempts++;
    }
    
    // 如果仍然超過2個單格 cage，手動合併一些
    const singleCages = cages.filter(cage => cage.cells.length === 1);
    if (singleCages.length > 2) {
      console.log(`Hell mode: Found ${singleCages.length} single cages, merging excess ones`);
      
      // 移除多餘的單格 cage
      const cagesToRemove = singleCages.slice(2);
      cages = cages.filter(cage => !cagesToRemove.includes(cage));
      
      // 將移除的單格合併到相鄰的 cage 中
      cagesToRemove.forEach(cageToRemove => {
        const cell = cageToRemove.cells[0];
        const { row, col } = cell;
        
        // 尋找相鄰的 cage
        const neighbors = [
          { row: row - 1, col }, { row: row + 1, col },
          { row, col: col - 1 }, { row, col: col + 1 }
        ].filter(pos => pos.row >= 0 && pos.row < 9 && pos.col >= 0 && pos.col < 9);
        
        for (const neighbor of neighbors) {
          const adjacentCage = cages.find(cage => 
            cage.cells.some(c => c.row === neighbor.row && c.col === neighbor.col)
          );
          
          if (adjacentCage) {
            // 合併到相鄰 cage
            adjacentCage.cells.push(cell);
            adjacentCage.sum += solvedGrid[row][col];
            break;
          }
        }
      });
    }
    
    // 確保所有格子都被分配到 cage 中
    const usedCells = new Set<string>();
    cages.forEach(cage => {
      cage.cells.forEach(cell => {
        usedCells.add(`${cell.row}-${cell.col}`);
      });
    });
    
    // 如果還有未分配的格子，創建額外的 cage
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (!usedCells.has(`${row}-${col}`)) {
          cages.push({
            id: cages.length,
            cells: [{ row, col }],
            sum: solvedGrid[row][col]
          });
        }
      }
    }
    
    // 地獄難度：不提供任何給定數字
    const grid: Cell[][] = solvedGrid.map(row => 
      row.map(cell => ({
        value: null,
        solution: cell,
        given: false,
      }))
    );
    
    const puzzleId = 'hell-' + Math.random().toString(36).substring(2);
    generatedPuzzles.add(puzzleId);
    
    console.log(`Hell mode generated: ${cages.length} cages, ${cages.filter(c => c.cells.length === 1).length} single cages`);
    
    return { grid, cages, puzzleId };
  } catch (error) {
    console.error('Error generating hell difficulty sudoku:', error);
    
    // 回退方案 - 生成一個完整的數獨
    const solvedGrid = generateRandomSolvedGrid();
    const cages = generateCages(solvedGrid);
    
    const grid: Cell[][] = solvedGrid.map(row => 
      row.map(cell => ({
        value: null,
        solution: cell,
        given: false,
      }))
    );
    
    return { 
      grid, 
      cages, 
      puzzleId: 'hell-fallback-' + Math.random().toString(36).substring(2)
    };
  }
}

// 多巴胺模式保底計數器
let dopaminePityCounter = 0;
const PITY_THRESHOLD = 20; // 20次保底

/**
 * 生成多巴胺模式數獨
 */
export function generateDopamineSudoku(): { data: KillerSudokuData; difficulty: DopamineDifficulty } {
  // 增加保底計數器
  dopaminePityCounter++;
  
  // 檢查是否觸發保底機制
  const isPityTriggered = dopaminePityCounter >= PITY_THRESHOLD;
  
  let difficulty: DopamineDifficulty;
  
  if (isPityTriggered) {
    // 保底觸發，必定生成地獄模式
    difficulty = 'hell';
    dopaminePityCounter = 0; // 重置計數器
  } else {
    // 正常隨機生成，調整機率分佈
    const random = Math.random();
    
    if (random < 0.15) {
      difficulty = 'easy';      // 15% - 降低簡單機率
    } else if (random < 0.35) {
      difficulty = 'medium';    // 20% - 降低中等機率
    } else if (random < 0.60) {
      difficulty = 'hard';      // 25% - 降低困難機率
    } else if (random < 0.80) {
      difficulty = 'expert';    // 20% - 提高專家機率
    } else {
      difficulty = 'hell';      // 20% - 提高地獄機率（非保底）
      dopaminePityCounter = 0; // 如果隨機抽到地獄，也重置計數器
    }
  }
  
  let data: KillerSudokuData;
  
  if (difficulty === 'hell') {
    data = generateHellDifficultySudoku();
  } else {
    data = generateKillerSudoku(difficulty as Difficulty);
  }
  
  return { data, difficulty };
}

// 獲取已生成題目數量（用於調試）
export function getGeneratedPuzzleCount(): number {
  return generatedPuzzles.size;
}

// 獲取多巴胺模式保底計數器狀態
export function getDopaminePityStatus(): { counter: number; threshold: number; remaining: number } {
  return {
    counter: dopaminePityCounter,
    threshold: PITY_THRESHOLD,
    remaining: Math.max(0, PITY_THRESHOLD - dopaminePityCounter)
  };
}

// 清除已生成題目記錄（用於測試）
export function clearGeneratedPuzzles(): void {
  generatedPuzzles.clear();
}
