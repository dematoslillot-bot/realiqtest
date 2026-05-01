import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  keywords: "IQ test, free IQ test, intelligence test, cognitive assessment, Raven matrices, IQ score",
  authors: [{ name: "RealIQTest", url: "https://realiqtest.co" }],
  metadataBase: new URL("https://realiqtest.co"),
  openGraph: {
    title: "RealIQTest — Free IQ Test",
    description: "30 visual questions across 6 cognitive dimensions. Discover your true intelligence quotient.",
    url: "https://realiqtest.co",
    siteName: "RealIQTest",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
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
  <script
    async
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1926703547029071"
    crossOrigin="anonymous"
  />
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-GSBY8RNB29" />
  <script dangerouslySetInnerHTML={{__html: `window['dataLayer']=window['dataLayer']||[];function gtag(){window['dataLayer'].push(arguments);}gtag('js',new Date());gtag('config','G-GSBY8RNB29');`}} />
</head>
    
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}