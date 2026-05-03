import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieBanner from "./components/CookieBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RealIQTest — Free IQ Test: 30 Questions, 6 Cognitive Dimensions",
  description: "Take a free IQ test with 30 visual questions across 6 cognitive dimensions. Get your IQ score instantly. Premium detailed report available for €1.99.",
  keywords: "IQ test, free IQ test, intelligence test, cognitive assessment, Raven matrices, IQ score, online IQ test",
  authors: [{ name: "RealIQTest", url: "https://realiqtest.co" }],
  metadataBase: new URL("https://realiqtest.co"),
  openGraph: {
    title: "RealIQTest — Free IQ Test: 30 Questions, 6 Cognitive Dimensions",
    description: "30 visual questions across 6 cognitive dimensions. Get your IQ score instantly. Free.",
    url: "https://realiqtest.co",
    siteName: "RealIQTest",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RealIQTest — Free IQ Test",
    description: "30 questions · 6 cognitive dimensions · Instant IQ score · Free",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: "btkTmkpyqc1ZyTRkpcVod-SR5AwkmZaXUMZE7UmyklQ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/* Analytics & AdSense are loaded by CookieBanner after GDPR consent */}
        <meta name="theme-color" content="#03050F" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
