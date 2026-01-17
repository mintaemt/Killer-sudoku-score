import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

// Minimalist Cat SVG Component
const CatSVG = ({ className, isDark }: { className?: string, isDark: boolean }) => {
    // Simple sitting cat silhouette
    return (
        <svg
            viewBox="0 0 100 100"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: 'visible' }}
        >
            {/* Body */}
            <motion.path
                d="M30 70 
           Q20 70 20 60 
           L20 40 
           Q20 30 30 25 
           L35 25 
           L30 15 
           L40 20 
           L50 20 
           L60 15 
           L55 25 
           L60 25 
           Q70 30 70 40 
           L70 60
           Q70 70 60 70 
           Z"
                fill="currentColor"
                // Simple breathing animation
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Tail - Waving */}
            <motion.path
                d="M60 65 Q80 65 85 50"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                initial={{ d: "M60 65 Q80 65 85 50" }}
                animate={{ d: ["M60 65 Q80 65 85 50", "M60 65 Q85 70 90 45", "M60 65 Q80 65 85 50"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Eyes */}
            <g className={isDark ? "fill-yellow-300" : "fill-yellow-400"}>
                <ellipse cx="38" cy="35" rx="3" ry="4" />
                <ellipse cx="52" cy="35" rx="3" ry="4" />
            </g>
        </svg>
    );
};

export const CatOverlay = () => {
    const { theme, resolvedTheme } = useTheme();
    const location = useLocation();

    // Position state: Currently hardcoded to sit on Header for Phase 1
    // We want it to be positioned relative to the viewport top initially
    // Standard Header height is around ~64px-80px.
    // Let's position it absolute at top right for now, sitting on the "Game Rules" button row?
    // Or center? User said "Header".

    // We will use fixed positioning to overlay everything.
    // pointer-events-none ensures we don't block clicks (except on the cat itself if we want interaction).

    const isDark = resolvedTheme === 'dark';

    return (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
            <motion.div
                className="absolute"
                initial={{ x: '50vw', y: '50px', opacity: 0 }}
                animate={{ x: '60vw', y: '65px', opacity: 1 }} // Approximate position on header
                transition={{ duration: 1, delay: 0.5 }}
                style={{ width: 48, height: 48 }}
            >
                <CatSVG
                    className={cn(
                        "w-full h-full drop-shadow-md",
                        isDark ? "text-white/90 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" : "text-gray-900"
                    )}
                    isDark={isDark}
                />
            </motion.div>
        </div>
    );
};
