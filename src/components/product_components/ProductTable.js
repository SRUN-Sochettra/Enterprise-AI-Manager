"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, ChevronsUpDown, Search, X } from "lucide-react";
import { cn, formatCurrency } from "@/src/lib/utils";
import TranslateText from "@/src/components/TranslateText";

const CATEGORY_COLORS = [
    "text-blue-400    bg-blue-400/10    border-blue-400/20",
    "text-violet-400  bg-violet-400/10  border-violet-400/20",
    "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    "text-amber-400   bg-amber-400/10   border-amber-400/20",
    "text-rose-400    bg-rose-400/10    border-rose-400/20",
    "text-cyan-400    bg-cyan-400/10    border-cyan-400/20",
];

/* ── Moved outside to fix react-hooks/static-components ── */
function SortIcon({ field, sortBy, sortOrder }) {
    if (sortBy !== field)
        return <ChevronsUpDown className="w-3.5 h-3.5 text-white/20 ml-1" />;
    return sortOrder === "asc"
        ? <ChevronUp className="w-3.5 h-3.5 text-violet-400 ml-1" />
        : <ChevronDown className="w-3.5 h-3.5 text-violet-400 ml-1" />;
}

function ThCell({ field, label, onSort, sortBy, sortOrder }) {
    return (
        <th
            onClick={() => onSort(field)}
            className="px-5 py-3.5 text-left text-[11px] font-bold text-white/35 uppercase tracking-wider cursor-pointer select-none hover:text-white/70 transition-colors"
        >
            <span className="flex items-center gap-0.5">
                {label}
                <SortIcon field={field} sortBy={sortBy} sortOrder={sortOrder} />
            </span>
        </th>
    );
}

export default function ProductTable({ products, categories }) {
    const [search, setSearch] = useState("");
    const [filterCat, setFilterCat] = useState("");
    const [sortBy, setSortBy] = useState("productId");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(8);

    const getCategoryName = (id) => categories.find((c) => c.categoryId === id)?.categoryName || "Unknown";
    const getCategoryColor = (id) => {
        const idx = categories.findIndex((c) => c.categoryId === id);
        return CATEGORY_COLORS[idx % CATEGORY_COLORS.length] || CATEGORY_COLORS[0];
    };

    const filtered = products.filter((p) => {
        const q = search.toLowerCase();
        const matchSearch =
            !q ||
            p.productName?.toLowerCase().includes(q) ||
            String(p.productId).includes(q) ||
            getCategoryName(p.categoryId).toLowerCase().includes(q);
        const matchCat = !filterCat || String(p.categoryId) === filterCat;
        return matchSearch && matchCat;
    });

    const sorted = [...filtered].sort((a, b) => {
        let va = a[sortBy], vb = b[sortBy];
        if (typeof va === "string") { va = va.toLowerCase(); vb = vb.toLowerCase(); }
        return sortOrder === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });

    const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = sorted.slice(startIndex, startIndex + rowsPerPage);

    const handleSort = (field) => {
        if (sortBy === field) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
        else { setSortBy(field); setSortOrder("asc"); }
    };

    const resetFilters = () => { setSearch(""); setFilterCat(""); setCurrentPage(1); };
    const hasFilters = search || filterCat;

    const pages = (() => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const p = [];
        p.push(1);
        if (currentPage > 3) p.push("…");
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) p.push(i);
        if (currentPage < totalPages - 2) p.push("…");
        p.push(totalPages);
        return p;
    })();

    const thProps = { onSort: handleSort, sortBy, sortOrder };

    return (
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
            {/* Toolbar */}
            <div className="px-5 py-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                    <p className="text-sm font-bold text-white/80">All Products</p>
                    <p className="text-xs text-white/30 mt-0.5">
                        {hasFilters ? `${sorted.length} of ${products.length} results` : `${products.length} total`}
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
                        <input
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                            placeholder="Search products…"
                            className="bg-white/5 border border-white/8 text-white placeholder-white/20 pl-9 pr-3 py-2 rounded-xl text-xs w-52 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60">
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    <select
                        value={filterCat}
                        onChange={(e) => { setFilterCat(e.target.value); setCurrentPage(1); }}
                        className="bg-white/5 border border-white/8 text-white/60 py-2 px-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
                    >
                        <option value="">All Categories</option>
                        {categories.map((c) => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
                    </select>

                    {hasFilters && (
                        <button onClick={resetFilters} className="text-xs text-violet-400 hover:text-violet-300 transition-colors px-2 py-1.5 rounded-lg hover:bg-violet-500/10">
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="border-b border-white/5">
                        <tr>
                            <ThCell field="productId" label="ID"           {...thProps} />
                            <ThCell field="productName" label="Product Name" {...thProps} />
                            <ThCell field="productPrice" label="Price"        {...thProps} />
                            <ThCell field="categoryId" label="Category"     {...thProps} />
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {paginatedData.map((product, i) => (
                                <motion.tr
                                    key={product.productId}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2, delay: i * 0.03 }}
                                    className="border-b border-white/3 hover:bg-white/3 transition-colors duration-150 group"
                                >
                                    <td className="px-5 py-4">
                                        <span className="text-xs font-bold text-violet-400/70 bg-violet-400/8 px-2 py-0.5 rounded-lg">
                                            #{product.productId}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 max-w-55">
                                        <TranslateText text={product.productName} />
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-emerald-400 font-bold">
                                            {formatCurrency(product.productPrice)}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-lg border", getCategoryColor(product.categoryId))}>
                                            {getCategoryName(product.categoryId)}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>

                {sorted.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-3xl mb-3">📦</p>
                        <p className="text-white/50 font-semibold">No products found</p>
                        <p className="text-white/25 text-sm mt-1">
                            {products.length === 0 ? "Add your first product above" : "Try a different search"}
                        </p>
                        {hasFilters && (
                            <button onClick={resetFilters} className="mt-3 text-sm text-violet-400 hover:text-violet-300 transition-colors">
                                Clear filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {sorted.length > 0 && (
                <div className="px-5 py-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-white/35">
                        <span>Rows per page:</span>
                        <select
                            value={rowsPerPage}
                            onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            className="bg-white/5 border border-white/8 text-white/60 py-1 px-2 rounded-lg text-xs focus:outline-none"
                        >
                            {[5, 8, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 text-white/40 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs"
                        >‹</button>

                        {pages.map((page, i) =>
                            page === "…" ? (
                                <span key={`d${i}`} className="w-8 h-8 flex items-center justify-center text-white/25 text-xs">…</span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={cn(
                                        "w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-200",
                                        currentPage === page
                                            ? "bg-linear-to-br from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/20"
                                            : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                                    )}
                                >{page}</button>
                            )
                        )}

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 text-white/40 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs"
                        >›</button>
                    </div>

                    <p className="text-xs text-white/25">Page {currentPage} of {totalPages}</p>
                </div>
            )}
        </div>
    );
}