"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, RotateCcw, ChevronDown } from "lucide-react";
import { cn } from "@/src/lib/utils";
import toast from "react-hot-toast";

const LANGUAGES = [
    { code: "es", flag: "🇪🇸", label: "Spanish" },
    { code: "fr", flag: "🇫🇷", label: "French" },
    { code: "de", flag: "🇩🇪", label: "German" },
    { code: "zh", flag: "🇨🇳", label: "Chinese" },
    { code: "ar", flag: "🇸🇦", label: "Arabic" },
    { code: "ja", flag: "🇯🇵", label: "Japanese" },
    { code: "ko", flag: "🇰🇷", label: "Korean" },
    { code: "pt", flag: "🇵🇹", label: "Portuguese" },
];

export default function TranslateText({ text }) {
    const [translated, setTranslated] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedLang, setSelectedLang] = useState("es");
    const [showControls, setShowControls] = useState(false);

    const handleTranslate = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, targetLanguage: selectedLang }),
            });
            const data = await res.json();

            if (data.loading) {
                toast("Model loading, try again in 20s", { icon: "⏳" });
                return;
            }
            if (!res.ok) throw new Error(data.error);

            const lang = LANGUAGES.find((l) => l.code === selectedLang);
            setTranslated({ text: data.translated, lang });
            setShowControls(false);
        } catch (err) {
            toast.error(err.message || "Translation failed");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setTranslated(null);
        setShowControls(false);
    };

    return (
        <div className="group/translate">
            {/* Text display */}
            <p className="text-sm font-semibold text-white/80 leading-snug">
                {translated ? translated.text : text}
            </p>

            {/* Translation badge */}
            <AnimatePresence>
                {translated && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex items-center gap-1.5 mt-1"
                    >
                        <span className="text-[10px] text-violet-400/70 flex items-center gap-1">
                            <Globe className="w-2.5 h-2.5" />
                            {translated.lang?.flag} {translated.lang?.label}
                        </span>
                        <button
                            onClick={handleReset}
                            className="text-[10px] text-white/25 hover:text-white/60 transition-colors flex items-center gap-0.5"
                        >
                            <RotateCcw className="w-2.5 h-2.5" />
                            Original
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Translate controls (shown on hover or when active) */}
            {!translated && (
                <div className="mt-1 flex items-center gap-1.5 opacity-0 group-hover/translate:opacity-100 transition-opacity duration-200">
                    {/* Language selector */}
                    <div className="relative">
                        <select
                            value={selectedLang}
                            onChange={(e) => setSelectedLang(e.target.value)}
                            className="appearance-none bg-white/5 border border-white/8 text-white/50 text-[10px] pl-2 pr-5 py-0.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500/40 cursor-pointer hover:bg-white/8 transition-all"
                        >
                            {LANGUAGES.map((l) => (
                                <option key={l.code} value={l.code}>
                                    {l.flag} {l.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-white/25 pointer-events-none" />
                    </div>

                    {/* Translate button */}
                    <button
                        onClick={handleTranslate}
                        disabled={loading}
                        className={cn(
                            "flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-lg transition-all",
                            loading
                                ? "text-white/20 cursor-not-allowed"
                                : "text-violet-400/70 hover:text-violet-300 hover:bg-violet-500/10 border border-violet-500/20"
                        )}
                    >
                        {loading ? (
                            <div className="w-2.5 h-2.5 border border-white/20 border-t-violet-400 rounded-full animate-spin" />
                        ) : (
                            <Globe className="w-2.5 h-2.5" />
                        )}
                        {loading ? "…" : "Translate"}
                    </button>
                </div>
            )}
        </div>
    );
}