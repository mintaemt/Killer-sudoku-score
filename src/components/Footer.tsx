import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Github } from 'lucide-react';

export const Footer: React.FC = () => {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-6 bg-background/20 backdrop-blur-sm border-t border-white/5">
            <div className="max-w-6xl mx-auto px-4">
                {/* Desktop Layout */}
                <div className="hidden md:flex items-center justify-center text-sm">
                    {/* Copyright */}
                    <div className="text-muted-foreground/50 mr-6">
                        © {currentYear} mintae. All rights reserved.
                    </div>

                    {/* Links */}
                    <div className="flex items-center space-x-4 text-muted-foreground/60">
                        <Link to="/about" className="hover:text-primary transition-colors">{t('footer.about')}</Link>
                        <span>•</span>
                        <Link to="/how-to-play" className="hover:text-primary transition-colors">{t('footer.howToPlay')}</Link>
                        <span>•</span>
                        <Link to="/strategy" className="hover:text-primary transition-colors">{t('footer.strategy')}</Link>
                        <span>•</span>
                        <Link to="/terms-of-service" className="hover:text-primary transition-colors">{t('footer.terms')}</Link>
                        <span>•</span>
                        <Link to="/privacy-policy" className="hover:text-primary transition-colors">{t('footer.privacy')}</Link>
                        <span>•</span>
                        <Link to="/cookie-policy" className="hover:text-primary transition-colors">{t('footer.cookies')}</Link>
                        <span>•</span>
                        <Link to="/contact" className="hover:text-primary transition-colors">{t('footer.contact')}</Link>
                    </div>

                    {/* GitHub */}
                    <div className="ml-6">
                        <a
                            href="https://github.com/mintaemt/Killer-sudoku-score"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground/60 hover:text-primary transition-colors"
                            title={t('githubRepository')}
                        >
                            <Github className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="block md:hidden space-y-4">
                    {/* Links Grid */}
                    <div className="grid grid-cols-3 gap-2 text-xs text-center text-muted-foreground/60">
                        <Link to="/about" className="hover:text-primary transition-colors">{t('footer.about')}</Link>
                        <Link to="/how-to-play" className="hover:text-primary transition-colors">{t('footer.howToPlay')}</Link>
                        <Link to="/strategy" className="hover:text-primary transition-colors">{t('footer.strategy')}</Link>
                        <Link to="/terms-of-service" className="hover:text-primary transition-colors">{t('footer.terms')}</Link>
                        <Link to="/privacy-policy" className="hover:text-primary transition-colors">{t('footer.privacy')}</Link>
                        <Link to="/cookie-policy" className="hover:text-primary transition-colors">{t('footer.cookies')}</Link>
                        <Link to="/contact" className="col-span-3 hover:text-primary transition-colors">{t('footer.contact')}</Link>
                    </div>

                    {/* Copyright & GitHub */}
                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/50">
                        <span>© {currentYear} mintae. All rights reserved.</span>
                        <a
                            href="https://github.com/mintaemt/Killer-sudoku-score"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground/60 hover:text-primary transition-colors"
                            title={t('githubRepository')}
                        >
                            <Github className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
