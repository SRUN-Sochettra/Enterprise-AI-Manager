"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BarChart3,
  Users,
  Package,
  Search,
  Sparkles,
  Shield,
  Zap,
  Globe,
  Brain,
  Star,
} from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

const features = [
  {
    icon: BarChart3,
    title: "AI Dashboard",
    description:
      "Gemini-powered business analytics with executive summaries, highlights & smart recommendations.",
    href: "/dashboard",
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
    badge: "Gemini 2.5",
  },
  {
    icon: Users,
    title: "Employee Hub",
    description:
      "Full CRUD management with sentiment analysis on reviews, sortable tables & role-based access.",
    href: "/employees",
    gradient: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
    badge: "DistilBERT",
  },
  {
    icon: Package,
    title: "Product Catalog",
    description:
      "AI image scanning, auto-fill from photo URLs, category management & smart filtering.",
    href: "/products",
    gradient: "from-violet-500/20 to-purple-500/20",
    border: "border-violet-500/20",
    iconColor: "text-violet-400",
    badge: "Vision AI",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description:
      "Chat with Gemini about your data. Ask anything in plain English and get instant answers.",
    href: "/ai",
    gradient: "from-rose-500/20 to-pink-500/20",
    border: "border-rose-500/20",
    iconColor: "text-rose-400",
    badge: "Chat AI",
  },
  {
    icon: Search,
    title: "Smart Search",
    description:
      "Natural language search across all data. Find employees, products and insights instantly.",
    href: "/search",
    gradient: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/20",
    iconColor: "text-amber-400",
    badge: "NLP",
  },
  {
    icon: Globe,
    title: "Translation",
    description:
      "Translate product names into 8 languages inline using Hugging Face Helsinki models.",
    href: "/products",
    gradient: "from-cyan-500/20 to-sky-500/20",
    border: "border-cyan-500/20",
    iconColor: "text-cyan-400",
    badge: "8 Languages",
  },
];

const stats = [
  { value: "6+",       label: "AI Models",   icon: Brain },
  { value: "8",        label: "Languages",   icon: Globe },
  { value: "100%",     label: "Free APIs",   icon: Star },
  { value: "Real-time",label: "Analysis",    icon: Zap },
];

const techStack = [
  { name: "Next.js 16",     color: "text-white/80" },
  { name: "Gemini 2.5",     color: "text-blue-400" },
  { name: "Hugging Face",   color: "text-yellow-400" },
  { name: "Framer Motion",  color: "text-pink-400" },
  { name: "Spring Boot",    color: "text-emerald-400" },
  { name: "NextAuth",       color: "text-violet-400" },
  { name: "Recharts",       color: "text-cyan-400" },
  { name: "Tailwind v4",    color: "text-sky-400" },
];

export default function HomePage() {
  const { isLoggedIn, user } = useAuth();
  const loggedIn = isLoggedIn();

  return (
    <div className="min-h-screen space-y-24 pb-24">
      {/* ── Hero ── */}
      <section className="relative pt-12 pb-8 text-center overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-150 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-75 h-75 bg-violet-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-75 h-75 bg-cyan-500/6 rounded-full blur-3xl pointer-events-none" />

        {/* Badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-blue-500/20 text-xs font-medium text-blue-300 mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
          Powered by Gemini 2.5 Flash + Hugging Face
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-[1.05]"
        >
          Enterprise Management
          <br />
          <span className="gradient-text">Supercharged with AI</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-lg text-white/45 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Manage employees & products with AI-powered insights, natural language
          search, sentiment analysis, real-time translation, and a smart chatbot
          — all in one stunning platform.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {loggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-blue-600 to-violet-600 text-white font-semibold text-sm hover:opacity-90 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                <BarChart3 className="w-4 h-4" />
                Go to Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/ai"
                className="flex items-center gap-2 px-6 py-3 rounded-xl glass border border-violet-500/20 text-violet-300 font-semibold text-sm hover:bg-violet-500/10 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Bot className="w-4 h-4" />
                Ask AI
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-blue-600 to-violet-600 text-white font-semibold text-sm hover:opacity-90 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/8 text-white/60 font-semibold text-sm hover:text-white hover:bg-white/5 transition-all duration-200 hover:-translate-y-0.5"
              >
                <BarChart3 className="w-4 h-4" />
                View Demo
              </Link>
            </>
          )}
        </motion.div>

        {/* Welcome back message */}
        {loggedIn && user && (
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="mt-5 text-sm text-white/35"
          >
            Welcome back,{" "}
            <span className="text-blue-400 font-medium">
              {user?.username || user?.email?.split("@")[0]}
            </span>{" "}
            👋
          </motion.p>
        )}
      </section>

      {/* ── Stats row ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glass-card rounded-2xl p-4 text-center border border-white/5 hover:border-white/10 transition-all duration-300"
            >
              <Icon className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-black gradient-text">{stat.value}</p>
              <p className="text-xs text-white/35 mt-0.5">{stat.label}</p>
            </motion.div>
          );
        })}
      </motion.section>

      {/* ── Features grid ── */}
      <section className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Everything you need,{" "}
            <span className="gradient-text">AI-enhanced</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto text-sm">
            Six powerful modules working together to give you complete control
            over your enterprise data.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Link
                  href={feature.href}
                  className={`block h-full glass-card rounded-2xl p-5 border ${feature.border} hover:border-opacity-50 transition-all duration-300 group`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl bg-linear-to-br ${feature.gradient} flex items-center justify-center`}
                    >
                      <Icon className={`w-5 h-5 ${feature.iconColor}`} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-white/40">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-white/90 mb-1.5 group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-white/30 group-hover:text-white/60 transition-colors">
                    Explore
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Tech stack ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center space-y-6"
      >
        <p className="text-xs font-semibold text-white/25 uppercase tracking-widest">
          Built with
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {techStack.map((tech, i) => (
            <motion.span
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`px-3 py-1.5 rounded-full glass border border-white/6 text-xs font-medium ${tech.color}`}
            >
              {tech.name}
            </motion.span>
          ))}
        </div>
      </motion.section>

      {/* ── CTA Banner — only shown when NOT logged in ── */}
      {!loggedIn && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-center"
        >
          <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 via-violet-600/15 to-cyan-600/10 rounded-3xl" />
          <div className="absolute inset-0 border border-blue-500/15 rounded-3xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-blue-500/15 blur-3xl rounded-full" />

          <div className="relative z-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/50">
              <Shield className="w-3 h-3 text-emerald-400" />
              Role-based access control
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Ready to get started?
            </h2>
            <p className="text-white/40 max-w-md mx-auto text-sm">
              Sign in with Google or create an account. Admin and user roles
              included out of the box.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/login"
                className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-blue-600 to-violet-600 text-white font-semibold text-sm hover:opacity-90 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                Sign In Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/employees"
                className="flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 text-white/60 font-semibold text-sm hover:text-white hover:bg-white/5 transition-all duration-200 hover:-translate-y-0.5"
              >
                Browse Employees
              </Link>
            </div>
          </div>
        </motion.section>
      )}

      {/* ── Logged-in quick actions banner ── */}
      {loggedIn && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-center"
        >
          <div className="absolute inset-0 bg-linear-to-br from-emerald-600/15 via-blue-600/10 to-violet-600/10 rounded-3xl" />
          <div className="absolute inset-0 border border-emerald-500/15 rounded-3xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/10 blur-3xl rounded-full" />

          <div className="relative z-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/50">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              You&apos;re signed in
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Where would you like to go?
            </h2>
            <p className="text-white/40 max-w-md mx-auto text-sm">
              Jump straight into your workspace.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-blue-600 to-violet-600 text-white font-semibold text-sm hover:opacity-90 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:-translate-y-0.5"
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/employees"
                className="flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 text-white/60 font-semibold text-sm hover:text-white hover:bg-white/5 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Users className="w-4 h-4" />
                Employees
              </Link>
              <Link
                href="/products"
                className="flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 text-white/60 font-semibold text-sm hover:text-white hover:bg-white/5 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Package className="w-4 h-4" />
                Products
              </Link>
              <Link
                href="/ai"
                className="flex items-center gap-2 px-6 py-3 rounded-xl glass border border-violet-500/20 text-violet-300 font-semibold text-sm hover:bg-violet-500/10 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Bot className="w-4 h-4" />
                Ask AI
              </Link>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}