"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Trophy,
  Target,
  Lightbulb,
  RefreshCw,
  BarChart3,
  Zap,
  Crown,
  Building2,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import toast from "react-hot-toast";
import { formatCurrency, formatNumber } from "@/src/lib/utils";

/* ── helpers ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
};

const CHART_COLORS = [
  "#60a5fa",
  "#a78bfa",
  "#34d399",
  "#fbbf24",
  "#f87171",
  "#22d3ee",
];

function StatCard({ icon: Icon, label, value, sub, gradient, delay = 0 }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={delay}
      className="glass-card rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <ArrowUpRight className="w-4 h-4 text-white/15 group-hover:text-white/40 transition-colors" />
      </div>
      <p className="text-2xl font-black text-white mb-0.5 tracking-tight">
        {value}
      </p>
      <p className="text-xs text-white/40 font-medium">{label}</p>
      {sub && <p className="text-[10px] text-white/25 mt-1">{sub}</p>}
    </motion.div>
  );
}

function InsightCard({ title, items, icon: Icon, color, delay = 0 }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={delay}
      className="glass-card rounded-2xl p-5 border border-white/5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-4 h-4 ${color}`} />
        <h3 className={`font-bold text-sm uppercase tracking-wider ${color}`}>
          {title}
        </h3>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay * 0.08 + i * 0.06 }}
            className="flex items-start gap-2.5 text-sm text-white/60"
          >
            <span
              className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${color.includes("yellow")
                  ? "bg-amber-400"
                  : color.includes("green")
                    ? "bg-emerald-400"
                    : "bg-blue-400"
                }`}
            />
            {item}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ── Custom Tooltip ─────────────────────────────── */
function CustomTooltip({ active, payload, label, prefix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-3 py-2 border border-white/10 text-xs">
      <p className="text-white/50 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-bold">
          {prefix}
          {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
}

/* ── Main Component ─────────────────────────────── */
export default function AIDashboard({ products, employees }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  /* quick stats (always visible) */
  const avgPrice =
    products.reduce((s, p) => s + (p.productPrice || 0), 0) /
    (products.length || 1);
  const avgSalary =
    employees.reduce((s, e) => s + (e.salary || 0), 0) /
    (employees.length || 1);
  const maxPrice = Math.max(...products.map((p) => p.productPrice || 0));
  const maxSalary = Math.max(...employees.map((e) => e.salary || 0));

  /* department breakdown for chart */
  const deptMap = {};
  employees.forEach((e) => {
    if (e.department) deptMap[e.department] = (deptMap[e.department] || 0) + 1;
  });
  const deptData = Object.entries(deptMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  /* salary range sparkline */
  const salaryBuckets = [0, 1000, 2000, 3000, 4000, 5000, 6000];
  const salaryData = salaryBuckets.map((bucket, i) => ({
    range: `$${bucket / 1000}k`,
    count: employees.filter(
      (e) =>
        e.salary >= bucket && e.salary < (salaryBuckets[i + 1] || Infinity)
    ).length,
  }));

  /* price distribution */
  const priceData = products.slice(0, 8).map((p) => ({
    name: p.productName?.slice(0, 12) || "—",
    price: p.productPrice || 0,
  }));

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products, employees }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setData(json);
      toast.success("AI analysis complete! ✨");
    } catch (error) {
      toast.error(error.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-black text-white mb-1">
            AI Business Dashboard
          </h1>
          <p className="text-sm text-white/40">
            Real-time data analysis powered by Gemini 2.5 Flash
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20">
            Gemini 2.5 Flash
          </span>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
            FREE
          </span>
        </div>
      </motion.div>

      {/* Quick stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Package}
          label="Total Products"
          value={formatNumber(products.length)}
          sub={`Max ${formatCurrency(maxPrice)}`}
          gradient="from-blue-500 to-cyan-600"
          delay={0}
        />
        <StatCard
          icon={Users}
          label="Total Employees"
          value={formatNumber(employees.length)}
          sub={`${deptData.length} departments`}
          gradient="from-violet-500 to-purple-600"
          delay={1}
        />
        <StatCard
          icon={DollarSign}
          label="Avg Product Price"
          value={formatCurrency(avgPrice)}
          sub="Across all categories"
          gradient="from-emerald-500 to-teal-600"
          delay={2}
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Salary"
          value={formatCurrency(avgSalary)}
          sub={`Top ${formatCurrency(maxSalary)}`}
          gradient="from-amber-500 to-orange-600"
          delay={3}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department bar chart */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="glass-card rounded-2xl p-5 border border-white/5"
        >
          <div className="flex items-center gap-2 mb-5">
            <Building2 className="w-4 h-4 text-violet-400" />
            <h3 className="font-bold text-sm text-white/80">
              Employees by Department
            </h3>
          </div>
          {deptData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={deptData} barCategoryGap="30%">
                <XAxis
                  dataKey="name"
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={24}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {deptData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-white/20 text-sm">
              No department data
            </div>
          )}
        </motion.div>

        {/* Salary distribution area chart */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={5}
          className="glass-card rounded-2xl p-5 border border-white/5"
        >
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-white/80">
              Salary Distribution
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={salaryData}>
              <defs>
                <linearGradient id="salaryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="range"
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={24}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#34d399"
                strokeWidth={2}
                fill="url(#salaryGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Price chart (full width) */}
      {priceData.length > 0 && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={6}
          className="glass-card rounded-2xl p-5 border border-white/5"
        >
          <div className="flex items-center gap-2 mb-5">
            <Package className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-sm text-white/80">
              Product Price Comparison
            </h3>
            <span className="ml-auto text-[10px] text-white/25">
              Top 8 products
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={priceData} barCategoryGap="25%">
              <XAxis
                dataKey="name"
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip content={<CustomTooltip prefix="$" />} />
              <Bar dataKey="price" radius={[6, 6, 0, 0]}>
                {priceData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* AI Analysis Section */}
      <AnimatePresence mode="wait">
        {!data ? (
          <motion.div
            key="cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative overflow-hidden glass-card rounded-3xl border border-blue-500/15 p-8 sm:p-12 text-center"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/8 via-violet-600/6 to-transparent rounded-3xl" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-violet-500/10 blur-3xl" />

            <div className="relative z-10 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/20 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-violet-400" />
              </div>
              <h2 className="text-2xl font-black text-white">
                Get AI Business Insights
              </h2>
              <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed">
                Let Gemini 2.5 Flash analyze your{" "}
                <span className="text-blue-400 font-medium">
                  {products.length} products
                </span>{" "}
                and{" "}
                <span className="text-violet-400 font-medium">
                  {employees.length} employees
                </span>{" "}
                to generate smart insights, highlights, and strategic
                recommendations.
              </p>
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/25 hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Analyzing your data...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate AI Insights
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Executive Summary */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="relative overflow-hidden glass-card rounded-2xl border border-blue-500/15 p-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/8 to-violet-600/5 rounded-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                    AI Executive Summary
                  </span>
                </div>
                <p className="text-white/80 text-base leading-relaxed">
                  {data.summary}
                </p>
              </div>
            </motion.div>

            {/* AI Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                icon={Trophy}
                label="Most Expensive Product"
                value={data.stats?.mostExpensiveProduct || "—"}
                gradient="from-amber-500 to-orange-600"
                delay={1}
              />
              <StatCard
                icon={Crown}
                label="Highest Paid Employee"
                value={data.stats?.highestPaidEmployee || "—"}
                gradient="from-violet-500 to-purple-600"
                delay={2}
              />
              <StatCard
                icon={Building2}
                label="Top Department"
                value={data.stats?.topDepartment || "—"}
                gradient="from-blue-500 to-cyan-600"
                delay={3}
              />
            </div>

            {/* Insights & Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InsightCard
                title="Key Highlights"
                items={data.highlights || []}
                icon={Lightbulb}
                color="text-amber-400"
                delay={4}
              />
              <InsightCard
                title="Recommendations"
                items={data.recommendations || []}
                icon={Target}
                color="text-emerald-400"
                delay={5}
              />
            </div>

            {/* Refresh */}
            <div className="text-center">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-white/8 text-white/50 text-sm font-medium hover:text-white/80 hover:bg-white/5 disabled:opacity-40 transition-all duration-200"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                {loading ? "Analyzing..." : "Refresh Analysis"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}