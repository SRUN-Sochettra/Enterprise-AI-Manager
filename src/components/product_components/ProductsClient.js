"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Package,
    PackagePlus,
    Search,
    Pencil,
    Trash2,
    ChevronDown,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useAuth } from "@/src/context/AuthContext";
import ProductTable from "./ProductTable";
import CreateProduct from "./CreateProduct";
import SearchProductById from "./SearchProductById";
import UpdateProduct from "./UpdateProduct";
import DeleteProduct from "./DeleteProduct";
import ProtectedAction from "@/src/components/ProtectedAction";

const tabs = [
    { id: "table", label: "All Products", icon: Package, public: true },
    { id: "create", label: "Add New", icon: PackagePlus, role: "USER" },
    { id: "search", label: "Search by ID", icon: Search, public: true },
    { id: "update", label: "Update", icon: Pencil, role: "USER" },
    { id: "delete", label: "Delete", icon: Trash2, role: "ADMIN" },
];

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function ProductsClient({ products, categories }) {
    const [activeTab, setActiveTab] = useState("table");
    const { isLoggedIn, isAdmin } = useAuth();

    const canAccess = (tab) => {
        if (tab.public) return true;
        if (!isLoggedIn()) return false;
        if (tab.role === "ADMIN") return isAdmin();
        return true;
    };

    const visibleTabs = tabs.filter(canAccess);

    return (
        <div className="space-y-6">
            {/* Page header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-black text-white mb-1">
                        Product Management
                    </h1>
                    <p className="text-sm text-white/40">
                        Manage your catalog of{" "}
                        <span className="text-violet-400 font-semibold">
                            {products.length} products
                        </span>{" "}
                        across{" "}
                        <span className="text-blue-400 font-semibold">
                            {categories.length} categories
                        </span>
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20">
                        {products.length} products
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/20">
                        {categories.length} categories
                    </span>
                </div>
            </motion.div>

            {/* Tab bar */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex gap-1.5 flex-wrap"
            >
                {visibleTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                                isActive
                                    ? "bg-gradient-to-r from-violet-600/30 to-blue-600/20 text-white border border-violet-500/25 shadow-lg shadow-violet-500/10"
                                    : "glass border border-white/5 text-white/45 hover:text-white/80 hover:bg-white/5"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "w-4 h-4",
                                    isActive ? "text-violet-400" : "text-white/30"
                                )}
                            />
                            {tab.label}
                            {tab.role === "ADMIN" && (
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/20">
                                    ADMIN
                                </span>
                            )}
                            {tab.role === "USER" && (
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                                    USER
                                </span>
                            )}
                        </button>
                    );
                })}
            </motion.div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                >
                    {activeTab === "table" && (
                        <ProductTable products={products} categories={categories} />
                    )}

                    {activeTab === "create" && (
                        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                    <PackagePlus className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-white/90 text-sm">
                                        Add New Product
                                    </h2>
                                    <p className="text-xs text-white/35">
                                        Use AI to auto-fill from an image URL
                                    </p>
                                </div>
                            </div>
                            <ProtectedAction requiredRole="USER">
                                <CreateProduct categories={categories} />
                            </ProtectedAction>
                        </div>
                    )}

                    {activeTab === "search" && (
                        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-violet-500/20 flex items-center justify-center">
                                    <Search className="w-4 h-4 text-violet-400" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-white/90 text-sm">
                                        Search by ID
                                    </h2>
                                    <p className="text-xs text-white/35">
                                        Look up any product instantly
                                    </p>
                                </div>
                            </div>
                            <SearchProductById categories={categories} />
                        </div>
                    )}

                    {activeTab === "update" && (
                        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                    <Pencil className="w-4 h-4 text-amber-400" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-white/90 text-sm">
                                        Update Product
                                    </h2>
                                    <p className="text-xs text-white/35">
                                        Find and edit product details
                                    </p>
                                </div>
                            </div>
                            <ProtectedAction requiredRole="USER">
                                <UpdateProduct categories={categories} />
                            </ProtectedAction>
                        </div>
                    )}

                    {activeTab === "delete" && (
                        <div className="glass-card rounded-2xl border border-rose-500/10 overflow-hidden">
                            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center">
                                    <Trash2 className="w-4 h-4 text-rose-400" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-white/90 text-sm">
                                        Delete Product
                                    </h2>
                                    <p className="text-xs text-white/35">
                                        Permanently remove a product
                                    </p>
                                </div>
                            </div>
                            <ProtectedAction requiredRole="ADMIN">
                                <DeleteProduct categories={categories} />
                            </ProtectedAction>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}