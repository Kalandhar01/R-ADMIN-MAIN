"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
  icon?: React.ElementType;
};

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
  disabled,
}: {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(-1);

  const selected = options.find((o) => o.value === value);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  React.useEffect(() => {
    if (!open) setActiveIndex(-1);
  }, [open]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
        setActiveIndex(0);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < options.length) {
          onChange(options[activeIndex].value);
          setOpen(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)} onKeyDown={handleKeyDown}>
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={placeholder}
        className={cn(
          "flex w-full items-center gap-2 rounded-xl border px-4 py-2.5 text-sm outline-none transition-all",
          open
            ? "border-[#D4AF37]/30 bg-[#D4AF37]/5 text-white"
            : "border-white/[0.06] bg-white/[0.03] text-white hover:border-white/[0.12]",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {selected?.icon && <selected.icon className="h-4 w-4 shrink-0 text-[#D4AF37]" />}
        <span className={cn("flex-1 text-left truncate", !selected && "text-[#555]")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-[#555] transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={listRef}
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            role="listbox"
            className="absolute left-0 right-0 z-50 mt-1.5 overflow-hidden rounded-xl border border-[#D4AF37]/20 bg-[#0a0a0a] shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
            style={{ minWidth: "100%" }}
          >
            <div className="max-h-52 overflow-y-auto py-1">
              {options.map((option, index) => {
                const isSelected = option.value === value;
                const isActive = index === activeIndex;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => { onChange(option.value); setOpen(false); }}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      "flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors",
                      isSelected
                        ? "bg-[#D4AF37]/10 text-white font-medium"
                        : isActive
                          ? "bg-white/[0.06] text-white"
                          : "text-[#888] hover:bg-white/[0.04] hover:text-white"
                    )}
                  >
                    {option.icon && (
                      <option.icon className={cn("h-4 w-4 shrink-0", isSelected ? "text-[#D4AF37]" : "text-[#555]")} />
                    )}
                    <span className="flex-1 truncate">{option.label}</span>
                    {isSelected && <Check className="h-4 w-4 shrink-0 text-[#D4AF37]" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
