import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "GenX — Pure Sound",
  description: "Scrollytelling landing for GenX headphones",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} font-inter bg-[#050505] text-white/90 antialiased h-full`}>{children}</body>
    </html>
  );
}
