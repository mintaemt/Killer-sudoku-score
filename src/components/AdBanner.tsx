import React from 'react';

interface AdBannerProps {
  adSlotId: string;
  className?: string;
  size?: 'mobile-banner' | 'desktop-banner' | 'floating-square';
}

export const AdBanner: React.FC<AdBannerProps> = ({ 
  adSlotId, 
  className = '', 
  size = 'mobile-banner' 
}) => {
  const [isAdSenseReady, setIsAdSenseReady] = React.useState(false);
  const [showPlaceholder, setShowPlaceholder] = React.useState(true);

  // 檢查是否為生產環境
  const isProduction = process.env.NODE_ENV === 'production';
  
  // 您的 AdSense Publisher ID (申請通過後會獲得)
  const AD_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX'; // 請替換為您的 Publisher ID

  React.useEffect(() => {
    if (isProduction && window.adsbygoogle) {
      setIsAdSenseReady(true);
      setShowPlaceholder(false);
      
      // 載入 AdSense 廣告
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
        setShowPlaceholder(true);
      }
    }
  }, [isProduction]);

  const getAdDimensions = () => {
    switch (size) {
      case 'mobile-banner':
        return 'w-full min-h-[50px] max-h-[80px]'; // 自適應高度，最小50px，最大80px
      case 'desktop-banner':
        return 'w-full min-w-[728px] max-w-[950px] min-h-[90px]'; // 自適應寬度，最小728px，最大950px
      case 'floating-square':
        return 'w-[120px] h-[120px]'; // 浮動廣告保持固定尺寸
      default:
        return 'w-full min-h-[50px] max-h-[80px]';
    }
  };

  // 開發環境或 AdSense 未準備好時顯示佔位符
  if (!isProduction || showPlaceholder) {
    return (
      <div className={`ad-banner bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center ${getAdDimensions()} ${className}`}>
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            廣告區域
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">
            {adSlotId}
          </p>
          {!isProduction && (
            <p className="text-[8px] text-gray-400">
              開發模式
            </p>
          )}
        </div>
      </div>
    );
  }

  // 生產環境 AdSense 廣告
  return (
    <div className={`ad-banner ${getAdDimensions()} ${className}`}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={adSlotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
        data-ad-layout="in-article"
      />
    </div>
  );
};