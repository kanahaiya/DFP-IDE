import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Data Formatter Pro - JSON Tools & Converters",
  description: "Fast, privacy-first JSON & data utilities for developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${firaCode.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
