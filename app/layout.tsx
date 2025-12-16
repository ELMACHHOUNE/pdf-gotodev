import type { Metadata } from "next";
import "./globals.css";
import { GoToDevButton } from "@/components/ui/gotodev-button";

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
      <body className={``}>
        {children}
        <GoToDevButton />
      </body>
    </html>
  );
}
