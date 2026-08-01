import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Tangerine } from "next/font/google";
import "./globals.css";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SERVICE_AREAS } from "@/lib/site";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Má rìn hò hò`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Rubyzatelier",
    "women's clothing Ogijo",
    "kids clothing Ogijo",
    "fashion store Ogijo",
    "clothing store Itaoluwo",
    "clothing store Lukosi",
    "Ogun State fashion",
    "tops dresses jeans Nigeria",
    "adire clothing",
  ],
  authors: [{ name: SITE_NAME }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Má rìn hò hò`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Má rìn hò hò`,
    description: SITE_DESCRIPTION,
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  telephone: "+2349060229398",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Ogijo",
    addressLocality: "Ogijo",
    addressRegion: "Ogun State",
    addressCountry: "NG",
  },
  areaServed: SERVICE_AREAS,
  priceRange: "₦₦",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <div className="grain-overlay" />
        {children}
      </body>
    </html>
  );
}
