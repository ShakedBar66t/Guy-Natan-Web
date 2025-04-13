// src/app/layout.tsx
import "@/app/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import dynamic from 'next/dynamic';
import { Providers } from "./providers";
import { Assistant } from "next/font/google";

// Dynamically import TradingViewTicker with SSR disabled
// This prevents any window/document references during SSR
const TradingViewTicker = dynamic(
  () => import("@/components/TradingViewTicker"),
  { ssr: false }
);

const assistant = Assistant({
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "גיא נתן בע״מ",
  description: "Official website...",
  icons:{
    icon: 'https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={assistant.className}>
      <body className={assistant.className}>
        <Providers>
          {/* TradingViewTicker completely removed from rendering on mobile */}
          <TradingViewTicker />
          <div className="pt-0 md:pt-12"> {/* Only add padding on desktop for ticker */}
            <Header />
            <main>
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
