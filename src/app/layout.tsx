// src/app/layout.tsx
import "@/app/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import TradingViewTicker from "@/components/TradingViewTicker";
import { Providers } from "./providers";
import { Assistant } from "next/font/google";

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
          {/* TradingViewTicker now shown on all devices */}
          <TradingViewTicker />
          <div className="pt-12"> {/* Add padding on all devices for ticker */}
            <Header />
            <main>
              {children}
            </main>
            <ContactFormSection />
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
