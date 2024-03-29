import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Espresso ☕️",
  description: "Selling goods with crypto has never been so easy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light bg-white">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
