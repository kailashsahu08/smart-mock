import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/providers/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartMock - Modern Mock Test Platform",
  description: "Take your learning to the next level with SmartMock - a comprehensive mock test platform with real-time analytics and performance tracking.",
  keywords: ["mock test", "online exam", "quiz", "learning", "education"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}

