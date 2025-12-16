import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoToDev - PDF Compression",
  description: "Secure, Client-Side PDF Optimization Tool by GoToDev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={``}>{children}</body>
    </html>
  );
}
