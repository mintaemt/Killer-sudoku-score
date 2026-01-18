import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

export const DopamineFluidBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();

    // 只在 Dark Mode 顯示
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    useEffect(() => {
        if (!isDark || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        // 設定 Canvas 尺寸
        const resizeObserver = new ResizeObserver(() => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        });
        resizeObserver.observe(canvas);

        // 光源物件 (Blobs)
        // 顏色配置：Cyan (#00F3FF), Magenta (#FF00FF), Blue (#3B82F6)
        const blobs = [
            { x: Math.random() * width, y: Math.random() * height, vx: 0.5, vy: 0.5, r: 300, color: 'rgba(0, 243, 255, 0.4)' }, // Cyan
            { x: Math.random() * width, y: Math.random() * height, vx: -0.5, vy: 0.3, r: 350, color: 'rgba(255, 0, 255, 0.3)' }, // Magenta
            { x: Math.random() * width, y: Math.random() * height, vx: 0.3, vy: -0.5, r: 400, color: 'rgba(59, 130, 246, 0.4)' }, // Blue
            { x: width / 2, y: height / 2, vx: 0, vy: 0, r: 250, color: 'rgba(255, 255, 255, 0.15)' }, // Mouse Follower (White/Highlight)
        ];

        // 滑鼠互動
        let mouseX = width / 2;
        let mouseY = height / 2;

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            // 黑色背景
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, width, height);

            // 更新與繪製每個 Blob
            blobs.forEach((blob, index) => {
                // 最後一個 Blob 跟隨滑鼠
                if (index === blobs.length - 1) {
                    blob.x += (mouseX - blob.x) * 0.05;
                    blob.y += (mouseY - blob.y) * 0.05;
                } else {
                    // 自動漂浮
                    blob.x += blob.vx;
                    blob.y += blob.vy;

                    // 邊界反彈
                    if (blob.x < -100 || blob.x > width + 100) blob.vx *= -1;
                    if (blob.y < -100 || blob.y > height + 100) blob.vy *= -1;
                }

                // 繪製漸層圓
                const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
                gradient.addColorStop(0, blob.color);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
        };
    }, [isDark]);

    if (!isDark) return null;

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ filter: 'blur(80px)' }} // 強烈模糊創造流體感
            />
            {/* 噪點遮罩 (Noise Overlay) */}
            <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />
        </div>
    );
};
