
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CustomTooltipProps {
    content: string;
    children: React.ReactNode;
    side?: "top" | "bottom" | "left" | "right";
    variant?: "minimal" | "glass" | "themed";
    className?: string; // Allow custom styles for content
}

export function CustomTooltip({
    content,
    children,
    side = "bottom",
    variant = "glass",
    className,
}: CustomTooltipProps) {

    // Variant styles
    const variants = {
        minimal: "bg-zinc-900 text-white border-zinc-800",
        glass: "bg-background/60 backdrop-blur-md border border-border/50 shadow-xl", // Glassmorphism
        themed: "bg-background/90 border-2 border-[var(--theme-color)] shadow-[0_0_10px_var(--theme-color)] text-foreground",
    };

    return (
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent
                    side={side}
                    className={cn(
                        "text-xs px-3 py-1.5 rounded-md transition-all duration-200",
                        variants[variant],
                        className
                    )}
                >
                    {content}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
