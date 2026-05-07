"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Bot,
  Shield,
  Globe,
  Brain,
  Package,
  Users,
  BarChart3,
  Sparkles,
  Github,
  Star,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

const team = [
  {
    name: "Gemini 2.5 Flash",
    role: "AI Brain",
    desc: "Powers chat, dashboard analysis, smart search & vision AI.",
    color: "from-blue-500 to-violet-600",
    icon: Brain,
  },
  {
    name: "DistilBERT",
    role: "Sentiment Engine",
    desc: "Fine-tuned SST-2 model for employee feedback sentiment analysis.",
    color: "from-emerald-500 to-teal-600",
    icon: Bot,
  },
  {
    name: "Helsinki NLP",
    role: "Translation Suite",
    desc: "8-language real-time translation for product names.",
    color: "from-amber-500 to-orange-600",
    icon: Globe,
  },
  {
    name: "Spring Boot",
    role: "Backend API",
    desc: "RESTful API with JWT auth, role-based access, and full CRUD.",
    color: "from-rose-500 to-pink-600",
    icon: Shield,
  },
];

const milestones = [
  {
    icon: BarChart3,
    title: "AI-Powered Dashboard",
    desc: "Real-time Gemini analysis of business data with charts and insights.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Users,
    title: "Employee Management",
    desc: "Full CRUD with role-based access, sentiment analysis & department filters.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    icon: Package,
    title: "Product Catalog",
    desc: "AI image scanning, inline translation, category management & pagination.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
  },
  {
    icon: Bot,
    title: "Floating Chatbot",
    desc: "Persistent AI assistant that knows your full dataset from any page.",
    color: "text-rose-400",
    bg: "bg-rose-400/10",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero */}
      <section className="relative text-center pt-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-blue-500/6 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-blue-500/20 text-xs font-medium text-blue-300 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            About NexusAI
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight"
          >
            Built for the future of
            <br />
            <span className="gradient-text">enterprise management</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-white/45 max-w-2xl mx-auto leading-relaxed text-base"
          >
            NexusAI is a modern full-stack platform combining a Spring Boot REST
            API with a Next.js 16 frontend, multiple AI models, and a beautiful
            glass-morphism UI to deliver a truly next-generation enterprise
            experience.
          </motion.p>
        </div>
      </section>

      {/* AI Team */}
      <section className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
            The AI <span className="gradient-text">Power Stack</span>
          </h2>
          <p className="text-white/35 text-sm">
            Four specialized AI systems working together
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {team.map((member, i) => {
            const Icon = member.icon;
            return (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-card rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="font-bold text-white/90">{member.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-white/35">
                    {member.role}
                  </span>
                </div>
                <p className="text-sm text-white/45 leading-relaxed">
                  {member.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Core <span className="gradient-text">Features</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {milestones.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex gap-4 glass-card rounded-2xl p-5 border border-white/5"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center shrink-0`}
                >
                  <Icon className={`w-5 h-5 ${m.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-white/90 mb-1">{m.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Tech stack */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden glass-card rounded-3xl border border-white/5 p-8 text-center"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-violet-600/5 rounded-3xl" />
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">
            Open & Transparent
          </h2>
          <p className="text-white/40 text-sm max-w-md mx-auto mb-6 leading-relaxed">
            Built entirely with free, open-source tools and free API tiers.
            No paid services required to run the full stack.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Next.js 16",
              "React 19",
              "Spring Boot",
              "Tailwind v4",
              "Framer Motion",
              "Recharts",
              "NextAuth",
              "Gemini Free",
              "HuggingFace Free",
              "shadcn/ui",
            ].map((t) => (
              <span
                key={t}
                className="px-3 py-1.5 rounded-full glass border border-white/6 text-xs font-medium text-white/50 hover:text-white/80 transition-colors"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}