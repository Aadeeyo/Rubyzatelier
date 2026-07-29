import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Tangerine } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const tangerine = Tangerine({
  variable: "--font-tangerine",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Rubyzatelier | Má rìn hò hò",
  description:
    "Rubyzatelier — tops, dresses and jeans for women and kids.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${tangerine.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-sand font-sans">
        <div className="grain-overlay" />
        {children}
      </body>
    </html>
  );
}
