import { Cell, Cage } from "@/lib/sudoku-generator";
import { cn } from "@/lib/utils";

interface KillerSudokuGridProps {
  grid: Cell[][];
  cages: Cage[];
  selectedCell: { row: number; col: number } | null;
  onCellSelect: (cell: { row: number; col: number }) => void;
}

export const KillerSudokuGrid = ({
  grid,
  cages,
  selectedCell,
  onCellSelect,
}: KillerSudokuGridProps) => {
  // Find which cage a cell belongs to
  const getCageForCell = (row: number, col: number) => {
    return cages.find((cage) =>
      cage.cells.some((c) => c.row === row && c.col === col)
    );
  };

  // Check if cell is first in cage (for sum display)
  const isFirstInCage = (row: number, col: number, cage: Cage) => {
    const sorted = [...cage.cells].sort((a, b) => {
      if (a.row !== b.row) return a.row - b.row;
      return a.col - b.col;
    });
    return sorted[0].row === row && sorted[0].col === col;
  };

  // Get cage border styles
  const getCageBorders = (row: number, col: number, cage: Cage) => {
    const isInCage = (r: number, c: number) =>
      cage.cells.some((cell) => cell.row === r && cell.col === c);

    return {
      top: !isInCage(row - 1, col),
      right: !isInCage(row, col + 1),
      bottom: !isInCage(row + 1, col),
      left: !isInCage(row, col - 1),
    };
  };

  const isSelected = (row: number, col: number) =>
    selectedCell?.row === row && selectedCell?.col === col;

  const isHighlighted = (row: number, col: number) => {
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
                    // Thick borders for 3x3 boxes (2px dark) - skip outer edges as they're handled by the outer frame
                    rowIndex % 3 === 0 && rowIndex !== 0 && "border-t-2 border-t-foreground/40",
                    colIndex % 3 === 0 && colIndex !== 0 && "border-l-2 border-l-foreground/40",
                    rowIndex % 3 === 2 && rowIndex !== 8 && "border-b-2 border-b-foreground/40",
                    colIndex % 3 === 2 && colIndex !== 8 && "border-r-2 border-r-foreground/40",
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
                        borders.top && "border-t border-t-[hsl(var(--cage-border))] border-dashed md:border-t-2",
                        borders.right && "border-r border-r-[hsl(var(--cage-border))] border-dashed md:border-r-2",
                        borders.bottom && "border-b border-b-[hsl(var(--cage-border))] border-dashed md:border-b-2",
                        borders.left && "border-l border-l-[hsl(var(--cage-border))] border-dashed md:border-l-2"
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
                    <span className="select-none">{cell.value}</span>
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
