import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FinBoard | Customizable Finance Dashboard",
  description:
    "Build your own real-time finance monitoring dashboard by connecting to various financial APIs and displaying real-time data through customizable widgets.",
  keywords: [
    "finance",
    "dashboard",
    "stocks",
    "crypto",
    "real-time",
    "widgets",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
