"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, DollarSign, Building2, Mail, User } from "lucide-react";
import { createEmployee } from "@/src/lib/api/employees";
import toast from "react-hot-toast";

const Field = ({ icon: Icon, label, children }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
            <Icon className="w-3 h-3" />
            {label}
        </label>
        {children}
    </div>
);

const inputCls =
    "w-full bg-white/5 border border-white/8 text-white placeholder-white/20 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/30 transition-all duration-200";

export default function CreateEmployee() {
    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "", salary: "", department: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
            toast.error("First name, last name and email are required");
            return;
        }
        setLoading(true);
        try {
            const result = await createEmployee({
                ...form,
                salary: form.salary ? parseFloat(form.salary) : 0,
            });
            const data = result.data ?? result;
            toast.success(`Employee "${data.firstName} ${data.lastName}" created! 🎉`);
            setForm({ firstName: "", lastName: "", email: "", salary: "", department: "" });
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="p-5 space-y-4"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field icon={User} label="First Name">
                    <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className={inputCls}
                    />
                </Field>
                <Field icon={User} label="Last Name">
                    <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className={inputCls}
                    />
                </Field>
            </div>

            <Field icon={Mail} label="Email">
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john.doe@company.com"
                    className={inputCls}
                />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field icon={DollarSign} label="Salary">
                    <input
                        type="number"
                        name="salary"
                        value={form.salary}
                        onChange={handleChange}
                        placeholder="50000"
                        min="0"
                        step="100"
                        className={inputCls}
                    />
                </Field>
                <Field icon={Building2} label="Department">
                    <input
                        type="text"
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        placeholder="Engineering"
                        className={inputCls}
                    />
                </Field>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5"
            >
                {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <UserPlus className="w-4 h-4" />
                )}
                {loading ? "Creating..." : "Create Employee"}
            </button>
        </motion.form>
    );
}