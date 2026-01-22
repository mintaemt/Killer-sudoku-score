import { useMemo } from "react";
import { Cage } from "@/lib/sudoku-generator";
import { getCageBorderSegments } from "@/services/cage-border-service";

interface KillerSudokuBorderLayerProps {
    cages: Cage[];
}

export const KillerSudokuBorderLayer = ({ cages }: KillerSudokuBorderLayerProps) => {
    // Generate segments from service
    const segments = useMemo(() => getCageBorderSegments(cages), [cages]);

    const inset = "3px";
    const borderWidth = "var(--cage-border-width)";

    return (
        <div className="absolute inset-0 pointer-events-none z-20 grid grid-cols-9 grid-rows-9">
            {segments.map((segment) => {
                // We render each segment in its grid cell(s)
                // Since segments span, we use gridColumn / gridRow

                const gridStyle: React.CSSProperties = {
                    gridColumnStart: segment.col + 1,
                    gridRowStart: segment.row + 1,
                    // position relative wrapper
                    position: 'relative',
                };

                // Type assertion for TS (since we updated service but interface might lag in thought context)
                // In reality file is updated.
                const side = (segment as any).side;

                if (segment.type === 'horizontal') {
                    gridStyle.gridColumnEnd = `span ${segment.span}`;
                } else {
                    gridStyle.gridRowEnd = `span ${segment.span}`;
                }

                // Inner style for the dashed line using CSS Gradient
                // This fixes iOS/WebKit rendering issues with sub-pixel dashed borders
                const innerStyle: React.CSSProperties = {
                    position: 'absolute',
                    // Default Insets
                    top: 0, left: 0, right: 0, bottom: 0,
                    // Gradient settings
                    backgroundRepeat: segment.type === 'horizontal' ? 'repeat-x' : 'repeat-y',
                };

                const dashColor = 'hsl(var(--cage-border))';
                const dashPattern = `linear-gradient(${segment.type === 'horizontal' ? 'to right' : 'to bottom'}, ${dashColor} 50%, transparent 50%)`;
                const dashSize = segment.type === 'horizontal' ? '6px 100%' : '100% 6px'; // 3px dash, 3px gap

                innerStyle.backgroundImage = dashPattern;
                innerStyle.backgroundSize = dashSize;

                // Orientation specific
                if (segment.type === 'horizontal') {
                    if (side === 'bottom') {
                        innerStyle.bottom = inset;
                        innerStyle.top = 'auto';
                        innerStyle.height = borderWidth;
                        innerStyle.left = segment.startExtended ? `calc(-1 * ${inset})` : inset;
                        innerStyle.right = segment.endExtended ? `calc(-1 * ${inset})` : inset;
                        if (segment.startShortened) innerStyle.left = inset;
                        if (segment.endShortened) innerStyle.right = inset;
                    } else {
                        // TOP
                        innerStyle.top = inset;
                        innerStyle.bottom = 'auto';
                        innerStyle.height = borderWidth;
                        innerStyle.left = segment.startExtended ? `calc(-1 * ${inset})` : inset;
                        innerStyle.right = segment.endExtended ? `calc(-1 * ${inset})` : inset;
                    }
                } else {
                    // Vertical
                    if (side === 'right') {
                        innerStyle.right = inset;
                        innerStyle.left = 'auto';
                        innerStyle.width = borderWidth;
                        innerStyle.top = segment.startExtended ? `calc(-1 * ${inset})` : inset;
                        innerStyle.bottom = segment.endExtended ? `calc(-1 * ${inset})` : inset;
                        if (segment.startShortened) innerStyle.top = inset;
                        if (segment.endShortened) innerStyle.bottom = inset;
                    } else {
                        // LEFT
                        innerStyle.left = inset;
                        innerStyle.right = 'auto';
                        innerStyle.width = borderWidth;
                        innerStyle.top = segment.startExtended ? `calc(-1 * ${inset})` : inset;
                        innerStyle.bottom = segment.endExtended ? `calc(-1 * ${inset})` : inset;
                    }
                }

                return (
                    <div key={segment.id} style={gridStyle}>
                        <div style={innerStyle} />
                    </div>
                );
            })}
        </div>
    );
};
