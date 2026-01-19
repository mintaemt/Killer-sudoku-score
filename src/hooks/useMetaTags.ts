import { useEffect } from 'react';

/**
 * Hook to manage document title and meta tags based on current language
 */
export const useMetaTags = (
    t: (key: string) => string,
    language: string
) => {
    useEffect(() => {
        // 設置頁面標題
        document.title = t('app_title');

        // 設置 meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', t('app_description'));
        }

        // 設置 meta keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.setAttribute('content', t('app_keywords'));
        }

        // 設置 application name
        const appName = document.querySelector('meta[name="application-name"]');
        if (appName) {
            appName.setAttribute('content', t('app_name'));
        }

        const appleAppTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
        if (appleAppTitle) {
            appleAppTitle.setAttribute('content', t('app_name'));
        }

        // 設置遊戲相關 meta 標籤
        const gameCategory = document.querySelector('meta[name="game:category"]');
        if (gameCategory) {
            gameCategory.setAttribute('content', t('game_category'));
        }

        const gameGenre = document.querySelector('meta[name="game:genre"]');
        if (gameGenre) {
            gameGenre.setAttribute('content', t('game_genre'));
        }

        const gamePlatform = document.querySelector('meta[name="game:platform"]');
        if (gamePlatform) {
            gamePlatform.setAttribute('content', t('game_platform'));
        }

        // 設置 Open Graph 標題
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute('content', t('app_title'));
        }

        // 設置 Open Graph 描述
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
            ogDescription.setAttribute('content', t('app_description'));
        }

        const ogLocale = document.querySelector('meta[property="og:locale"]');
        if (ogLocale) {
            ogLocale.setAttribute('content', t('og_locale'));
        }

        const ogSiteName = document.querySelector('meta[property="og:site_name"]');
        if (ogSiteName) {
            ogSiteName.setAttribute('content', t('app_name'));
        }

        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
            // 根據語言選擇對應的分享圖片
            let imageFileName = '';
            switch (language) {
                case 'zh': imageFileName = 'og-image-zh.png'; break;
                case 'en': imageFileName = 'og-image-en.png'; break;
                case 'ja': imageFileName = 'og-image-jp.png'; break;
                case 'ko': imageFileName = 'og-image-kr.png'; break;
                default: imageFileName = 'og-image-en.png'; break;
            }
            const imageUrl = `https://killer-sudoku-score.onrender.com/${imageFileName}`;
            ogImage.setAttribute('content', imageUrl);
        }

        const ogImageAlt = document.querySelector('meta[property="og:image:alt"]');
        if (ogImageAlt) {
            ogImageAlt.setAttribute('content', t('game_image_alt'));
        }

        // 設置 Twitter 標題
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) {
            twitterTitle.setAttribute('content', t('app_title'));
        }

        // 設置 Twitter 描述
        const twitterDescription = document.querySelector('meta[name="twitter:description"]');
        if (twitterDescription) {
            twitterDescription.setAttribute('content', t('app_description'));
        }

        const twitterImage = document.querySelector('meta[name="twitter:image"]');
        if (twitterImage) {
            // 根據語言選擇對應的分享圖片
            let imageFileName = '';
            switch (language) {
                case 'zh': imageFileName = 'og-image-zh.png'; break;
                case 'en': imageFileName = 'og-image-en.png'; break;
                case 'ja': imageFileName = 'og-image-jp.png'; break;
                case 'ko': imageFileName = 'og-image-kr.png'; break;
                default: imageFileName = 'og-image-en.png'; break;
            }
            const imageUrl = `https://killer-sudoku-score.onrender.com/${imageFileName}`;
            twitterImage.setAttribute('content', imageUrl);
        }

        const twitterImageAlt = document.querySelector('meta[name="twitter:image:alt"]');
        if (twitterImageAlt) {
            twitterImageAlt.setAttribute('content', t('game_image_alt'));
        }

        // 設置結構化數據
        const structuredData = document.querySelector('script[type="application/ld+json"]');
        if (structuredData) {
            const data = JSON.parse(structuredData.textContent || '{}');
            data.name = t('app_title').split(' | ')[0]; // 只取主標題部分
            data.description = t('app_description');
            data.keywords = t('app_keywords');
            data.genre = t('game_genre');
            data.inLanguage = t('og_locale');
            data.audience = {
                '@type': 'Audience',
                audienceType: t('audience_type')
            };
            structuredData.textContent = JSON.stringify(data);
        }
    }, [t, language]);
};
