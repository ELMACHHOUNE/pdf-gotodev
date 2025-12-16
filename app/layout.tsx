import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PDF GoToDev",
  description: "RESIZE PDF FILES EASILY",
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
