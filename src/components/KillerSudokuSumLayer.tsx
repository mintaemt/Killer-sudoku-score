import { Cell, Cage } from "@/lib/sudoku-generator";
import { cn } from "@/lib/utils";

interface KillerSudokuSumLayerProps {
    grid: Cell[][];
    cages: Cage[];
    selectedCell: { row: number; col: number } | null;
}

export const KillerSudokuSumLayer = ({ grid, cages, selectedCell }: KillerSudokuSumLayerProps) => {
    // Inset matching the Border Layer (adjusted to 1.5px for precision positioning)
    const inset = "1.5px";

    /**
     * Helper to determine background color for a specific cell.
     * Matches logic in KillerSudokuGrid.tsx exactly.
     */
    const getCellBgColor = (row: number, col: number) => {
        const cell = grid[row][col];

        // Check Selection
        const isSel = selectedCell?.row === row && selectedCell?.col === col;

        // Check Highlight
        let isHigh = false;
        if (selectedCell && !isSel) {
            isHigh = (
                selectedCell.row === row ||
                selectedCell.col === col ||
                (Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
                    Math.floor(selectedCell.col / 3) === Math.floor(col / 3))
            );
        }

        return cn(
            cell.given ? "bg-[hsl(var(--cell-given))]" : "bg-[hsl(var(--cell-bg))]",
            isSel && "bg-[hsl(var(--cell-selected))]",
            isHigh && "bg-[hsl(var(--cell-highlighted))]",
            cell.isError && "bg-[hsl(var(--cell-error))]"
        );
    };

    return (
        <div className="absolute inset-0 pointer-events-none z-30 grid grid-cols-9 grid-rows-9">
            {cages.map((cage) => {
                // Find top-left cell of the cage
                const sorted = [...cage.cells].sort((a, b) => {
                    if (a.row !== b.row) return a.row - b.row;
                    return a.col - b.col;
                });
                const first = sorted[0];
                const { row, col } = first;

                // Dynamic background for mask
                const cellBgColor = getCellBgColor(row, col);

                return (
                    <div
                        key={`cage-sum-${cage.id}`}
                        className="relative w-full h-full"
                        style={{
                            gridColumn: col + 1,
                            gridRow: row + 1,
                        }}
                    >
                        <div
                            className={cn(
                                "absolute leading-none font-semibold text-[8px] md:text-[10px] select-none rounded-br-[4px] flex items-center justify-center",
                                "text-[hsl(var(--cage-sum))]",
                                cellBgColor
                            )}
                            style={{
                                top: inset,
                                left: inset,
                                padding: '0 1px',
                                minWidth: '12px',
                            }}
                        >
                            {cage.sum}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
