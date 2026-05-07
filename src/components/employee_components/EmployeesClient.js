"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    UserPlus,
    Search,
    Pencil,
    Trash2,
    Brain,
    ChevronDown,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useAuth } from "@/src/context/AuthContext";
import EmployeeTable from "./EmployeeTable";
import CreateEmployee from "./CreateEmployee";
import SearchEmployeeById from "./SearchEmployeeById";
import UpdateEmployee from "./UpdateEmployee";
import DeleteEmployee from "./DeleteEmployee";
import SentimentAnalyzer from "@/src/components/SentimentAnalyzer";
import ProtectedAction from "@/src/components/ProtectedAction";

const tabs = [
    { id: "table", label: "All Employees", icon: Users, public: true },
    { id: "create", label: "Add New", icon: UserPlus, role: "USER" },
    { id: "search", label: "Search by ID", icon: Search, public: true },
    { id: "update", label: "Update", icon: Pencil, role: "USER" },
    { id: "delete", label: "Delete", icon: Trash2, role: "ADMIN" },
    { id: "sentiment", label: "Sentiment", icon: Brain, public: true },
];

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function EmployeesClient({ employees }) {
    const [activeTab, setActiveTab] = useState("table");
    const { isLoggedIn, isAdmin, user } = useAuth();

    const canAccess = (tab) => {
        if (tab.public) return true;
        if (!isLoggedIn()) return false;
        if (tab.role === "ADMIN") return isAdmin();
        return true;
    };

    const visibleTabs = tabs.filter(canAccess);

    return (
        <div className="space-y-6">
            {/* Page header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-black text-white mb-1">
                        Employee Management
                    </h1>
                    <p className="text-sm text-white/40">
                        Manage your team of{" "}
                        <span className="text-blue-400 font-semibold">
                            {employees.length} employees
                        </span>
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/20">
                        {employees.length} total
                    </span>
                    {isLoggedIn() && (
                        <span
                            className={cn(
                                "text-[10px] font-bold px-2.5 py-1 rounded-full border",
                                isAdmin()
                                    ? "bg-rose-500/15 text-rose-300 border-rose-500/20"
                                    : "bg-emerald-500/15 text-emerald-300 border-emerald-500/20"
                            )}
                        >
                            {isAdmin() ? "Admin Access" : "User Access"}
                        </span>
                    )}
                </div>
            </motion.div>

            {/* Tab bar */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex gap-1.5 flex-wrap"
            >
                {visibleTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                                isActive
                                    ? "bg-gradient-to-r from-blue-600/30 to-violet-600/20 text-white border border-blue-500/25 shadow-lg shadow-blue-500/10"
                                    : "glass border border-white/5 text-white/45 hover:text-white/80 hover:bg-white/5"
                            )}
                        >
                            <Icon className={cn("w-4 h-4", isActive ? "text-blue-400" : "text-white/30")} />
                            {tab.label}
                            {tab.role === "ADMIN" && (
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/20">
                                    ADMIN
                                </span>
                            )}
                            {tab.role === "USER" && (
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                                    USER
                                </span>
                            )}
                        </button>
                    );
                })}
            </motion.div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                >
                    {activeTab === "table" && <EmployeeTable employees={employees} />}

                    {activeTab === "create" && (
                        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                    <UserPlus className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-white/90 text-sm">Add New Employee</h2>
                                    <p className="text-xs text-white/35">Fill in the details below</p>
                                </div>
                            </div>
                            <ProtectedAction requiredRole="USER">
                                <CreateEmployee />
                            </ProtectedAction>
                        </div>
                    )}

                    {activeTab === "search" && (
                        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                    <Search className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-white/90 text-sm">Search by ID</h2>
                                    <p className="text-xs text-white/35">Look up any employee instantly</p>
                                </div>
                            </div>
                            <SearchEmployeeById />
                        </div>
                    )}

                    {activeTab === "update" && (
                        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                    <Pencil className="w-4 h-4 text-amber-400" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-white/90 text-sm">Update Employee</h2>
                                    <p className="text-xs text-white/35">Find and edit employee details</p>
                                </div>
                            </div>
                            <ProtectedAction requiredRole="USER">
                                <UpdateEmployee />
                            </ProtectedAction>
                        </div>
                    )}

                    {activeTab === "delete" && (
                        <div className="glass-card rounded-2xl border border-rose-500/10 overflow-hidden">
                            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center">
                                    <Trash2 className="w-4 h-4 text-rose-400" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-white/90 text-sm">Delete Employee</h2>
                                    <p className="text-xs text-white/35">Permanently remove an employee</p>
                                </div>
                            </div>
                            <ProtectedAction requiredRole="ADMIN">
                                <DeleteEmployee />
                            </ProtectedAction>
                        </div>
                    )}

                    {activeTab === "sentiment" && <SentimentAnalyzer />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}