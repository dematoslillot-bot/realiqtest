import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieBanner from "./components/CookieBanner";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RealIQTest — An Actually Free and Accurate IQ Test",
  description: "A free IQ test: 27 visual questions across 6 cognitive dimensions, no registration. See your IQ level for free; the exact score and full report are optional.",
  keywords: "IQ test, free IQ test, accurate IQ test, intelligence test, cognitive assessment, Raven matrices, IQ score, online IQ test",
  authors: [{ name: "RealIQTest", url: "https://realiqtest.co" }],
  metadataBase: new URL("https://realiqtest.co"),
  openGraph: {
    title: "RealIQTest — An Actually Free and Accurate IQ Test",
    description: "A free IQ test: 27 visual questions · 6 cognitive dimensions · no registration. Free IQ level, optional full report.",
    url: "https://realiqtest.co",
    siteName: "RealIQTest",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RealIQTest — An Actually Free and Accurate IQ Test",
    description: "27 questions · 6 cognitive dimensions · free IQ level · optional full report",
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
        <Script src="/_vercel/insights/script.js" defer />
      </body>
    </html>
  );
}
