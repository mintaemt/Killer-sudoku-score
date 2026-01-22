import { Cage } from "@/lib/sudoku-generator";

export interface BorderSegment {
    id: string;
    type: 'horizontal' | 'vertical'; // Orientation
    row: number; // Grid row (0-8)
    col: number; // Grid col (0-8)
    span: number; // How many cells this segment spans

    side: 'top' | 'bottom' | 'left' | 'right';

    // Inset Control (for connecting corners)
    startExtended: boolean; // True if segment should extended at start (concave corner)
    endExtended: boolean; // True if segment should extended at end (concave corner)
    startShortened: boolean; // True if segment should be shortened at start (convex corner)
    endShortened: boolean; // True if segment should be shortened at end (convex corner)
}

/**
 * Generates optimized border segments for a list of cages.
 * Merges collinear edges into single segments.
 * Calculates corner connectivity (extend/shorten) for perfect L-shapes.
 */
export const getCageBorderSegments = (cages: Cage[]): BorderSegment[] => {
    const segments: BorderSegment[] = [];

    cages.forEach((cage) => {
        const cageCells = new Set(cage.cells.map((c) => `${c.row},${c.col}`));

        // 1. Identify Raw Edges
        const tops: { r: number; c: number; side: 'top' }[] = [];
        const bottoms: { r: number; c: number; side: 'bottom' }[] = [];
        const lefts: { r: number; c: number; side: 'left' }[] = [];
        const rights: { r: number; c: number; side: 'right' }[] = [];

        cage.cells.forEach(({ row, col }) => {
            if (!cageCells.has(`${row - 1},${col}`)) tops.push({ r: row, c: col, side: 'top' });
            if (!cageCells.has(`${row + 1},${col}`)) bottoms.push({ r: row, c: col, side: 'bottom' });
            if (!cageCells.has(`${row},${col - 1}`)) lefts.push({ r: row, c: col, side: 'left' });
            if (!cageCells.has(`${row},${col + 1}`)) rights.push({ r: row, c: col, side: 'right' });
        });

        // Helper to merge continuous sequences
        const merge = (
            items: { r: number; c: number; side: 'top' | 'bottom' | 'left' | 'right' }[],
            orientation: 'horizontal' | 'vertical'
        ) => {
            if (items.length === 0) return;

            // Sort: Primary axis (Row for H, Col for V), then secondary (Col for H, Row for V)
            items.sort((a, b) => {
                if (orientation === 'horizontal') {
                    if (a.r !== b.r) return a.r - b.r;
                    return a.c - b.c;
                } else {
                    if (a.c !== b.c) return a.c - b.c;
                    return a.r - b.r;
                }
            });

            let currentStart = items[0];
            let length = 1;

            for (let i = 1; i < items.length; i++) {
                const current = items[i];
                const prev = items[i - 1];

                const isContinuous =
                    orientation === 'horizontal'
                        ? current.r === prev.r && current.c === prev.c + 1 && current.side === prev.side
                        : current.c === prev.c && current.r === prev.r + 1 && current.side === prev.side;

                if (isContinuous) {
                    length++;
                } else {
                    // Finalize previous segment
                    pushSegment(cageCells, cage.id, currentStart, length, orientation, segments);

                    currentStart = current;
                    length = 1;
                }
            }
            // Push last one
            pushSegment(cageCells, cage.id, currentStart, length, orientation, segments);
        };

        merge(tops, 'horizontal');
        merge(bottoms, 'horizontal');
        merge(lefts, 'vertical');
        merge(rights, 'vertical');
    });

    return segments;
};

// Helper to push a segment with computed logic
function pushSegment(
    cageCells: Set<string>,
    cageId: number,
    start: { r: number; c: number; side: 'top' | 'bottom' | 'left' | 'right' },
    length: number,
    orientation: 'horizontal' | 'vertical',
    segments: BorderSegment[]
) {
    const { r, c, side } = start;
    const rEnd = orientation === 'vertical' ? r + length - 1 : r;
    const cEnd = orientation === 'horizontal' ? c + length - 1 : c;

    // Determine Logic
    let startExtended = false;
    let endExtended = false;
    let startShortened = false;
    let endShortened = false;

    // --- Extend Logic (Concave Corners) ---
    // If adjacent cell (in extension direction) is IN the cage, we extend to meet it.

    if (orientation === 'horizontal') {
        // Horizontal (Top/Bottom)
        // Check Left (c-1)
        if (cageCells.has(`${r},${c - 1}`)) startExtended = true;
        // Check Right (cEnd+1)
        if (cageCells.has(`${rEnd},${cEnd + 1}`)) endExtended = true;
    } else {
        // Vertical (Left/Right)
        // Check Top (r-1)
        if (cageCells.has(`${r - 1},${c}`)) startExtended = true;
        // Check Bottom (rEnd+1)
        if (cageCells.has(`${rEnd + 1},${cEnd}`)) endExtended = true;
    }

    // --- Shorten Logic (Convex Corners) ---
    // If NOT extending, we check if we share a corner with another border of the SAME cage.
    // E.g. Top Border and Left Border meeting at Top-Left Corner.
    // If we have Top Border at (r,c), then (r-1, c) is OUT.
    // If we have Left Border at (r,c), then (r, c-1) is OUT.
    // If both are true, we have a Convex Corner at Top-Left of (r,c).
    // To prevent messy overlap of dashed lines, we can shorten.
    // But standard dashed lines might look fine overlapping. 
    // Let's implement flags, Component decides rendering.

    if (orientation === 'horizontal') {
        if (!startExtended) {
            // Check Start Corner
            if (side === 'top' && !cageCells.has(`${r},${c - 1}`)) {
                // Top-Left Corner of cell (r,c). Is there a Left border?
                // Left Border exists if (r, c-1) is OUT. Yes.
                // So both Top and Left borders exist. Overlap.
                startShortened = true;
            }
            if (side === 'bottom' && !cageCells.has(`${r},${c - 1}`)) {
                // Bottom-Left Corner of cell (r,c). Is there a Left border?
                // Left Border exists if (r, c-1) is OUT. Yes.
                startShortened = true;
            }
        }
        if (!endExtended) {
            if (side === 'top' && !cageCells.has(`${r},${cEnd + 1}`)) endShortened = true;
            if (side === 'bottom' && !cageCells.has(`${r},${cEnd + 1}`)) endShortened = true;
        }
    } else {
        // Vertical
        if (!startExtended) {
            if (side === 'left' && !cageCells.has(`${r - 1},${c}`)) startShortened = true;
            if (side === 'right' && !cageCells.has(`${r - 1},${c}`)) startShortened = true;
        }
        if (!endExtended) {
            if (side === 'left' && !cageCells.has(`${rEnd + 1},${c}`)) endShortened = true;
            if (side === 'right' && !cageCells.has(`${rEnd + 1},${c}`)) endShortened = true;
        }
    }

    segments.push({
        id: `seg-${cageId}-${side}-${r}-${c}`,
        type: orientation,
        row: r,
        col: c,
        span: length,
        side,
        startExtended,
        endExtended,
        startShortened,
        endShortened
    });
}
