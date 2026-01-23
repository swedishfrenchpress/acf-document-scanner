import type { Metadata } from "next";
import localFont from "next/font/local";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";

// PP Editorial New - local font for headlines - editorial/journalistic feel
const ppEditorial = localFont({
  src: [
    {
      path: "../../fonts/PPEditorialNew-Ultralight-BF644b21500d0c0.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../fonts/PPEditorialNew-UltralightItalic-BF644b214ff1e9b.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../../fonts/PPEditorialNew-Regular-BF644b214ff145f.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/PPEditorialNew-Italic-BF644b214fb0c0a.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../fonts/PPEditorialNew-Ultrabold-BF644b21500840c.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../fonts/PPEditorialNew-UltraboldItalic-BF644b214faef01.otf",
      weight: "800",
      style: "italic",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

// Refined sans-serif for body text
const sourceSans = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
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
    images: [
      {
        url: "/open-graph.jpg",
        width: 1200,
        height: 630,
        alt: "ACF Document Scanner - AI-Powered Corruption Investigation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ACF Document Scanner - AI-Powered Corruption Investigation",
    description: "Upload documents, extract entities, map connections, and expose corruption.",
    images: ["/open-graph.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ppEditorial.variable} ${sourceSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
