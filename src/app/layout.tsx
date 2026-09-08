import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/context";
import { VoiceProvider } from "@/lib/voice-context";
import { AuthProvider } from "@/lib/auth-context";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { ToastContainer } from "@/components/ui/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DentalAI - Professional Dentist Dashboard",
  description: "AI-powered dental clinic management dashboard",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AppProvider>
            <VoiceProvider>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 ml-64">
                  <TopNav />
                  <main className="p-6">{children}</main>
                </div>
              </div>
              <ToastContainer />
            </VoiceProvider>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
