import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Brain, Users, LayoutDashboard, Search } from "lucide-react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SitePins Persona | Professional Customer Persona Dashboard",
  description: "Manage and generate user personas from raw research data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 border-r bg-card/50 backdrop-blur-xl flex flex-col fixed inset-y-0">
            <div className="p-6 flex items-center gap-2 mb-8">
              <div className="p-2 bg-primary rounded-xl">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl tracking-tight">SitePins</span>
            </div>

            <nav className="flex-1 px-4 space-y-2">
              <Link
                href="/customers"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Customers</span>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </Link>
            </nav>

            <div className="p-6 border-t border-border/50">
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Marketer AI</span>
                  <span className="text-xs text-muted-foreground underline decoration-primary/30 underline-offset-2">Pro Plan</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 ml-64 p-8 overflow-y-auto">

            <div className="slide-in-from-bottom-4 duration-700">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
