import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Writeless",
  description: "Writeless — capture, transcribe, summarize",
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
