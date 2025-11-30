import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { AnimatedGradientBackground } from '@/components/AnimatedGradientBackground';

interface ContentPageLayoutProps {
  title: string;
  lastUpdated?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  seoTitle: string;
  seoDescription: string;
}

export const ContentPageLayout: React.FC<ContentPageLayoutProps> = ({
  title,
  lastUpdated,
  icon,
  children,
  seoTitle,
  seoDescription,
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    document.title = seoTitle;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', seoDescription);
    }
  }, [seoTitle, seoDescription]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <AnimatedGradientBackground isDopamineMode={false} />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10 animate-fade-in">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="w-fit flex items-center gap-2 hover:bg-background/20 hover:text-primary transition-colors duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Button>
          
          <div className="flex items-center gap-4">
            {icon && (
              <div className="p-3 rounded-xl bg-primary/10 backdrop-blur-md border border-primary/20 shadow-lg">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                {title}
              </h1>
              {lastUpdated && (
                <p className="text-sm text-muted-foreground mt-1 font-medium">
                  {lastUpdated}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="backdrop-blur-xl bg-background/40 border border-white/10 rounded-2xl shadow-2xl p-6 md:p-10 animate-scale-in">
          <div className="prose prose-invert max-w-none">
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
