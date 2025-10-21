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
  // 在實際生產環境中，這裡會載入真實的廣告
  // 目前顯示佔位符用於開發和測試
  
  const getAdDimensions = () => {
    switch (size) {
      case 'mobile-banner':
        return 'w-full h-[50px]';
      case 'desktop-banner':
        return 'w-[728px] h-[90px]';
      case 'floating-square':
        return 'w-[120px] h-[120px]';
      default:
        return 'w-full h-[50px]';
    }
  };

  return (
    <div className={`ad-banner bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center ${getAdDimensions()} ${className}`}>
      <div className="text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          廣告區域
        </p>
        <p className="text-[10px] text-gray-400 dark:text-gray-500">
          {adSlotId}
        </p>
      </div>
      
      {/* 真實廣告代碼會在生產環境中啟用 */}
      {/* 
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
           data-ad-slot={adSlotId}
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      */}
    </div>
  );
};