import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useEffect } from "react";

const FAQ: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    document.title = t('faq.seoTitle');
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', t('faq.seoDescription'));
  }, [t]);

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t('faq.title')}</h1>
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>{t('faq.backToGame')}</Button>
        </div>

        {faqs.map((item, idx) => (
          <Card key={idx} className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg">{item.q}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">{item.a}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FAQ;


