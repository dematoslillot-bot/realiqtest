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
  title: "RealIQTest — Discover Your True Intelligence",
  description: "Free IQ test with 30 questions across 6 cognitive categories. Get your IQ score instantly.",
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