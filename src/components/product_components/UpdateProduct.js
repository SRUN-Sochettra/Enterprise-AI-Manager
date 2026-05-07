"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Pencil, Hash, DollarSign, Tag, X } from "lucide-react";
import { getProductById, updateProduct } from "@/src/lib/api/products";
import toast from "react-hot-toast";

const inputCls =
    "w-full bg-white/5 border border-white/8 text-white placeholder-white/20 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/30 transition-all duration-200";

export default function UpdateProduct({ categories }) {
    const [id, setId] = useState("");
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFetch = async (e) => {
        e.preventDefault();
        if (!id.trim()) { toast.error("Please enter an ID"); return; }
        setLoading(true);
        try {
            const data = await getProductById(id);
            if (!data) throw new Error("Product not found");
            setForm({
                productName: data.productName || "",
                productPrice: data.productPrice || "",
                categoryId: data.categoryId ? String(data.categoryId) : "",
            });
            toast.success(`Product #${id} loaded!`);
        } catch (err) {
            toast.error(err.message || "Not found");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!form.productName.trim()) {
            toast.error("Product name is required");
            return;
        }
        setLoading(true);
        try {
            const result = await updateProduct(id, {
                ...form,
                productPrice: form.productPrice ? parseFloat(form.productPrice) : 0,
                categoryId: form.categoryId ? parseInt(form.categoryId) : null,
            });
            const data = result.data ?? result;
            toast.success(`"${data.productName}" updated! ✨`);
            setForm(null);
            setId("");
        } catch (err) {
            toast.error(err.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-5 space-y-4">
            <AnimatePresence mode="wait">
                {!form ? (
                    <motion.form
                        key="search"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleFetch}
                        className="flex gap-2"
                    >
                        <div className="relative flex-1">
                            <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                            <input
                                type="text"
                                inputMode="numeric"
                                value={id}
                                onChange={(e) => setId(e.target.value.replace(/\D/g, ""))}
                                placeholder="Enter product ID to edit…"
                                className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !id}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-amber-500/20"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Search className="w-4 h-4" />
                            )}
                            Find
                        </button>
                    </motion.form>
                ) : (
                    <motion.form
                        key="edit"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        onSubmit={handleUpdate}
                        className="space-y-4"
                    >
                        {/* Editing badge */}
                        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-amber-500/8 border border-amber-500/20">
                            <div className="flex items-center gap-2">
                                <Pencil className="w-3.5 h-3.5 text-amber-400" />
                                <span className="text-xs font-semibold text-amber-400">
                                    Editing Product #{id}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => { setForm(null); setId(""); }}
                                className="text-white/30 hover:text-white/70 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                                Product Name *
                            </label>
                            <input
                                name="productName"
                                value={form.productName}
                                onChange={(e) => setForm((p) => ({ ...p, productName: e.target.value }))}
                                placeholder="Product name"
                                className={inputCls}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" /> Price
                                </label>
                                <input
                                    type="number"
                                    name="productPrice"
                                    value={form.productPrice}
                                    onChange={(e) => setForm((p) => ({ ...p, productPrice: e.target.value }))}
                                    placeholder="0.00"
                                    step="0.01"
                                    className={inputCls}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1">
                                    <Tag className="w-3 h-3" /> Category
                                </label>
                                <select
                                    name="categoryId"
                                    value={form.categoryId}
                                    onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
                                    className={inputCls}
                                >
                                    <option value="">Select…</option>
                                    {categories.map((c) => (
                                        <option key={c.categoryId} value={c.categoryId}>
                                            {c.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-amber-500/20 hover:-translate-y-0.5"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Pencil className="w-4 h-4" />
                            )}
                            {loading ? "Updating…" : "Save Changes"}
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}