import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "QR Code Generation",
  description: "Next generation QR code generation, built with accounts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
