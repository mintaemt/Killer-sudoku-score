import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Github, Clock, Wrench, Shield, Lightbulb, Bug, MessageSquare, AlertCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Contact: React.FC = () => {
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
            <Mail className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">{t('legal.contact.title')}</h1>
              <p className="text-muted-foreground">{t('legal.contact.lastUpdated')}</p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {t('legal.contact.introduction')}
            </p>
          </CardContent>
        </Card>

        {/* Ways to Contact */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-500" />
              {t('legal.contact.waysToContact')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">{t('legal.contact.email')}</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {t('legal.contact.emailContent')}
                </p>
              </div>
            </div>

            {/* GitHub */}
            <div className="flex items-start gap-3">
              <Github className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">{t('legal.contact.github')}</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {t('legal.contact.githubContent')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Time */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              {t('legal.contact.responseTime')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {t('legal.contact.responseTimeContent')}
            </p>
          </CardContent>
        </Card>

        {/* Types of Inquiries */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-500" />
              {t('legal.contact.typesOfInquiries')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Technical Support */}
            <div className="flex items-start gap-3">
              <Wrench className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">{t('legal.contact.technicalSupport')}</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {t('legal.contact.technicalSupportContent')}
                </p>
              </div>
            </div>

            {/* Privacy Concerns */}
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">{t('legal.contact.privacyConcerns')}</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {t('legal.contact.privacyConcernsContent')}
                </p>
              </div>
            </div>

            {/* Feature Requests */}
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">{t('legal.contact.featureRequests')}</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {t('legal.contact.featureRequestsContent')}
                </p>
              </div>
            </div>

            {/* Bug Reports */}
            <div className="flex items-start gap-3">
              <Bug className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">{t('legal.contact.bugReports')}</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {t('legal.contact.bugReportsContent')}
                </p>
              </div>
            </div>

            {/* General Feedback */}
            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-indigo-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">{t('legal.contact.feedback')}</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {t('legal.contact.feedbackContent')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Before Contacting */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              {t('legal.contact.beforeContacting')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {t('legal.contact.beforeContactingContent')}
            </p>
          </CardContent>
        </Card>

        {/* Privacy Note */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-cyan-500" />
              {t('legal.contact.privacyNote')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {t('legal.contact.privacyNoteContent')}
            </p>
          </CardContent>
        </Card>

        {/* Business Hours */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-teal-500" />
              {t('legal.contact.businessHours')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {t('legal.contact.businessHoursContent')}
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
