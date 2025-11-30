import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Mail, Github, Clock, HelpCircle, Shield, Lightbulb, Bug, AlertCircle, Lock } from 'lucide-react';
import { ContentPageLayout } from '@/components/layout/ContentPageLayout';

export const Contact: React.FC = () => {
  const { t } = useLanguage();

  return (
    <ContentPageLayout
      title={t('legal.contact.title')}
      lastUpdated={t('legal.contact.lastUpdated')}
      seoTitle={t('legal.contact.title')}
      seoDescription={t('legal.contact.introduction')}
      icon={<Mail className="h-6 w-6 text-primary" />}
    >
      <div className="space-y-8">
        <section>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t('legal.contact.introduction')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground/90">{t('legal.contact.waysToContact')}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">{t('legal.contact.email')}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{t('legal.contact.emailContent')}</p>
            </div>
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Github className="h-5 w-5 text-foreground" />
                <h3 className="font-medium">{t('legal.contact.github')}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{t('legal.contact.githubContent')}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <Clock className="h-5 w-5 text-orange-500" />
            {t('legal.contact.responseTime')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.contact.responseTimeContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground/90">{t('legal.contact.typesOfInquiries')}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="h-5 w-5 text-purple-500" />
                <h3 className="font-medium">{t('legal.contact.technicalSupport')}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{t('legal.contact.technicalSupportContent')}</p>
            </div>
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-green-500" />
                <h3 className="font-medium">{t('legal.contact.privacyConcerns')}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{t('legal.contact.privacyConcernsContent')}</p>
            </div>
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <h3 className="font-medium">{t('legal.contact.featureRequests')}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{t('legal.contact.featureRequestsContent')}</p>
            </div>
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Bug className="h-5 w-5 text-red-500" />
                <h3 className="font-medium">{t('legal.contact.bugReports')}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{t('legal.contact.bugReportsContent')}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <AlertCircle className="h-5 w-5 text-cyan-500" />
            {t('legal.contact.beforeContacting')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.contact.beforeContactingContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <Lock className="h-5 w-5 text-indigo-500" />
            {t('legal.contact.privacyNote')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.contact.privacyNoteContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <Clock className="h-5 w-5 text-gray-500" />
            {t('legal.contact.businessHours')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.contact.businessHoursContent')}
          </p>
        </section>
      </div>
    </ContentPageLayout>
  );
};
