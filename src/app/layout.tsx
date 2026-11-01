import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Nunito_Sans } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});

import { NavProgress } from "@/components/nav-progress";

export const metadata: Metadata = {
  title: "mykidzlearning – learning is a journey",
  description:
    "Watch the lesson, pass the test and practise in the notebook. Learning is a journey to a successful life, and small rewards celebrate the steps along the way.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${nunito.variable}`}>
      <body>
        <NavProgress />
        {children}
      </body>
    </html>
  );
}
