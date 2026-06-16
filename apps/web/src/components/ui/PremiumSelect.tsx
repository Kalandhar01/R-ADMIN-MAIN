"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface PremiumSelectOption {
  value: string;
  label: string;
}

interface PremiumSelectProps {
  id: string;
  value: string;
  options: readonly PremiumSelectOption[];
  placeholder: string;
  onChange: (value: string) => void;
  required?: boolean;
  invalid?: boolean;
  describedBy?: string;
  disabled?: boolean;
  className?: string;
}

interface PanelStyle {
  left: number;
  top: number;
  width: number;
  maxHeight: number;
  placement: "top" | "bottom";
}

export function PremiumSelect({
  id,
  value,
  options,
  placeholder,
  onChange,
  required,
  invalid,
  describedBy,
  disabled,
  className
}: PremiumSelectProps) {
  const reactId = useId();
  const listboxId = `${id}-${reactId}-listbox`;
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const [activeIndex, setActiveIndex] = useState(Math.max(selectedIndex, 0));
  const [panelStyle, setPanelStyle] = useState<PanelStyle | null>(null);

  const selectedOption = useMemo(() => options.find((option) => option.value === value), [options, value]);

  const updatePanelPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger || typeof window === "undefined") return;

    const rect = trigger.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const gutter = 16;
    const menuHeight = Math.min(336, options.length * 48 + 22);
    const below = viewportHeight - rect.bottom;
    const above = rect.top;
    const placement: PanelStyle["placement"] = below < menuHeight + 18 && above > below ? "top" : "bottom";
    const maxAvailable = placement === "top" ? above - gutter : below - gutter;
    const width = Math.min(rect.width, viewportWidth - gutter * 2);
    const left = Math.min(Math.max(rect.left, gutter), viewportWidth - width - gutter);
    const top = placement === "top" ? Math.max(gutter, rect.top - Math.min(menuHeight, maxAvailable) - 10) : rect.bottom + 10;

    setPanelStyle({
      left,
      top,
      width,
      maxHeight: Math.max(180, Math.min(menuHeight, maxAvailable)),
      placement
    });
  }, [options.length]);

  const close = useCallback(() => setOpen(false), []);

  const selectValue = useCallback(
    (nextValue: string) => {
      onChange(nextValue);
      setOpen(false);
      requestAnimationFrame(() => triggerRef.current?.focus());
    },
    [onChange]
  );

  useEffect(() => {
    setActiveIndex(Math.max(selectedIndex, 0));
  }, [selectedIndex]);

  useEffect(() => {
    if (!open) return;

    updatePanelPosition();

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      close();
    };

    const handleWindowUpdate = () => updatePanelPosition();

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("resize", handleWindowUpdate);
    window.addEventListener("scroll", handleWindowUpdate, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", handleWindowUpdate);
      window.removeEventListener("scroll", handleWindowUpdate, true);
    };
  }, [close, open, updatePanelPosition]);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        updatePanelPosition();
        setOpen(true);
        return;
      }
      setActiveIndex((current) => {
        const direction = event.key === "ArrowDown" ? 1 : -1;
        return (current + direction + options.length) % options.length;
      });
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) {
        updatePanelPosition();
        setOpen(true);
        return;
      }
      const activeOption = options[activeIndex];
      if (activeOption) selectValue(activeOption.value);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  };

  const panel =
    typeof document !== "undefined" && panelStyle
      ? createPortal(
          <AnimatePresence>
            {open ? (
              <motion.div
                ref={panelRef}
                id={listboxId}
                role="listbox"
                aria-labelledby={id}
                className="premium-select-panel"
                style={{
                  left: panelStyle.left,
                  top: panelStyle.top,
                  width: panelStyle.width,
                  maxHeight: panelStyle.maxHeight,
                  transformOrigin: panelStyle.placement === "top" ? "50% 100%" : "50% 0%"
                }}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -10, scale: 0.98 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="premium-select-panel-glow" />
                {options.map((option, index) => {
                  const selected = option.value === value;
                  const active = index === activeIndex;

                  return (
                    <button
                      key={option.value}
                      id={`${listboxId}-${index}`}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      className={cn("premium-select-option", selected && "is-selected", active && "is-active")}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => selectValue(option.value)}
                    >
                      <span className="premium-select-option-indicator">
                        {selected ? <Check className="h-3.5 w-3.5" strokeWidth={2.2} /> : null}
                      </span>
                      <span className="min-w-0 truncate">{option.label}</span>
                    </button>
                  );
                })}
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body
        )
      : null;

  return (
    <div className={cn("premium-select-root", className)}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-activedescendant={open ? `${listboxId}-${activeIndex}` : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        disabled={disabled}
        data-open={open || undefined}
        data-invalid={invalid || undefined}
        className="premium-select-trigger"
        onClick={() => {
          updatePanelPosition();
          setOpen((current) => !current);
        }}
        onKeyDown={handleKeyDown}
      >
        <span className={selectedOption ? "premium-select-value" : "premium-select-placeholder"}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown className="premium-select-chevron h-4 w-4" strokeWidth={2} />
      </button>
      {panel}
    </div>
  );
}
