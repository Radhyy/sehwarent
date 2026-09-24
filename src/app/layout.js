import { Geist, Geist_Mono } from "next/font/google";
import PublicLayoutWrapper from "@/components/PublicLayoutWrapper";
import PromoModal from "@/components/PromoModal";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SehwaRent - Platform Rental Akun Game",
  description: "Sewa akun game sultan murah, aman, dan instan. Platform rental akun nomor satu di Indonesia.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <PublicLayoutWrapper>
          {children}
          <PromoModal />
        </PublicLayoutWrapper>
      </body>
    </html>
  );
}
