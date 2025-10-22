import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Cookie, HelpCircle, Settings, BarChart3, Shield, RefreshCw, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CookiePolicy: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Button>
          <div className="flex items-center gap-3">
            <Cookie className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">{t('legal.cookiePolicy.title')}</h1>
              <p className="text-muted-foreground">{t('legal.cookiePolicy.lastUpdated')}</p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {t('legal.cookiePolicy.introduction')}
            </p>
          </CardContent>
        </Card>

        {/* What Are Cookies */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-500" />
              {t('legal.cookiePolicy.whatAreCookies')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {t('legal.cookiePolicy.whatAreCookiesContent')}
            </p>
          </CardContent>
        </Card>

        {/* How We Use Cookies */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-green-500" />
              {t('legal.cookiePolicy.howWeUseCookies')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {t('legal.cookiePolicy.howWeUseCookiesContent')}
            </p>
          </CardContent>
        </Card>

        {/* Types of Cookies */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-purple-500" />
              {t('legal.cookiePolicy.typesOfCookies')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Essential Cookies */}
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-semibold text-red-500 mb-2">
                {t('legal.cookiePolicy.essentialCookies')}
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                {t('legal.cookiePolicy.essentialCookiesContent')}
              </p>
            </div>

            {/* Preference Cookies */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-blue-500 mb-2">
                {t('legal.cookiePolicy.preferenceCookies')}
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                {t('legal.cookiePolicy.preferenceCookiesContent')}
              </p>
            </div>

            {/* Analytics Cookies */}
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-green-500 mb-2">
                {t('legal.cookiePolicy.analyticsCookies')}
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                {t('legal.cookiePolicy.analyticsCookiesContent')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Managing Cookies */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-orange-500" />
              {t('legal.cookiePolicy.managingCookies')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {t('legal.cookiePolicy.managingCookiesContent')}
            </p>
          </CardContent>
        </Card>

        {/* Third-Party Cookies */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-500" />
              {t('legal.cookiePolicy.thirdPartyCookies')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {t('legal.cookiePolicy.thirdPartyCookiesContent')}
            </p>
          </CardContent>
        </Card>

        {/* Updates */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-teal-500" />
              {t('legal.cookiePolicy.updates')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {t('legal.cookiePolicy.updatesContent')}
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-pink-500" />
              {t('legal.cookiePolicy.contact')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {t('legal.cookiePolicy.contactContent')}
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground mt-8">
          <p>© 2025 mintae. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
