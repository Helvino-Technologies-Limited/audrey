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
  title: "The Audrey Golf Resort | Luxury Resort in Siaya County, Kenya",
  description:
    "An exclusive golf resort restaurant in the Kenyan countryside, serving authentic flavours with timeless elegance.",
  keywords: "golf resort, Kenya, Siaya County, luxury hotel, fine dining, events",
  openGraph: {
    title: "The Audrey Golf Resort",
    description: "An exclusive golf resort restaurant in the Kenyan countryside",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable}`}>
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
