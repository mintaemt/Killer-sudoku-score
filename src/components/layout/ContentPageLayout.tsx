import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { AnimatedGradientBackground } from '@/components/AnimatedGradientBackground';
import { cn } from '@/lib/utils';

interface ContentPageLayoutProps {
    title: string;
    children: React.ReactNode;
    seoTitle: string;
    seoDescription: string;
}

export const ContentPageLayout: React.FC<ContentPageLayoutProps> = ({
    title,
    children,
    seoTitle,
    seoDescription,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    const lastUpdated = "2025-11-30 (UTC+8)";

    useEffect(() => {
        document.title = seoTitle;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', seoDescription);
        }
    }, [seoTitle, seoDescription]);

    const navLinks = [
        { path: '/about', label: t('footer.about') },
        { path: '/how-to-play', label: t('footer.howToPlay') },
        { path: '/strategy', label: t('footer.strategy') },
        { path: '/terms-of-service', label: t('footer.terms') },
        { path: '/privacy-policy', label: t('footer.privacy') },
        { path: '/cookie-policy', label: t('footer.cookies') },
        { path: '/contact', label: t('footer.contact') },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden bg-background text-foreground">
            {/* Background */}
            <div className="fixed inset-0 z-0">
                <AnimatedGradientBackground isDopamineMode={false} />
            </div>

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
                {/* Header Section */}
                <div className="flex flex-col gap-6 mb-10 animate-fade-in">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors duration-300"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {t('back')}
                        </Button>

                        <div className="text-xs text-muted-foreground font-mono">
                            Last updated: {lastUpdated}
                        </div>
                    </div>

                    <div className="text-center space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-primary">
                            {title}
                        </h1>

                        {/* Sub Navigation */}
                        <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-sm text-muted-foreground/80 border-t border-b border-white/5 py-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={cn(
                                        "hover:text-primary transition-colors px-2 py-1 rounded-md",
                                        location.pathname === link.path && "text-primary bg-primary/10 font-medium"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="backdrop-blur-xl bg-background/40 border border-white/10 rounded-2xl shadow-2xl p-6 md:p-10 animate-scale-in">
                    <div className="prose prose-invert max-w-none prose-headings:text-primary prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-primary/90">
                        {children}
                    </div>
                </div>

                {/* Footer Copyright */}
                <div className="text-center text-sm text-muted-foreground/60 mt-12 pb-4">
                    <p>© 2025 mintae. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};
