import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Mail, Github, Copy, Check, ExternalLink } from 'lucide-react';
import { ContentPageLayout } from '@/components/layout/ContentPageLayout';
import { Button } from '@/components/ui/button';

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const email = 'awesomefree@gmail.com';
  const githubUrl = 'https://github.com/mintaemt/Killer-sudoku-score';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ContentPageLayout
      title={t('legal.contact.title')}
      seoTitle={t('legal.contact.title')}
      seoDescription={t('legal.contact.introduction')}
    >
      <div className="space-y-8">
        <section>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t('legal.contact.introduction')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-primary">{t('legal.contact.waysToContact')}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Email Card */}
            <div className="p-4 rounded-xl bg-background/50 border border-border/50 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="h-5 w-5 text-primary" />
                <h3 className="font-medium text-primary">{t('legal.contact.email')}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3 flex-1">{t('legal.contact.emailContent')}</p>

              {/* Email Copy Section */}
              <div className="flex items-center gap-2 p-3 bg-background/80 rounded-lg border border-primary/20 min-w-0">
                <code className="flex-1 text-sm font-mono text-primary break-all">{email}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyEmail}
                  className="h-8 px-3 hover:bg-primary/10 shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-primary" />
                      <span className="ml-1 text-xs text-primary">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-primary" />
                      <span className="ml-1 text-xs">Copy</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* GitHub Card - Symmetric Design */}
            <div className="p-4 rounded-xl bg-background/50 border border-border/50 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-3">
                <Github className="h-5 w-5 text-primary shrink-0" />
                <h3 className="font-medium text-primary">{t('legal.contact.github')}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3 flex-1">{t('legal.contact.githubContent')}</p>

              {/* GitHub Link Section - Symmetric with Email */}
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-background/80 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors group min-w-0"
              >
                <code className="flex-1 text-sm font-mono text-primary truncate">
                  mintaemt/Killer-sudoku-score
                </code>
                <div className="h-8 px-3 flex items-center gap-1 hover:bg-primary/10 rounded transition-colors shrink-0">
                  <ExternalLink className="h-4 w-4 text-primary" />
                  <span className="text-xs">Visit</span>
                </div>
              </a>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-primary">
            {t('legal.contact.responseTime')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.contact.responseTimeContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-primary">{t('legal.contact.typesOfInquiries')}</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <h3 className="font-medium text-primary mb-2">1. {t('legal.contact.technicalSupport')}</h3>
              <p className="text-sm text-muted-foreground">{t('legal.contact.technicalSupportContent')}</p>
            </div>
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <h3 className="font-medium text-primary mb-2">2. {t('legal.contact.privacyConcerns')}</h3>
              <p className="text-sm text-muted-foreground">{t('legal.contact.privacyConcernsContent')}</p>
            </div>
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <h3 className="font-medium text-primary mb-2">3. {t('legal.contact.featureRequests')}</h3>
              <p className="text-sm text-muted-foreground">{t('legal.contact.featureRequestsContent')}</p>
            </div>
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <h3 className="font-medium text-primary mb-2">4. {t('legal.contact.bugReports')}</h3>
              <p className="text-sm text-muted-foreground">{t('legal.contact.bugReportsContent')}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-primary">
            {t('legal.contact.beforeContacting')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.contact.beforeContactingContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-primary">
            {t('legal.contact.privacyNote')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.contact.privacyNoteContent')}
          </p>
        </section>
      </div>
    </ContentPageLayout>
  );
};
