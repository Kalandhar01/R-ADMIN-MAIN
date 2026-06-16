"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, ArrowUpRight, Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

interface ArchitectureSubscribePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ArchitectureSubscribePopup({ isOpen, onClose }: ArchitectureSubscribePopupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        popupRef.current,
        { x: "100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.7, ease: "power4.out" }
      );

      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEsc);

      const handleClickOutside = (e: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
          onClose();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        window.removeEventListener("keydown", handleEsc);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "architecture_popup" }),
      });
      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Thank you for joining the RACTYSH Architecture Journal.");
        setEmail("");
        setTimeout(() => onClose(), 3000);
      } else {
        setStatus("error");
        setMessage(data.message || "Unable to subscribe.");
      }
    } catch {
      setStatus("error");
      setMessage("Service unavailable. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] pointer-events-none"
    >
      <div
        ref={popupRef}
        className="absolute top-6 right-6 w-[340px] md:w-[380px] pointer-events-auto bg-[#fbfaf6]/80 backdrop-blur-xl border border-[#b8934f]/20 rounded-2xl p-8 shadow-2xl overflow-hidden"
        style={{ isolation: "isolate" }}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-[#b8934f]" />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#111111]/40 hover:text-[#b8934f] transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="space-y-6">
          <header className="space-y-2">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#b8934f] uppercase">Stay Inspired</span>
            {status === "success" ? (
              <h3 className="text-xl font-display text-[#111111]">Subscribed Successfully</h3>
            ) : (
              <p className="text-sm text-[#111111]/70 leading-relaxed">
                Get exclusive architecture insights, design stories, and project updates from RACTYSH Architecture.
              </p>
            )}
          </header>

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-4 space-y-3"
              >
                <div className="w-10 h-10 bg-[#b8934f] rounded-full flex items-center justify-center text-[#fbfaf6]">
                  <Check size={20} />
                </div>
                <p className="text-sm text-[#111111]/70 leading-relaxed">{message}</p>
              </motion.div>
            ) : (
              <motion.form
                key="subscribe-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#111111]/5 border border-[#111111]/10 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#b8934f]/40 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full bg-[#111111] hover:bg-[#b8934f] text-[#fbfaf6] rounded-xl px-6 py-3.5 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300"
                >
                  {status === "submitting" ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <ArrowUpRight size={16} />
                    </>
                  )}
                </button>
                {status === "error" && (
                  <p className="text-[10px] text-red-500 font-medium">{message}</p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
