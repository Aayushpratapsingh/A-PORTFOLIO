import type { Metadata, Viewport } from "next";
import { DM_Mono, DM_Sans, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: "800",
  display: "swap",
  variable: "--font-syne-loaded",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  variable: "--font-dm-sans-loaded",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-dm-mono-loaded",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: "Aayush Pratap Singh — Designer, Developer & Video Producer",
  description:
    "Aayush Pratap Singh is a UI/UX and full stack developer creating thoughtful digital products and video work.",
  openGraph: {
    title: "Aayush Pratap Singh — Designer, Developer & Video Producer",
    description:
      "Thoughtful digital products, full stack development, and video work.",
    type: "website",
    images: [{ url: "/images/profile.webp", alt: "Aayush Pratap Singh" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aayush Pratap Singh — Designer, Developer & Video Producer",
    description:
      "Thoughtful digital products, full stack development, and video work.",
    images: ["/images/profile.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#141210",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
