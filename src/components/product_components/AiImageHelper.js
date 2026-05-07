"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ImageIcon, Wand2, X } from "lucide-react";
import toast from "react-hot-toast";

export default function AiImageHelper({ onApply }) {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    const analyzeImage = async () => {
        if (!url.trim()) return;
        setLoading(true);
        setPreview(null);
        try {
            const res = await fetch("/api/vision", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageUrl: url }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setPreview(data);
            toast.success("AI analyzed the image! ✨");
        } catch {
            toast.error("AI couldn't read that image URL");
        } finally {
            setLoading(false);
        }
    };

    const handleApply = () => {
        if (preview) {
            onApply(preview);
            setPreview(null);
            setUrl("");
        }
    };

    return (
        <div className="rounded-xl border border-dashed border-violet-500/25 bg-violet-500/5 p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                    AI Auto-Fill from Image
                </span>
                <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/20">
                    Gemini Vision
                </span>
            </div>

            {/* URL input */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
                    <input
                        type="text"
                        placeholder="Paste image URL (jpg, png)…"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && analyzeImage()}
                        className="w-full bg-white/5 border border-white/8 text-white placeholder-white/20 pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
                    />
                    {url && (
                        <button
                            onClick={() => { setUrl(""); setPreview(null); }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>
                <button
                    onClick={analyzeImage}
                    disabled={loading || !url.trim()}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold transition-all"
                >
                    {loading ? (
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Wand2 className="w-3.5 h-3.5" />
                    )}
                    {loading ? "Analyzing…" : "Analyze"}
                </button>
            </div>

            {/* AI Preview result */}
            <AnimatePresence>
                {preview && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="rounded-xl bg-white/5 border border-white/8 p-3 space-y-2"
                    >
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                            AI Suggestion
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="glass rounded-lg p-2 border border-white/5">
                                <p className="text-[9px] text-white/30 mb-0.5">Name</p>
                                <p className="text-xs text-white/80 font-semibold truncate">
                                    {preview.name}
                                </p>
                            </div>
                            <div className="glass rounded-lg p-2 border border-white/5">
                                <p className="text-[9px] text-white/30 mb-0.5">Price</p>
                                <p className="text-xs text-emerald-400 font-bold">
                                    ${preview.suggestedPrice}
                                </p>
                            </div>
                            <div className="glass rounded-lg p-2 border border-white/5">
                                <p className="text-[9px] text-white/30 mb-0.5">Category</p>
                                <p className="text-xs text-violet-400 font-semibold truncate">
                                    {preview.category}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleApply}
                            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold hover:opacity-90 transition-all shadow-lg shadow-violet-500/20"
                        >
                            <Wand2 className="w-3.5 h-3.5" />
                            Apply to Form
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}