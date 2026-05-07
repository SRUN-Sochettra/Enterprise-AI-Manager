"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/src/context/AuthContext";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logoutUser, isLoggedIn } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
        { href: "/employees", label: "Employees" },
        { href: "/products", label: "Products" },
        { href: "/dashboard", label: "📊 Dashboard" },
        { href: "/search", label: "🔍 Search" }, // ← ADD
        { href: "/ai", label: "🤖 AI" },
    ];

    const handleLogout = async () => {
        await logoutUser();
        setIsOpen(false);
        router.push("/");
    };

    return (
        <nav className="bg-gray-900 border-b border-gray-700 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-xl font-bold text-white tracking-wide hover:text-blue-400 transition-colors duration-200"
                    >
                        🚀 Next.js App
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                    ${pathname === link.href
                                        ? "bg-blue-600 text-white shadow-md"
                                        : link.href === "/ai"
                                            ? "text-purple-400 hover:bg-purple-700 hover:text-white"
                                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Auth Section (Desktop) */}
                        {isLoggedIn() ? (
                            <div className="flex items-center gap-2 ml-2">
                                {/* Google Avatar */}
                                {user?.image ? (
                                    <Image
                                        src={user.image}
                                        alt={user.username || "User"}
                                        width={32}
                                        height={32}
                                        className="rounded-full border-2 border-gray-600"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold border-2 border-gray-600">
                                        {(user?.username || user?.email || "U")[0].toUpperCase()}
                                    </div>
                                )}
                                {/* Username */}
                                <span className="text-gray-300 text-sm max-w-[100px] truncate">
                                    {user?.username || user?.email?.split("@")[0]}
                                </span>
                                {/* Role Badge */}
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user?.role === "ADMIN"
                                    ? "bg-red-600/20 text-red-400"
                                    : user?.provider === "google"
                                        ? "bg-blue-600/20 text-blue-400"
                                        : "bg-green-600/20 text-green-400"
                                    }`}>
                                    {user?.provider === "google" ? "Google" : user?.role}
                                </span>
                                <button
                                    id="desktop-logout-btn"
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-200 shadow-md cursor-pointer"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className={`ml-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                    ${pathname === "/login"
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md"
                                    }`}
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-gray-300 hover:text-white focus:outline-none"
                    >
                        {isOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden pb-4 space-y-1">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                    ${pathname === link.href
                                        ? "bg-blue-600 text-white shadow-md"
                                        : link.href === "/ai"
                                            ? "text-purple-400 hover:bg-purple-700 hover:text-white"
                                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Auth Section (Mobile) */}
                        {isLoggedIn() ? (
                            <div className="px-4 py-2 flex items-center gap-2">
                                {/* Google Avatar Mobile */}
                                {user?.image ? (
                                    <Image
                                        src={user.image}
                                        alt={user.username || "User"}
                                        width={28}
                                        height={28}
                                        className="rounded-full border-2 border-gray-600"
                                    />
                                ) : (
                                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                        {(user?.username || user?.email || "U")[0].toUpperCase()}
                                    </div>
                                )}
                                <span className="text-gray-300 text-sm flex-1 truncate">
                                    {user?.username || user?.email?.split("@")[0]}
                                </span>
                                <button
                                    id="mobile-logout-btn"
                                    onClick={handleLogout}
                                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-200 cursor-pointer"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}