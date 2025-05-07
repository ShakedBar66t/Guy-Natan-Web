// src/app/layout.tsx
import "@/app/globals.css";
import ClientLayout from "./client-layout";
import { Assistant } from "next/font/google";
import TradingViewTicker from "@/components/TradingViewTicker";

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
      <body suppressHydrationWarning className={assistant.className}>
        <TradingViewTicker />
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
