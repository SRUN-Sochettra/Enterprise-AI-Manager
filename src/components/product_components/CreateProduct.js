"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PackagePlus, DollarSign, Tag } from "lucide-react";
import { createProduct } from "@/src/lib/api/products";
import AiImageHelper from "./AiImageHelper";
import toast from "react-hot-toast";

const inputCls =
    "w-full bg-white/5 border border-white/8 text-white placeholder-white/20 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/30 transition-all duration-200";

export default function CreateProduct({ categories }) {
    const [form, setForm] = useState({
        productName: "", productPrice: "", categoryId: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleAiSuggestion = (data) => {
        const matched = categories.find((c) =>
            c.categoryName.toLowerCase().includes(data.category?.toLowerCase() || "") ||
            (data.category || "").toLowerCase().includes(c.categoryName.toLowerCase())
        );
        setForm({
            productName: data.name || "",
            productPrice: data.suggestedPrice || "",
            categoryId: matched ? String(matched.categoryId) : "",
        });
        if (matched) toast.success(`Category matched: ${matched.categoryName} ✅`);
        else toast("Couldn't match category — select manually", { icon: "⚠️" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.productName.trim()) {
            toast.error("Product name is required");
            return;
        }
        setLoading(true);
        try {
            const result = await createProduct({
                ...form,
                productPrice: form.productPrice ? parseFloat(form.productPrice) : 0,
                categoryId: form.categoryId ? parseInt(form.categoryId) : null,
            });
            const data = result.data ?? result;
            toast.success(`"${data.productName}" created! 🎉`);
            setForm({ productName: "", productPrice: "", categoryId: "" });
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-5 space-y-4"
        >
            {/* AI Image Helper */}
            <AiImageHelper onApply={handleAiSuggestion} />

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Product name */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                        Product Name *
                    </label>
                    <input
                        type="text"
                        name="productName"
                        value={form.productName}
                        onChange={handleChange}
                        placeholder="e.g. Wireless Headphones Pro"
                        className={inputCls}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Price */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                            <DollarSign className="w-3 h-3" /> Price
                        </label>
                        <input
                            type="number"
                            name="productPrice"
                            value={form.productPrice}
                            onChange={handleChange}
                            placeholder="99.99"
                            step="0.01"
                            min="0"
                            className={inputCls}
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                            <Tag className="w-3 h-3" /> Category
                        </label>
                        <select
                            name="categoryId"
                            value={form.categoryId}
                            onChange={handleChange}
                            className={inputCls}
                        >
                            <option value="">Select category…</option>
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
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <PackagePlus className="w-4 h-4" />
                    )}
                    {loading ? "Creating…" : "Create Product"}
                </button>
            </form>
        </motion.div>
    );
}