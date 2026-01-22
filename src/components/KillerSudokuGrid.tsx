import { KillerSudokuBorderLayer } from "@/components/KillerSudokuBorderLayer";
import { KillerSudokuSumLayer } from "@/components/KillerSudokuSumLayer";

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
      <div className="aspect-square w-full h-full relative">
        <div className="grid grid-cols-9 gap-0 bg-background shadow-apple-md relative h-full w-full border-2 md:border-[3px] border-foreground/40">
          {/* DOM Border Layer nested inside Grid Container for perfect alignment (inside borders) */}
          <KillerSudokuBorderLayer cages={cages} />
          <KillerSudokuSumLayer grid={grid} cages={cages} selectedCell={selectedCell} />

          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              // Calculate dynamic background color to ensure sum mask matches cell perfectly
              const cellBgColor = cn(
                cell.given ? "bg-[hsl(var(--cell-given))]" : "bg-[hsl(var(--cell-bg))]",
                isSelected(rowIndex, colIndex) && "bg-[hsl(var(--cell-selected))]",
                !isSelected(rowIndex, colIndex) && isHighlighted(rowIndex, colIndex) && "bg-[hsl(var(--cell-highlighted))]",
                cell.isError && "bg-[hsl(var(--cell-error))]"
              );

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => onCellSelect({ row: rowIndex, col: colIndex })}
                  className={cn(
                    "aspect-square relative cursor-pointer transition-smooth",
                    "flex items-center justify-center text-2xl font-medium",
                    // Apply background
                    cellBgColor,
                    // Selection ring and z-index (separate from bg)
                    isSelected(rowIndex, colIndex) && "ring-2 ring-primary z-20",
                    // Text color
                    cell.isError ? "text-destructive" : (cell.given ? "text-foreground font-semibold" : "text-primary"),
                    // Thick borders for 3x3 boxes
                    rowIndex % 3 === 0 && rowIndex !== 0 && "border-t md:border-t-[1.5px] border-t-foreground/25",
                    colIndex % 3 === 0 && colIndex !== 0 && "border-l md:border-l-[1.5px] border-l-foreground/25",
                    rowIndex % 3 === 2 && rowIndex !== 8 && "border-b md:border-b-[1.5px] border-b-foreground/25",
                    colIndex % 3 === 2 && colIndex !== 8 && "border-r md:border-r-[1.5px] border-r-foreground/25",
                    // Light borders
                    !(rowIndex % 3 === 0 || rowIndex === 0) && "border-t border-t-border/30",
                    !(colIndex % 3 === 0 || colIndex === 0) && "border-l border-l-border/30",
                    rowIndex !== 8 && !(rowIndex % 3 === 2) && "border-b border-b-border/30",
                    colIndex !== 8 && !(colIndex % 3 === 2) && "border-r border-r-border/30"
                  )}
                >

                  {/* 主要數字顯示 */}
                  {cell.value && (
                    <span className={cn(
                      "select-none relative z-40",
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
