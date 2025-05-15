// src/app/layout.tsx
import "@/app/globals.css";
import ClientLayout from "./client-layout";
import { Assistant } from "next/font/google";
import TradingViewTicker from "@/components/TradingViewTicker";
import Script from 'next/script';

const assistant = Assistant({
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "גיא נתן | ייעוץ פיננסי וליווי כלכלי",
  description: "האתר הרשמי של גיא נתן - ייעוץ וליווי פיננסי, עדכונים מעולם ההשקעות, מאמרים וידע כלכלי שיעזור לך לקבל החלטות פיננסיות חכמות יותר.",
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  metadataBase: new URL('https://guy-natan.vercel.app'),
  openGraph: {
    title: 'גיא נתן | ייעוץ פיננסי וליווי כלכלי',
    description: 'האתר הרשמי של גיא נתן - ייעוץ וליווי פיננסי, עדכונים מעולם ההשקעות, מאמרים וידע כלכלי שיעזור לך לקבל החלטות פיננסיות חכמות יותר.',
    url: 'https://guy-natan.vercel.app',
    siteName: 'גיא נתן',
    locale: 'he_IL',
    type: 'website',
    images: [
      {
        url: '/icon.png',
        width: 800,
        height: 600,
        alt: 'גיא נתן לוגו',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'גיא נתן | ייעוץ פיננסי וליווי כלכלי',
    description: 'האתר הרשמי של גיא נתן - ייעוץ וליווי פיננסי, עדכונים מעולם ההשקעות, מאמרים וידע כלכלי.',
    images: ['/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={assistant.className}>
      <body suppressHydrationWarning className={assistant.className}>
        <Script
          id="userway-accessibility"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(d) {
                var s = d.createElement("script");
                s.setAttribute("data-account", "ewuuswlUNt");
                s.setAttribute("src", "https://cdn.userway.org/widget.js");
                s.setAttribute("data-common", "guy-natan");
                s.setAttribute("data-position", "middle-right"); // Try to set position via attribute
                
                // Try injecting custom options via a global variable
                window.UserwayOptions = {
                  position: 'middle-right',
                  widgetPosition: 'middle-right'
                };
                
                (d.body || d.head).appendChild(s);
                
                // More aggressive approach to reposition widget
                function moveWidgetToMiddle() {
                  // Try multiple selector patterns
                  const selectors = [
                    '#userway-widget-container',
                    'div[id^="userway"]',
                    'iframe[src*="userway.org"]',
                    '[class*="userway-widget"]'
                  ];
                  
                  let found = false;
                  
                  selectors.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    if (elements.length > 0) {
                      found = true;
                      elements.forEach(el => {
                        el.style.top = '50vh';
                        el.style.transform = 'translateY(-50%)';
                        el.style.position = 'fixed';
                        el.style.right = '10px';
                        el.style.marginTop = '0';
                      });
                    }
                  });
                  
                  // If we found and positioned elements, keep checking for a while
                  // to counter any scripts that might reposition them
                  if (found) {
                    for (let i = 1; i <= 10; i++) {
                      setTimeout(moveWidgetToMiddle, i * 1000); // Check again after 1s, 2s, ..., 10s
                    }
                  } else {
                    // If not found, check again after 500ms
                    setTimeout(moveWidgetToMiddle, 500);
                  }
                }
                
                // Set up MutationObserver to detect when the widget gets added to the DOM
                try {
                  const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                        for (let i = 0; i < mutation.addedNodes.length; i++) {
                          const node = mutation.addedNodes[i];
                          if (node.id && node.id.indexOf('userway') !== -1) {
                            moveWidgetToMiddle();
                            break;
                          }
                          if (node.tagName === 'IFRAME' && node.src && node.src.indexOf('userway.org') !== -1) {
                            moveWidgetToMiddle();
                            break;
                          }
                        }
                      }
                    });
                  });
                  
                  // Start observing the document with the configured parameters
                  observer.observe(document.body, { childList: true, subtree: true });
                } catch (e) {
                  console.log('Error setting up observer:', e);
                }
                
                // Start checking for widget elements
                setTimeout(moveWidgetToMiddle, 2000);
              })(document)
            `
          }}
        />
        <TradingViewTicker />
        <ClientLayout>
              {children}
        </ClientLayout>
      </body>
    </html>
  );
}
