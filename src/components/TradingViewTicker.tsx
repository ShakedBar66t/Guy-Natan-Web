// TradingViewTicker.tsx
'use client'; // This directive must be the first line

import React, { useEffect, useRef, useState } from 'react';

// Only render this component once based on a global identifier
const COMPONENT_ID = 'trading-view-ticker-instance';

export default function TradingViewTicker() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Check if this component is already rendered elsewhere
    if (typeof window !== 'undefined') {
      const existingInstance = document.getElementById(COMPONENT_ID);
      
      // If an instance already exists and it's not this one, don't render
      if (existingInstance && existingInstance !== containerRef.current) {
        setShouldRender(false);
        return;
      }
      
      // Otherwise, mark this as the instance
      if (containerRef.current) {
        containerRef.current.id = COMPONENT_ID;
      }
    }

    // Only proceed if we should render
    if (!shouldRender) return;

    try {
      // Create a new script element manually
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.type = 'text/javascript';
    
      // Configure the widget
    script.innerHTML = JSON.stringify({
        "symbols": [
          {
            "description": "S&P 500",
            "proName": "FOREXCOM:SPXUSD"
          },
          {
            "description": "NASDAQ 100",
            "proName": "FOREXCOM:NSXUSD"
          },
          {
            "description": "EUR/USD",
            "proName": "FX_IDC:EURUSD"
          },
          {
            "description": "Bitcoin",
            "proName": "BITSTAMP:BTCUSD"
          },
          {
            "description": "Tel Aviv 35",
            "proName": "TASE:TA35"
          },
          {
            "description": "Tel Aviv 125",
            "proName": "TASE:TA125"
          }
      ],
        "showSymbolLogo": true,
        "colorTheme": "dark",
        "isTransparent": false,
        "displayMode": "adaptive",
        "locale": "en"
    });

      // Only append if the container exists and we're still the active instance
      if (containerRef.current && document.getElementById(COMPONENT_ID) === containerRef.current) {
        // Clear any existing content first
        const widgetDiv = containerRef.current.querySelector('.tradingview-widget-container__widget');
        if (widgetDiv) {
          widgetDiv.innerHTML = '';
        }
        containerRef.current.appendChild(script);
      }
    } catch (error) {
      console.error('Error loading TradingView widget:', error);
    }

    // Cleanup function
    return () => {
      if (containerRef.current && containerRef.current.id === COMPONENT_ID) {
        document.getElementById(COMPONENT_ID)?.removeAttribute('id');
      }
    };
  }, [shouldRender]);
      
  // Don't render anything if we shouldn't
  if (!shouldRender) {
    return null;
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '42px',
        zIndex: 9999,
        background: '#151515'
      }}
      ref={containerRef}
    >
      <div className="tradingview-widget-container">
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
}
