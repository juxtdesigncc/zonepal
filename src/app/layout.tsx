import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import config from "../../config";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    template: "%s | " + config.SITE_TITLE,
    default: config.SITE_TITLE,
  },
  description: config.SEO_DESCRIPTION,
  keywords: config.SEO_KEYWORDS,
  twitter: {
    title: {
      template: "%s | " + config.SITE_TITLE,
      default: config.SITE_TITLE,
    },
    description: config.SEO_DESCRIPTION,
    card: "summary_large_image",
    creator: config.X_HANDLE,
    creatorId: config.X_ID,
  },
  openGraph: {
    title: {
      template: "%s | " + config.SITE_TITLE,
      default: config.SITE_TITLE,
    },
    description: config.SEO_DESCRIPTION,
    type: "website",
  },
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
        {children}
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_MEASUREMENT_ID!} />
    </html>
  );
}
