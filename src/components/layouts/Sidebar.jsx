"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    Package,
    Bot,
    Search,
    Home,
    Info,
    Mail,
    ChevronLeft,
    ChevronRight,
    Zap,
} from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { cn } from "@/src/lib/utils";

const navSections = [
    {
        label: "Main",
        items: [
            { href: "/", label: "Home", icon: Home },
            { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        ],
    },
    {
        label: "Management",
        items: [
            { href: "/employees", label: "Employees", icon: Users },
            { href: "/products", label: "Products", icon: Package },
        ],
    },
    {
        label: "AI Tools",
        items: [
            { href: "/ai", label: "AI Assistant", icon: Bot, highlight: true },
            { href: "/search", label: "Smart Search", icon: Search, highlight: true },
        ],
    },
    {
        label: "Company",
        items: [
            { href: "/about", label: "About", icon: Info },
            { href: "/contact", label: "Contact", icon: Mail },
        ],
    },
];

/* ── Extracted nav item so it is never created inside render ── */
function NavItem({ item, pathname, collapsed, onNavigate }) {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                isActive
                    ? "bg-linear-to-r from-blue-600/30 to-violet-600/20 text-white border border-blue-500/20 shadow-lg shadow-blue-500/5"
                    : item.highlight
                        ? "text-violet-300/70 hover:text-violet-200 hover:bg-violet-500/10"
                        : "text-white/50 hover:text-white/90 hover:bg-white/5"
            )}
        >
            {isActive && (
                <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-linear-to-b from-blue-400 to-violet-500 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
            )}

            <Icon
                className={cn(
                    "w-4 h-4 shrink-0 transition-all duration-200",
                    isActive
                        ? "text-blue-400"
                        : item.highlight
                            ? "text-violet-400 group-hover:text-violet-300"
                            : "text-white/40 group-hover:text-white/70",
                    collapsed ? "mx-auto" : ""
                )}
            />

            <AnimatePresence>
                {!collapsed && (
                    <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="overflow-hidden whitespace-nowrap"
                    >
                        {item.label}
                    </motion.span>
                )}
            </AnimatePresence>

            {item.highlight && !collapsed && (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/20"
                >
                    AI
                </motion.span>
            )}
        </Link>
    );
}

/* ── Extracted so it is never defined inside render ── */
function SidebarContent({ collapsed, setCollapsed, pathname, user, isLoggedIn, onNavigate }) {
    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between px-4 py-5 border-b border-white/5">
                <AnimatePresence mode="wait">
                    {!collapsed ? (
                        <motion.div
                            key="full-logo"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-2.5"
                        >
                            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg animate-pulse-glow">
                                <Zap className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <span className="font-bold text-base gradient-text">NexusAI</span>
                                <p className="text-[10px] text-white/30 leading-none mt-0.5">Enterprise Suite</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="icon-logo"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto shadow-lg"
                        >
                            <Zap className="w-4 h-4 text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden md:flex w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 items-center justify-center transition-all duration-200 text-white/40 hover:text-white/80"
                >
                    {collapsed
                        ? <ChevronRight className="w-3.5 h-3.5" />
                        : <ChevronLeft className="w-3.5 h-3.5" />}
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
                {navSections.map((section) => (
                    <div key={section.label}>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-[10px] font-semibold text-white/25 uppercase tracking-widest px-3 mb-2"
                                >
                                    {section.label}
                                </motion.p>
                            )}
                        </AnimatePresence>

                        <div className="space-y-0.5">
                            {section.items.map((item) => (
                                <NavItem
                                    key={item.href}
                                    item={item}
                                    pathname={pathname}
                                    collapsed={collapsed}
                                    onNavigate={onNavigate}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User profile */}
            {isLoggedIn && user && (
                <div className="px-3 py-4 border-t border-white/5">
                    <div
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/3 border border-white/5",
                            collapsed ? "justify-center" : ""
                        )}
                    >
                        {user.image ? (
                            <Image
                                src={user.image}
                                alt={user.username || "User"}
                                width={32}
                                height={32}
                                className="rounded-full border border-white/10 shrink-0"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {(user?.username || user?.email || "U")[0].toUpperCase()}
                            </div>
                        )}

                        <AnimatePresence>
                            {!collapsed && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="overflow-hidden flex-1 min-w-0"
                                >
                                    <p className="text-xs font-semibold text-white/80 truncate">
                                        {user?.username || user?.email?.split("@")[0]}
                                    </p>
                                    <p className={cn(
                                        "text-[10px] font-medium",
                                        user?.role === "ADMIN"
                                            ? "text-rose-400"
                                            : user?.provider === "google"
                                                ? "text-blue-400"
                                                : "text-emerald-400"
                                    )}>
                                        {user?.provider === "google" ? "Google" : user?.role}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Main export ── */
export default function Sidebar() {
    const pathname = usePathname();
    const { user, isLoggedIn } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const contentProps = {
        collapsed,
        setCollapsed,
        pathname,
        user,
        isLoggedIn: isLoggedIn(),
        onNavigate: () => setMobileOpen(false),
    };

    return (
        <>
            {/* Desktop sidebar */}
            <motion.aside
                animate={{ width: collapsed ? 72 : 256 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden md:flex fixed left-0 top-0 h-screen sidebar-gradient border-r border-white/5 z-40 flex-col overflow-hidden"
            >
                <SidebarContent {...contentProps} />
            </motion.aside>

            {/* Mobile hamburger */}
            <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl glass flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Mobile overlay + drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="md:hidden fixed left-0 top-0 h-screen w-64 sidebar-gradient border-r border-white/5 z-50 flex flex-col overflow-hidden"
                        >
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
                            >
                                ✕
                            </button>
                            <SidebarContent {...contentProps} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}