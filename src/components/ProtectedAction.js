"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, ShieldAlert, LogIn } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";

export default function ProtectedAction({ children, requiredRole = "USER" }) {
  const { user, isLoggedIn, isAdmin, loading } = useAuth();

  if (loading) return (
    <div className="p-6 flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
    </div>
  );

  if (!isLoggedIn()) return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 text-center"
    >
      <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center mx-auto mb-3">
        <LogIn className="w-5 h-5 text-blue-400" />
      </div>
      <p className="text-white/60 text-sm font-medium mb-3">
        Sign in to access this feature
      </p>
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-semibold hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
      >
        <LogIn className="w-3.5 h-3.5" />
        Sign In
      </Link>
    </motion.div>
  );

  if (requiredRole === "ADMIN" && !isAdmin()) return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 text-center"
    >
      <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/20 flex items-center justify-center mx-auto mb-3">
        <ShieldAlert className="w-5 h-5 text-rose-400" />
      </div>
      <p className="text-white/60 text-sm font-medium">
        Admin access required
      </p>
      <p className="text-white/30 text-xs mt-1">
        Logged in as{" "}
        <span className="text-emerald-400 font-semibold">{user?.role}</span>
      </p>
    </motion.div>
  );

  return children;
}