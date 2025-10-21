import React from 'react';

interface AdBannerProps {
  slot: string;
  style?: React.CSSProperties;
  className?: string;
  size?: 'banner' | 'sidebar' | 'mobile' | 'leaderboard';
}

export const AdBanner = ({ slot, style, className = '', size = 'banner' }: AdBannerProps) => {
  // 根據尺寸決定預設樣式
  const getSizeStyles = () => {
    switch (size) {
      case 'banner':
        return { width: '728px', height: '90px' };
      case 'sidebar':
        return { width: '160px', height: '600px' };
      case 'mobile':
        return { width: '320px', height: '50px' };
      case 'leaderboard':
        return { width: '728px', height: '90px' };
      default:
        return { width: '728px', height: '90px' };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <div 
      className={`ad-banner ${className}`}
      style={{
        ...sizeStyles,
        ...style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ddd',
        borderRadius: '4px',
        margin: '10px auto',
        color: '#666',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      {/* 開發環境顯示佔位符 */}
      {process.env.NODE_ENV === 'development' ? (
        <span>廣告位置 - {slot} ({sizeStyles.width} x {sizeStyles.height})</span>
      ) : (
        // 生產環境的實際廣告代碼
        <div>
          {/* Google AdSense 代碼將在這裡 */}
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
            crossOrigin="anonymous"
          ></script>
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot={slot}
            data-ad-format="auto"
          ></ins>
          <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
          </script>
        </div>
      )}
    </div>
  );
};

// 預設的廣告組件
export const TopBannerAd = () => (
  <AdBanner 
    slot="top-banner" 
    size="banner" 
    className="mb-4"
  />
);

export const SidebarAd = () => (
  <AdBanner 
    slot="sidebar" 
    size="sidebar" 
    className="hidden lg:block"
  />
);

export const MobileBannerAd = () => (
  <AdBanner 
    slot="mobile-banner" 
    size="mobile" 
    className="block lg:hidden"
  />
);

export const BottomBannerAd = () => (
  <AdBanner 
    slot="bottom-banner" 
    size="banner" 
    className="mt-8"
  />
);

export const GameOverAd = () => (
  <AdBanner 
    slot="game-over" 
    size="leaderboard" 
    className="my-6"
  />
);
