// TradingViewTicker.tsx
'use client'; // This directive must be the first line

import { useEffect, useRef } from "react";

export default function TradingViewTicker() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip in SSR
    if (typeof window === 'undefined') return;

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.type = 'text/javascript';
    
    // Configure widget settings
    script.innerHTML = JSON.stringify({
      symbols: [
        { description: "USD/ILS", proName: "FOREXCOM:USDILS" },
        { description: "Tel Aviv 125", proName: "TASE:TA125" },
        { description: "Tel Aviv 35", proName: "TASE:TA35" },
        { description: "EUR/ILS", proName: "SAXO:EURILS" },
        { description: "NASDAQ 100", proName: "NASDAQ:NDX" },
        { description: "NIKKEI", proName: "OSE:NK2251!" },
        { description: "Bitcoin", proName: "BITSTAMP:BTCUSD" },
        { description: "Ethereum", proName: "COINBASE:ETHUSD" },
        { description: "S&P 500 Index", proName: "FOREXCOM:SPX500" }
      ],
      showSymbolLogo: true,
      isTransparent: false,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "en"
    });

    // Append to container
    if (containerRef.current) {
      // Clear any previous widgets
      containerRef.current.innerHTML = '';
      
      // Create widget container
      const widgetContainer = document.createElement('div');
      widgetContainer.className = 'tradingview-widget-container';
      
      // Create widget div
      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'tradingview-widget-container__widget';
      widgetContainer.appendChild(widgetDiv);
      
      // Create copyright div
      const copyrightDiv = document.createElement('div');
      copyrightDiv.className = 'tradingview-widget-copyright';
      widgetContainer.appendChild(copyrightDiv);
      
      // Append widget container to our component container
      containerRef.current.appendChild(widgetContainer);
      
      // Add script to widget container
      widgetContainer.appendChild(script);
      
      // Force 100% width on mobile and desktop
      const fixStyle = () => {
        const tickerTape = document.querySelector('.tradingview-widget-container');
        if (tickerTape) {
          const iframe = tickerTape.querySelector('iframe');
          if (iframe) {
            iframe.style.width = '100%';
            if (window.innerWidth < 768) {
              iframe.style.height = '38px';
            }
          }
        }
      };
      
      // Apply style changes after delays
      setTimeout(fixStyle, 1000);
      setTimeout(fixStyle, 2000);
      setTimeout(fixStyle, 3000);
      
      // Handle resize
      const handleResize = () => {
        fixStyle();
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '42px',
        zIndex: 9999,
        background: '#151515',
        overflow: 'hidden',
        minHeight: '38px'
      }}
    />
  );
}
