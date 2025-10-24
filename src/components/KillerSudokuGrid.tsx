/**
 * Killer Sudoku 遊戲盤面組件
 * 渲染 9x9 數獨網格，包含 cage 邊框、總和提示與候選數字
 */

import { Cell, Cage } from "@/lib/sudoku-generator";
import { cn } from "@/lib/utils";

/**
 * 組件 Props 介面
 */
interface KillerSudokuGridProps {
  grid: Cell[][];                                        // 9x9 遊戲格子陣列
  cages: Cage[];                                         // Cage 配置列表
  selectedCell: { row: number; col: number } | null;     // 當前選中的格子
  onCellSelect: (cell: { row: number; col: number }) => void;  // 格子選擇回調
}

/**
 * Killer Sudoku 遊戲盤面組件
 */
export const KillerSudokuGrid = ({
  grid,
  cages,
  selectedCell,
  onCellSelect,
}: KillerSudokuGridProps) => {
  /**
   * 查找格子所屬的 cage
   * @param row 行索引
   * @param col 列索引
   * @returns 格子所屬的 cage（如果存在）
   */
  const getCageForCell = (row: number, col: number): Cage | undefined => {
    return cages.find((cage) =>
      cage.cells.some((c) => c.row === row && c.col === col)
    );
  };

  /**
   * 檢查格子是否為 cage 中的第一個格子（用於顯示總和）
   * @param row 行索引
   * @param col 列索引
   * @param cage 目標 cage
   * @returns 是否為第一個格子
   */
  const isFirstInCage = (row: number, col: number, cage: Cage): boolean => {
    const sorted = [...cage.cells].sort((a, b) => {
      if (a.row !== b.row) return a.row - b.row;
      return a.col - b.col;
    });
    return sorted[0].row === row && sorted[0].col === col;
  };

  /**
   * 獲取 cage 邊框樣式
   * @param row 行索引
   * @param col 列索引
   * @param cage 目標 cage
   * @returns 邊框配置物件
   */
  const getCageBorders = (row: number, col: number, cage: Cage) => {
    const isInCage = (r: number, c: number): boolean =>
      cage.cells.some((cell) => cell.row === r && cell.col === c);

    return {
      top: !isInCage(row - 1, col),
      right: !isInCage(row, col + 1),
      bottom: !isInCage(row + 1, col),
      left: !isInCage(row, col - 1),
    };
  };

  /**
   * 檢查格子是否被選中
   */
  const isSelected = (row: number, col: number): boolean =>
    selectedCell?.row === row && selectedCell?.col === col;

  /**
   * 檢查格子是否應該高亮顯示（同行、同列或同宮格）
   */
  const isHighlighted = (row: number, col: number): boolean => {
    if (!selectedCell) return false;
    return (
      selectedCell.row === row ||
      selectedCell.col === col ||
      (Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
        Math.floor(selectedCell.col / 3) === Math.floor(col / 3))
    );
  };

  return (
    <div className="glass rounded-2xl p-3 md:p-6 shadow-apple-lg relative z-0 h-full w-full">
      <div className="aspect-square w-full h-full">
        <div className="grid grid-cols-9 gap-0 bg-background shadow-apple-md relative h-full w-full border-2 md:border-[3px] border-foreground/40">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const cage = getCageForCell(rowIndex, colIndex);
              const borders = cage ? getCageBorders(rowIndex, colIndex, cage) : null;
              const showSum = cage ? isFirstInCage(rowIndex, colIndex, cage) : false;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => onCellSelect({ row: rowIndex, col: colIndex })}
                  className={cn(
                    "aspect-square relative cursor-pointer transition-smooth",
                    "flex items-center justify-center text-2xl font-medium",
                    // Base background
                    cell.given ? "bg-[hsl(var(--cell-given))]" : "bg-[hsl(var(--cell-bg))]",
                    // Selection states
                    isSelected(rowIndex, colIndex) && "bg-[hsl(var(--cell-selected))] ring-2 ring-primary z-10",
                    !isSelected(rowIndex, colIndex) && isHighlighted(rowIndex, colIndex) && "bg-[hsl(var(--cell-highlighted))]",
                    // Error state
                    cell.isError && "bg-[hsl(var(--cell-error))] text-destructive",
                    // Text color
                    cell.given && "text-foreground font-semibold",
                    !cell.given && "text-primary",
                    // Thick borders for 3x3 boxes (1px mobile, 1.5px desktop each, 2px total when overlapping) - skip outer edges as they're handled by the outer frame
                    rowIndex % 3 === 0 && rowIndex !== 0 && "border-t md:border-t-[1.5px] border-t-foreground/25",
                    colIndex % 3 === 0 && colIndex !== 0 && "border-l md:border-l-[1.5px] border-l-foreground/25",
                    rowIndex % 3 === 2 && rowIndex !== 8 && "border-b md:border-b-[1.5px] border-b-foreground/25",
                    colIndex % 3 === 2 && colIndex !== 8 && "border-r md:border-r-[1.5px] border-r-foreground/25",
                    // Light borders only where there's no 3x3 border
                    !(rowIndex % 3 === 0 || rowIndex === 0) && "border-t border-t-border/30",
                    !(colIndex % 3 === 0 || colIndex === 0) && "border-l border-l-border/30",
                    rowIndex !== 8 && !(rowIndex % 3 === 2) && "border-b border-b-border/30",
                    colIndex !== 8 && !(colIndex % 3 === 2) && "border-r border-r-border/30"
                  )}
                >
                  {/* Cage borders - inset with higher z-index */}
                  {borders && (
                    <div 
                      className={cn(
                        "absolute inset-[1.5px] pointer-events-none z-20",
                        // iOS Safari 修復：確保邊框正確渲染
                        "transform-gpu",
                        // iOS Safari 邊框渲染修復
                        "will-change-transform",
                        "backface-visibility-hidden",
                        borders.top && "border-t border-t-foreground/80 border-dashed md:border-t-[1.5px]",
                        borders.right && "border-r border-r-foreground/80 border-dashed md:border-r-[1.5px]",
                        borders.bottom && "border-b border-b-foreground/80 border-dashed md:border-b-[1.5px]",
                        borders.left && "border-l border-l-foreground/80 border-dashed md:border-l-[1.5px]"
                      )}
                    />
                  )}
                  
                  {showSum && cage && (
                    <div className="absolute top-0.5 left-0.5 text-[10px] md:text-xs text-[hsl(var(--cage-sum))] font-semibold z-30 leading-none">
                      {cage.sum}
                    </div>
                  )}
                  
                  {/* 主要數字顯示 */}
                  {cell.value && (
                    <span className={cn(
                      "select-none",
                      cell.given ? "text-foreground font-semibold" : "text-primary font-medium"
                    )}>{cell.value}</span>
                  )}
                  
                  {/* 候選數字顯示 */}
                  {cell.candidates && cell.candidates.length > 0 && (
                    <div className="absolute bottom-0.5 right-0.5 text-[8px] md:text-[10px] text-red-500 font-medium z-30 leading-none">
                      {cell.candidates.sort((a, b) => a - b).join('')}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
      
      {/* Dark mode blur effect for bottom border */}
      <div className="absolute inset-0 pointer-events-none z-40 dark:block hidden">
        <div className="absolute bottom-0 left-0 right-0 h-[0.5rem] bg-gradient-to-t from-black/30 to-transparent blur-[0.5rem]"></div>
      </div>
    </div>
  );
};
