import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value) {
  if (value === null || value === undefined) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value) {
  if (value === null || value === undefined) return "0";
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str, length = 50) {
  if (!str) return "";
  return str.length > length ? `${str.slice(0, length)}...` : str;
}

export function getDepartmentColor(department) {
  const colors = {
    Engineering: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    Marketing: "text-pink-400 bg-pink-400/10 border-pink-400/20",
    Sales: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    HR: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    Finance: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    Operations: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    Design: "text-rose-400 bg-rose-400/10 border-rose-400/20",
    IT: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
  };
  return colors[department] || "text-gray-400 bg-gray-400/10 border-gray-400/20";
}