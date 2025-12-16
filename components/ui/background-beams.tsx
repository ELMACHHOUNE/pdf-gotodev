"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 w-full h-full bg-neutral-950 overflow-hidden",
        className
      )}
    >
      <div className="absolute h-full w-full bg-neutral-950 mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 h-full w-full bg-neutral-950"
      >
        <div className="absolute h-screen w-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
      </motion.div>
    </div>
  );
};
