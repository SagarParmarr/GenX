import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CDN_BASE_URL } from "@/lib/config";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "GenX — Pure Sound",
  description: "Scrollytelling landing for GenX headphones",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cdnDomain = CDN_BASE_URL.startsWith('http') 
    ? new URL(CDN_BASE_URL).origin 
    : null;

  return (
    <html lang="en" className="h-full">
      <head>
        {cdnDomain && (
          <>
            <link rel="preconnect" href={cdnDomain} />
            <link rel="dns-prefetch" href={cdnDomain} />
          </>
        )}
      </head>
      <body className={`${inter.variable} font-inter bg-[#050505] text-white/90 antialiased h-full`}>{children}</body>
    </html>
  );
}
