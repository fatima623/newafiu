import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import NewsBanner from "@/components/layout/NewsBanner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AFIU - Armed Forces Institute of Urology",
  description: "Excellence in Urological Care - Armed Forces Institute of Urology provides comprehensive urological services with state-of-the-art facilities and expert medical professionals.",
  keywords: "urology, urological care, AFIU, Armed Forces Institute of Urology, urologist, kidney stones, prostate cancer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <NewsBanner />
        <Header />
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
