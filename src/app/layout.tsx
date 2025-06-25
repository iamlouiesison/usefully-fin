import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Usefully - Discover Useful Resources",
  description: "Find and share useful resources, tools, and assets with the community",
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
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <a href="/" className="text-xl font-bold text-gray-900">
                  Usefully
                </a>
                <div className="hidden md:flex space-x-6">
                  <a href="/submit" className="text-gray-600 hover:text-gray-900">
                    Submit
                  </a>
                  <a href="/forum" className="text-gray-600 hover:text-gray-900">
                    Forum
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-600 hover:text-gray-900">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
