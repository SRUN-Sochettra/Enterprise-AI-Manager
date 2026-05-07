"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LogOut,
  LogIn,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import toast from "react-hot-toast";

const pageTitles = {
  "/":          "Home",
  "/dashboard": "AI Dashboard",
  "/employees": "Employee Management",
  "/products":  "Product Management",
  "/ai":        "AI Assistant",
  "/search":    "Smart Search",
  "/about":     "About",
  "/contact":   "Contact",
  "/login":     "Sign In",
};

const pageDescriptions = {
  "/":          "Welcome to NexusAI",
  "/dashboard": "AI-powered business insights",
  "/employees": "Manage your team",
  "/products":  "Manage your catalog",
  "/ai":        "Chat with Gemini 2.5 Flash",
  "/search":    "Natural language search",
  "/about":     "Learn about us",
  "/contact":   "Get in touch",
};

export default function TopBar() {
  const pathname              = usePathname();
  const router                = useRouter();
  const { user, logoutUser, isLoggedIn } = useAuth();
  const [dropdownOpen, setDropdownOpen]  = useState(false);

  const title       = pageTitles[pathname]       || "NexusAI";
  const description = pageDescriptions[pathname] || "";

  const handleLogout = async () => {
    await logoutUser();
    setDropdownOpen(false);
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-30 glass border-b border-white/5 px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between"
    >
      {/* Left: Page title */}
      <div className="flex items-center gap-3 ml-12 md:ml-0">
        <div>
          <h1 className="text-base font-bold text-white/90 leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-xs text-white/35 leading-none mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Gemini chip */}
        <Link
          href="/ai"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-linear-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/20 text-blue-300 text-xs font-medium hover:from-blue-600/30 hover:to-violet-600/30 transition-all duration-200"
        >
          <Sparkles className="w-3 h-3 text-violet-400" />
          Gemini 2.5
        </Link>

        {/* Auth section */}
        {isLoggedIn() ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all duration-200"
            >
              {/* Avatar */}
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.username || "User"}
                  width={26}
                  height={26}
                  className="rounded-full border border-white/10"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-[10px] font-bold">
                  {(user?.username || user?.email || "U")[0].toUpperCase()}
                </div>
              )}
              <span className="hidden sm:block text-xs font-medium text-white/70 max-w-20 truncate">
                {user?.username || user?.email?.split("@")[0]}
              </span>
              <ChevronDown
                className={cn(
                  "w-3 h-3 text-white/30 transition-transform duration-200",
                  dropdownOpen ? "rotate-180" : ""
                )}
              />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 glass-card rounded-2xl border border-white/8 shadow-2xl overflow-hidden z-50"
              >
                {/* User info */}
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-sm font-semibold text-white/90 truncate">
                    {user?.username || user?.email?.split("@")[0]}
                  </p>
                  <p className="text-xs text-white/40 truncate mt-0.5">
                    {user?.email || ""}
                  </p>
                  <span
                    className={cn(
                      "inline-flex mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full",
                      user?.role === "ADMIN"
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/20"
                        : user?.provider === "google"
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/20"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                    )}
                  >
                    {user?.provider === "google" ? "Google OAuth" : user?.role}
                  </span>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </motion.div>
            )}

            {/* Click outside to close */}
            {dropdownOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-linear-to-r from-blue-600 to-violet-600 text-white text-xs font-semibold hover:opacity-90 transition-all duration-200 shadow-lg shadow-blue-500/20"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </Link>
        )}
      </div>
    </motion.header>
  );
}