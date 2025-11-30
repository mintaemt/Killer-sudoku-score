import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Cookie, Info, Settings, BarChart, Globe, RefreshCw, Mail } from 'lucide-react';
import { ContentPageLayout } from '@/components/layout/ContentPageLayout';

export const CookiePolicy: React.FC = () => {
  const { t } = useLanguage();

  return (
    <ContentPageLayout
      title={t('legal.cookiePolicy.title')}
      lastUpdated={t('legal.cookiePolicy.lastUpdated')}
      seoTitle={t('legal.cookiePolicy.title')}
      seoDescription={t('legal.cookiePolicy.introduction')}
      icon={<Cookie className="h-6 w-6 text-primary" />}
    >
      <div className="space-y-8">
        <section>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t('legal.cookiePolicy.introduction')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <Info className="h-5 w-5 text-blue-500" />
            {t('legal.cookiePolicy.whatAreCookies')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.cookiePolicy.whatAreCookiesContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <Settings className="h-5 w-5 text-green-500" />
            {t('legal.cookiePolicy.howWeUseCookies')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.cookiePolicy.howWeUseCookiesContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <Cookie className="h-5 w-5 text-orange-500" />
            {t('legal.cookiePolicy.typesOfCookies')}
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-foreground mb-1">{t('legal.cookiePolicy.essentialCookies')}</h3>
              <p className="text-muted-foreground leading-relaxed">{t('legal.cookiePolicy.essentialCookiesContent')}</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">{t('legal.cookiePolicy.preferenceCookies')}</h3>
              <p className="text-muted-foreground leading-relaxed">{t('legal.cookiePolicy.preferenceCookiesContent')}</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">{t('legal.cookiePolicy.analyticsCookies')}</h3>
              <p className="text-muted-foreground leading-relaxed">{t('legal.cookiePolicy.analyticsCookiesContent')}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <Settings className="h-5 w-5 text-purple-500" />
            {t('legal.cookiePolicy.managingCookies')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.cookiePolicy.managingCookiesContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <Globe className="h-5 w-5 text-indigo-500" />
            {t('legal.cookiePolicy.thirdPartyCookies')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.cookiePolicy.thirdPartyCookiesContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <RefreshCw className="h-5 w-5 text-teal-500" />
            {t('legal.cookiePolicy.updates')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.cookiePolicy.updatesContent')}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-foreground/90">
            <Mail className="h-5 w-5 text-red-500" />
            {t('legal.cookiePolicy.contact')}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('legal.cookiePolicy.contactContent')}
          </p>
        </section>
      </div>
    </ContentPageLayout>
  );
};
