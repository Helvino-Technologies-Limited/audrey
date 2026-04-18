import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const playfair = Playfair_Display({
  variable: "--font-playfair-var",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant-var",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.theaudreyresort.org"),
  title: {
    default: "The Audrey Golf Resort | Luxury Resort in Siaya County, Kenya",
    template: "%s | The Audrey Golf Resort",
  },
  description:
    "An exclusive golf resort restaurant in Siaya County, Kenya — serving authentic flavours with timeless elegance. Book your stay, events, and fine dining experience.",
  keywords: [
    "The Audrey Golf Resort",
    "Audrey Resort Kenya",
    "golf resort Kenya",
    "Siaya County hotel",
    "luxury hotel Kenya",
    "fine dining Siaya",
    "resort hotel Kenya",
    "events venue Siaya",
    "theaudreyresort.org",
  ],
  authors: [{ name: "The Audrey Golf Resort" }],
  creator: "The Audrey Golf Resort",
  publisher: "The Audrey Golf Resort",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://www.theaudreyresort.org",
  },
  openGraph: {
    title: "The Audrey Golf Resort | Luxury Resort in Siaya County, Kenya",
    description:
      "An exclusive golf resort restaurant in Siaya County, Kenya. Authentic flavours, timeless elegance. Book now.",
    url: "https://www.theaudreyresort.org",
    siteName: "The Audrey Golf Resort",
    type: "website",
    locale: "en_KE",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Audrey Golf Resort — Siaya County, Kenya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Audrey Golf Resort | Luxury Resort in Siaya County, Kenya",
    description:
      "An exclusive golf resort in Siaya County, Kenya. Fine dining, events, and unforgettable stays.",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "The Audrey Golf Resort",
  url: "https://www.theaudreyresort.org",
  logo: "https://www.theaudreyresort.org/logo.png",
  image: "https://www.theaudreyresort.org/og-image.jpg",
  description:
    "An exclusive golf resort restaurant in Siaya County, Kenya, serving authentic flavours with timeless elegance.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Siaya",
    addressRegion: "Siaya County",
    addressCountry: "KE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "0.0607",
    longitude: "34.2884",
  },
  telephone: "",
  email: "",
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Golf Course", value: true },
    { "@type": "LocationFeatureSpecification", name: "Restaurant", value: true },
    { "@type": "LocationFeatureSpecification", name: "Events Venue", value: true },
  ],
  priceRange: "KES",
  currenciesAccepted: "KES",
  servesCuisine: "Kenyan, International",
  hasMap: "https://www.google.com/maps/search/Siaya+County+Kenya",
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1A1A1A",
              color: "#F0EBE1",
              border: "1px solid rgba(201, 168, 76, 0.3)",
              fontFamily: "Georgia, serif",
            },
            success: {
              iconTheme: { primary: "#C9A84C", secondary: "#1A1A1A" },
            },
          }}
        />
      </body>
    </html>
  );
}
