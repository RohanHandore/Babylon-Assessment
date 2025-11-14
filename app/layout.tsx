import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Babylon Assessment - Login App",
  description: "A Next.js app with Firebase Authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

