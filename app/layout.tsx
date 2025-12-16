import type { Metadata } from "next";
import "./globals.css";
import { GoToDevButton } from "@/components/ui/gotodev-button";
import { I18nProvider } from "@/lib/i18n-context";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
export const metadata: Metadata = {
  metadataBase: new URL("https://pdf.gotodev.ma"),
  title: {
    default: "Compress PDF Online - Secure, Fast & Client-Side | GoToDev",
    template: "%s | GoToDev PDF Compressor",
  },
  description:
    "Compress PDF files instantly in your browser with GoToDev. 100% client-side, secure, and free. No file uploads, no limits. Reduce PDF size without losing quality.",
  keywords: [
    "PDF Compressor",
    "Compress PDF",
    "Reduce PDF Size",
    "Optimize PDF",
    "Client-side PDF Tool",
    "Secure PDF Compression",
    "GoToDev",
    "Free PDF Tool",
    "Online PDF Compressor",
    "Browser-based PDF",
    "Local PDF Processing",
  ],
  authors: [{ name: "GoToDev", url: "https://gotodev.ma" }],
  creator: "GoToDev",
  publisher: "GoToDev",
  icons: {
    icon: "/images/icon.webp",
    shortcut: "/images/icon.webp",
    apple: "/images/icon.webp",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pdf.gotodev.ma",
    title: "Compress PDF Online - Secure & Client-Side | GoToDev",
    description:
      "Compress PDF files instantly in your browser. 100% client-side, secure, and free. No server uploads.",
    siteName: "GoToDev PDF Compressor",
    images: [
      {
        url: "/images/icon.webp",
        width: 1200,
        height: 1200,
        alt: "GoToDev PDF Compressor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress PDF Online - Secure & Client-Side | GoToDev",
    description:
      "Compress PDF files instantly in your browser. 100% client-side, secure, and free.",
    images: ["/images/icon.webp"],
    creator: "@GoToDev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            {children}
            <GoToDevButton />
          </I18nProvider>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
