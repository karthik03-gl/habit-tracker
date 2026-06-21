import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navigation } from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Modern habit tracking application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen">
            <Navigation />
            <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 max-w-5xl mx-auto w-full">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
