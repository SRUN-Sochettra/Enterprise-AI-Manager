"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, Mail, Building2, DollarSign, Hash } from "lucide-react";
import { getEmployeeById } from "@/src/lib/api/employees";
import { formatCurrency, formatDate, getDepartmentColor, cn } from "@/src/lib/utils";
import toast from "react-hot-toast";

export default function SearchEmployeeById() {
    const [id, setId] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!id.trim()) { toast.error("Please enter an ID"); return; }
        setLoading(true);
        setResult(null);
        try {
            const data = await getEmployeeById(id);
            if (!data) throw new Error("Employee not found");
            setResult(data);
            toast.success(`Employee #${data.employeeId} found!`);
        } catch (err) {
            toast.error(err.message || "Not found");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-5 space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                    <input
                        type="text"
                        inputMode="numeric"
                        value={id}
                        onChange={(e) => setId(e.target.value.replace(/\D/g, ""))}
                        placeholder="Enter employee ID…"
                        className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || !id}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Search className="w-4 h-4" />
                    )}
                    {loading ? "Searching…" : "Search"}
                </button>
            </form>

            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="rounded-2xl border border-blue-500/20 bg-blue-500/5 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-violet-500/30 border border-white/8 flex items-center justify-center text-sm font-bold text-white/70">
                                {(result.firstName?.[0] || "") + (result.lastName?.[0] || "")}
                            </div>
                            <div>
                                <p className="font-bold text-white/90">
                                    {result.firstName} {result.lastName}
                                </p>
                                <p className="text-xs text-blue-400 font-medium">
                                    Employee #{result.employeeId}
                                </p>
                            </div>
                        </div>

                        {/* Details grid */}
                        <div className="p-5 grid grid-cols-2 gap-3">
                            {[
                                { icon: Mail, label: "Email", value: result.email },
                                { icon: Building2, label: "Department", value: result.department },
                                { icon: DollarSign, label: "Salary", value: formatCurrency(result.salary) },
                                { icon: User, label: "Joined", value: formatDate(result.createdAt) },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="glass rounded-xl p-3 border border-white/5">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Icon className="w-3 h-3 text-white/30" />
                                        <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                                            {label}
                                        </span>
                                    </div>
                                    <p className="text-sm text-white/80 font-medium truncate">
                                        {value || "—"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}