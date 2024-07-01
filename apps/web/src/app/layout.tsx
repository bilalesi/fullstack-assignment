import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Menu from "@/components/molecules/menu";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lepaya Full Stack Assignment",
  description: "Lepaya Full Stack Assignment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="max-w-3xl mx-auto min-h-svh">
          <header className="py-4 px-0">
            <Menu />
          </header>
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
