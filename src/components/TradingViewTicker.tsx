'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const COMPONENT_ID = 'trading-view-ticker-instance';
const STYLE_ID = 'trading-view-ticker-style';

export default function TradingViewTicker() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Track mobile vs desktop
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget and styles
    containerRef.current.innerHTML = '';
    document.getElementById(STYLE_ID)?.remove();

    // Tag container element
    containerRef.current.id = COMPONENT_ID;

    // Inject CSS for single-line ticker
    const styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    styleEl.textContent = `
      .tradingview-widget-container,
      .tradingview-widget-container__widget {
        height: 36px !important;
        overflow: hidden !important;
      }
      iframe[id^="tradingview_"] {
        height: 36px !important;
        max-height: 36px !important;
      }
      .tv-ticker-tape-container,
      .tv-ticker-tape-wrap,
      .tv-ticker-tape-widget__body {
        height: 36px !important;
        overflow: hidden !important;
      }
      .tv-ticker-tape-container { white-space: nowrap !important; }
      .tv-ticker-tape-widget__body { display: flex !important; align-items: center !important; }
      .tv-ticker-tape-widget__logo-link { display: ${isMobile ? 'none' : 'block'} !important; }
      .tv-ticker-tape-message { display: none !important; }
      .tradingview-widget-container__widget { overflow-x: auto !important; white-space: nowrap !important; }
    `;
    document.head.appendChild(styleEl);

    // Patch iframe internals (best-effort)
    const patchIframes = () => {
      document.querySelectorAll('iframe[id^="tradingview_"]').forEach((node) => {
        const iframe = node as HTMLIFrameElement;
        iframe.style.height = '36px';
        try {
          const doc = iframe.contentWindow?.document;
          if (doc) {
            const s = doc.createElement('style');
            s.textContent = `body, html { height: 36px !important; overflow: hidden !important; }`;
            doc.head.appendChild(s);
          }
        } catch {
          // CORS
        }
      });
    };

    // Build and append widget elements
    const wrapper = document.createElement('div');
    wrapper.className = 'tradingview-widget-container';
    wrapper.style.height = '36px';
    wrapper.style.overflow = 'hidden';

    const inner = document.createElement('div');
    inner.className = 'tradingview-widget-container__widget';
    inner.style.height = '36px';
    inner.style.overflow = 'hidden';
    wrapper.appendChild(inner);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.type = 'text/javascript';
    script.innerHTML = JSON.stringify({
      symbols: isMobile
        ? [
            { description: '', proName: 'FOREXCOM:SPXUSD' },
            { description: '', proName: 'FOREXCOM:NSXUSD' },
            { description: '', proName: 'FX_IDC:EURUSD' }
          ]
        : [
            { description: 'S&P 500', proName: 'FOREXCOM:SPXUSD' },
            { description: 'NASDAQ 100', proName: 'FOREXCOM:NSXUSD' },
            { description: 'EUR/USD', proName: 'FX_IDC:EURUSD' },
            { description: 'Bitcoin', proName: 'BITSTAMP:BTCUSD' },
            { description: 'Tel Aviv 35', proName: 'TASE:TA35' },
            { description: 'Tel Aviv 125', proName: 'TASE:TA125' }
          ],
      showSymbolLogo: false,
      colorTheme: 'dark',
      isTransparent: false,
      displayMode: isMobile ? 'regular' : 'compact',
      locale: 'en',
      height: 36
    });

    containerRef.current.appendChild(wrapper);
    containerRef.current.appendChild(script);

    // Wait for load, then patch
    setTimeout(patchIframes, 500);
    setTimeout(patchIframes, 1000);
    setTimeout(patchIframes, 2000);

  }, [isMobile, pathname]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '36px',
        maxHeight: '36px',
        zIndex: 9999,
        background: '#151515',
        overflow: 'hidden'
      }}
    />
  );
}
