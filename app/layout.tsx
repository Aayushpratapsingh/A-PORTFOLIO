import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  variable: "--font-display-loaded",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-body-loaded",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-code-loaded",
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
  themeColor: "#b8f45c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
