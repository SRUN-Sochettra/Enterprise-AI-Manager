import { Inter } from "next/font/google";
import localFont from "next/font/local"; // If using Geist local, or just use Google
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/src/context/AuthContext";
import Providers from "@/src/components/Providers";
import Sidebar from "@/src/components/layouts/Sidebar";
import TopBar from "@/src/components/layouts/TopBar";
import ChatBot from "@/src/components/ChatBot";
import "./globals.css";

// Optimize Google Font
const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata = {
    title: {
        default: "NexusAI — Enterprise Management",
        template: "%s | NexusAI",
    },
    description: "Modern AI-powered platform",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning className={`dark ${inter.variable}`}>
            <body className="mesh-bg min-h-screen font-sans antialiased selection:bg-blue-500/30">
                <Providers>
                    <AuthProvider>
                        <div className="flex min-h-screen">
                            <Sidebar />
                            <div className="flex-1 flex flex-col min-h-screen md:ml-64 transition-all duration-300">
                                <TopBar />
                                <main className="flex-1 p-4 md:p-6 lg:p-8">
                                    {children}
                                </main>
                            </div>
                        </div>
                        <Toaster position="top-right" />
                        <ChatBot />
                    </AuthProvider>
                </Providers>
            </body>
        </html>
    );
}