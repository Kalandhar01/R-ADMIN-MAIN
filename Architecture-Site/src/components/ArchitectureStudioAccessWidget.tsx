"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "ractysh_studio_access_dismissed";

export function ArchitectureStudioAccessWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    // Check if dismissed previously
    const isDismissed = localStorage.getItem(STORAGE_KEY);
    if (isDismissed) {
      window.removeEventListener("resize", handleResize);
      return;
    }

    // Show after 8 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 8000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  const handleSubscribeClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    if (!email) return;

    setStatus("submitting");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "studio_access_widget" }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Welcome to the studio.");
        // Close after success
        setTimeout(() => {
          setIsVisible(false);
          localStorage.setItem(STORAGE_KEY, "true");
        }, 3000);
      } else {
        setStatus("error");
        setMessage(data.message || "Unable to process.");
      }
    } catch {
      setStatus("error");
      setMessage("Service unavailable.");
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Invisible overlay for collapsing when clicking outside */}
          {isExpanded && (
            <div 
              className="fixed inset-0 z-[80]" 
              onClick={() => setIsExpanded(false)}
            />
          )}

          <motion.div
            ref={widgetRef}
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ 
              opacity: 1, 
              y: 0,
              x: isMobile ? "-50%" : "0%",
              scale: 1,
              transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className={cn(
              "fixed bottom-6 left-1/2 z-[90] w-[90vw] max-w-[380px] overflow-hidden rounded-[24px] border border-white/10 bg-[#0B0B0B]/90 p-6 text-[#F5F3EE] shadow-2xl backdrop-blur-xl md:bottom-8 md:right-8 md:left-auto md:translate-x-0 md:w-full",
              "before:absolute before:inset-0 before:bg-gradient-to-br before:from-[#C6A15B]/10 before:to-transparent before:pointer-events-none"
            )}
          >
            {/* Subtle glow pulse */}
            <motion.div 
              animate={{ 
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#C6A15B]/10 blur-[50px] pointer-events-none"
            />

            <button
              onClick={handleClose}
              className="absolute right-4 top-4 z-20 text-[#F5F3EE]/40 transition-colors hover:text-[#C6A15B]"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="relative z-10">
              <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.4em] text-[#C6A15B]">
                Studio Access
              </p>
              
              <h3 className="font-display text-2xl text-[#F5F3EE]">
                Stay Connected
              </h3>
              
              <p className="mt-3 text-[13px] leading-relaxed text-[#F5F3EE]/60">
                Receive architecture insights, project stories and studio updates.
              </p>

              <motion.div 
                animate={{ height: isExpanded ? "auto" : "0px", marginTop: isExpanded ? 24 : 0 }}
                className="overflow-hidden"
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {status === "success" ? (
                  <div className="flex items-center gap-3 rounded-xl bg-[#C6A15B]/10 p-4 text-[#C6A15B]">
                    <Check size={18} />
                    <span className="text-sm font-medium">{message}</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 pb-1">
                    <div className="relative">
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="studio@example.com"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#F5F3EE] outline-none transition-all focus:border-[#C6A15B]/50 focus:bg-white/10"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C6A15B] py-3 text-[11px] font-bold uppercase tracking-widest text-[#0B0B0B] transition-all hover:bg-[#D4B06A]"
                    >
                      {status === "submitting" ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <>
                          <span>Join the Studio</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                    {status === "error" && (
                      <p className="text-center text-[11px] text-red-400/80">{message}</p>
                    )}
                  </form>
                )}
              </motion.div>

              {!isExpanded && (
                <div className="mt-6">
                  <button
                    onClick={handleSubscribeClick}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#C6A15B]/30 bg-[#C6A15B]/5 py-3 text-[11px] font-bold uppercase tracking-widest text-[#C6A15B] transition-all hover:bg-[#C6A15B] hover:text-[#0B0B0B]"
                  >
                    <span>Subscribe</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
