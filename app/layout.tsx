import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Skin Analyzer",
  description: "Analyze your skin type and get personalized sunscreen recommendations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
