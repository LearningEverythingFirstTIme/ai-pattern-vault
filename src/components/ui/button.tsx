"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-[#1E3A5F] text-white hover:bg-[#2A4A73] focus-visible:ring-[#1E3A5F] shadow-soft",
    secondary: "bg-[#F5F3EE] text-[#1A1A1A] hover:bg-[#EDE9E2] border border-[#E5E2DA] focus-visible:ring-[#6B6B6B]",
    ghost: "bg-transparent text-[#6B6B6B] hover:bg-[#F5F3EE] hover:text-[#1A1A1A] focus-visible:ring-[#6B6B6B]",
    gold: "bg-[#C9A227] text-white hover:bg-[#A68520] focus-visible:ring-[#C9A227] shadow-soft",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
