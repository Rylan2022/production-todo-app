import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taskly — Simple todo management",
  description: "A focused workspace for getting things done.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
