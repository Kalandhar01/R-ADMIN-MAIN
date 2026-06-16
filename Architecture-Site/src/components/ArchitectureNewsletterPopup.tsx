"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Check, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SESSION_KEY = "ractysh_architecture_newsletter_shown";

export function ArchitectureNewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if shown in this session
    const isShown = sessionStorage.getItem(SESSION_KEY);
    if (isShown) return;

    // Show after 7 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem(SESSION_KEY, "true");
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  // GSAP entrance sequence effect
  useEffect(() => {
    if (isOpen) {
      void import("gsap").then(({ gsap }) => {
        if (!popupRef.current) return;
        gsap.fromTo(
          popupRef.current,
          { opacity: 0, y: 40, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power4.out", delay: 0.2 }
        );
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    if (!name || !email) return;

    setStatus("submitting");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, source: "website_popup" }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Thank you for connecting with us.");
        // Close after success
        setTimeout(() => setIsOpen(false), 3000);
      } else {
        setStatus("error");
        setMessage(data.message || "Unable to process subscription. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Subscription service is unavailable. Please try again later.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-nearblack/60 backdrop-blur-md"
            onClick={handleClose}
          />
          
          <div
            ref={popupRef}
            className={cn(
              "relative w-full max-w-lg overflow-hidden rounded-none border border-stonework-700/30 bg-nearblack/90 p-8 shadow-2xl md:p-12",
              "before:absolute before:inset-0 before:bg-gradient-to-br before:from-warm-gold/5 before:to-transparent before:pointer-events-none"
            )}
          >
            <button
              onClick={handleClose}
              className="absolute right-6 top-6 text-stonework-400 transition-colors hover:text-warm-gold"
              aria-label="Close popup"
            >
              <X size={20} />
            </button>

            <div className="relative z-10">
              <div className="mb-8">
                <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.4em] text-warm-gold">
                  Studio Access
                </p>
                <h2 className="font-display text-3xl text-warm-100 md:text-4xl">
                  Stay Connected <br />
                  <span className="italic text-warm-200 text-2xl md:text-3xl">With RACTYSH</span>
                </h2>
                <p className="mt-6 text-sm leading-relaxed text-stonework-400">
                  Receive architecture insights, project stories, design intelligence, and exclusive studio updates directly from the architecture desk.
                </p>
              </div>

              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-warm-gold/20 bg-warm-gold/5 text-warm-gold">
                    <Check size={32} />
                  </div>
                  <h3 className="text-xl font-medium text-warm-100">Welcome Aboard</h3>
                  <p className="mt-2 text-sm text-stonework-400">{message}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="popup-name" className="text-[10px] uppercase tracking-widest text-stonework-500">
                      Name
                    </label>
                    <input
                      id="popup-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Principal Contact"
                      className="w-full border-b border-stonework-700/50 bg-transparent py-2 text-sm text-warm-100 placeholder:text-stonework-600 focus:border-warm-gold focus:outline-none transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="popup-email" className="text-[10px] uppercase tracking-widest text-stonework-500">
                      Email
                    </label>
                    <input
                      id="popup-email"
                      name="email"
                      type="email"
                      required
                      placeholder="studio@example.com"
                      className="w-full border-b border-stonework-700/50 bg-transparent py-2 text-sm text-warm-100 placeholder:text-stonework-600 focus:border-warm-gold focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="group flex w-full items-center justify-center gap-2 bg-warm-gold/90 px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-nearblack transition-all hover:bg-warm-gold disabled:opacity-50"
                    >
                      {status === "submitting" ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <>
                          <span>Subscribe Now</span>
                          <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </>
                      )}
                    </button>
                  </div>

                  {status === "error" && (
                    <p className="mt-4 text-center text-xs text-red-400">{message}</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
