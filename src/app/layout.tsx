import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Inter - clean professional font
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ACF Document Scanner - AI-Powered Corruption Investigation",
  description: "An AI document scanner for human rights activists and investigative journalists. Upload documents, extract entities, map connections, and expose corruption.",
  keywords: ["document scanner", "corruption investigation", "AI", "entity extraction", "investigative journalism", "human rights", "anti-corruption", "document analysis"],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "ACF Document Scanner - AI-Powered Corruption Investigation",
    description: "Upload documents, extract entities, map connections, and expose corruption. Built for human rights activists and investigative journalists.",
    type: "website",
    siteName: "ACF Document Scanner",
  },
  twitter: {
    card: "summary_large_image",
    title: "ACF Document Scanner - AI-Powered Corruption Investigation",
    description: "Upload documents, extract entities, map connections, and expose corruption.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
