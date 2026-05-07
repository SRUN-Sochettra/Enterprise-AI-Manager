"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    Search,
    X,
} from "lucide-react";
import { cn, formatCurrency, formatDate, getDepartmentColor } from "@/src/lib/utils";

/* ── Moved outside component to fix react-hooks/static-components ── */
function SortIcon({ field, sortBy, sortOrder }) {
    if (sortBy !== field)
        return <ChevronsUpDown className="w-3.5 h-3.5 text-white/20 ml-1" />;
    return sortOrder === "asc"
        ? <ChevronUp className="w-3.5 h-3.5 text-blue-400 ml-1" />
        : <ChevronDown className="w-3.5 h-3.5 text-blue-400 ml-1" />;
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

export default function EmployeeTable({ employees }) {
    const [search, setSearch] = useState("");
    const [filterDept, setFilterDept] = useState("");
    const [sortBy, setSortBy] = useState("employeeId");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(8);

    const departments = [...new Set(employees.map((e) => e.department))]
        .filter(Boolean)
        .sort();

    const filtered = employees.filter((e) => {
        const q = search.toLowerCase();
        const matchSearch =
            !q ||
            e.firstName?.toLowerCase().includes(q) ||
            e.lastName?.toLowerCase().includes(q) ||
            e.email?.toLowerCase().includes(q) ||
            String(e.employeeId).includes(q);
        const matchDept = !filterDept || e.department === filterDept;
        return matchSearch && matchDept;
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

    const resetFilters = () => { setSearch(""); setFilterDept(""); setCurrentPage(1); };
    const hasFilters = search || filterDept;

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
                    <p className="text-sm font-bold text-white/80">All Employees</p>
                    <p className="text-xs text-white/30 mt-0.5">
                        {hasFilters ? `${sorted.length} of ${employees.length} results` : `${employees.length} total`}
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
                        <input
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                            placeholder="Search employees…"
                            className="bg-white/5 border border-white/8 text-white placeholder-white/20 pl-9 pr-3 py-2 rounded-xl text-xs w-52 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60">
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    <select
                        value={filterDept}
                        onChange={(e) => { setFilterDept(e.target.value); setCurrentPage(1); }}
                        className="bg-white/5 border border-white/8 text-white/60 py-2 px-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                    >
                        <option value="">All Departments</option>
                        {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>

                    {hasFilters && (
                        <button onClick={resetFilters} className="text-xs text-blue-400 hover:text-blue-300 transition-colors px-2 py-1.5 rounded-lg hover:bg-blue-500/10">
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
                            <ThCell field="employeeId" label="ID"         {...thProps} />
                            <ThCell field="firstName" label="Name"       {...thProps} />
                            <ThCell field="email" label="Email"      {...thProps} />
                            <ThCell field="department" label="Department" {...thProps} />
                            <ThCell field="salary" label="Salary"     {...thProps} />
                            <ThCell field="createdAt" label="Joined"     {...thProps} />
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {paginatedData.map((emp, i) => (
                                <motion.tr
                                    key={emp.employeeId}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2, delay: i * 0.03 }}
                                    className="border-b border-white/3 hover:bg-white/3 transition-colors duration-150 group"
                                >
                                    <td className="px-5 py-4">
                                        <span className="text-xs font-bold text-blue-400/70 bg-blue-400/8 px-2 py-0.5 rounded-lg">
                                            #{emp.employeeId}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500/30 to-violet-500/30 border border-white/8 flex items-center justify-center text-xs font-bold text-white/70 shrink-0">
                                                {(emp.firstName?.[0] || "") + (emp.lastName?.[0] || "")}
                                            </div>
                                            <span className="font-semibold text-white/80 group-hover:text-white transition-colors">
                                                {emp.firstName} {emp.lastName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-white/45 text-xs">{emp.email}</td>
                                    <td className="px-5 py-4">
                                        <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-lg border", getDepartmentColor(emp.department))}>
                                            {emp.department || "—"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-emerald-400 font-bold text-sm">
                                            {formatCurrency(emp.salary)}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-white/30 text-xs">
                                        {formatDate(emp.createdAt)}
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>

                {sorted.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-3xl mb-3">🔍</p>
                        <p className="text-white/50 font-semibold">No employees found</p>
                        <p className="text-white/25 text-sm mt-1">
                            {employees.length === 0 ? "Add your first employee above" : "Try a different search"}
                        </p>
                        {hasFilters && (
                            <button onClick={resetFilters} className="mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors">
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
                                            ? "bg-linear-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20"
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