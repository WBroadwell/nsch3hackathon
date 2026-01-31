import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
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
  title: "CharityMap",
  description: "A website for finding and supporting local charitable or non profit events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavigationBar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
