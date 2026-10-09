import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Gabriel Ferreira's Portfolio",
  description: "Gabriel Ferreira — Frontend Engineer specializing in web accessibility, design, and development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <a href="#content" className="skip-link">
        Skip to main content
      </a> */}
      <body className={`${inter.variable}`}>{children}</body>
    </html>
  );
}
