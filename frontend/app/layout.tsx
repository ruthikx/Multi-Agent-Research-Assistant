import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Multi-Agent Research Assistant",
  description: "A full-stack AI research workspace with live multi-agent progress tracking.",
};

const themeScript = `
  (function () {
    try {
      var stored = localStorage.getItem("theme-preference");
      var theme = stored === "light" || stored === "dark"
        ? stored
        : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
      document.documentElement.dataset.theme = theme;
    } catch (error) {
      document.documentElement.dataset.theme = "dark";
    }
  })();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} font-body antialiased`}>{children}</body>
    </html>
  );
}
