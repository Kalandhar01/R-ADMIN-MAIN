"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent
} from "react";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

export const PROJECT_TYPE_OPTIONS = [
  "Architectural Design",
  "Interior Architecture",
  "Residential Design",
  "Commercial Design",
  "Landscape Architecture",
  "Structural Engineering",
  "Project Management Consultancy",
  "3D Visualisation & Rendering",
  "Design Consultation",
  "Master Planning",
  "Renovation & Adaptive Reuse",
  "Other Enquiry"
] as const;

type ProjectTypeSelectProps = {
  name: string;
  options?: readonly string[];
  defaultValue?: string;
  placeholder?: string;
};

export function ProjectTypeSelect({
  name,
  options = PROJECT_TYPE_OPTIONS,
  defaultValue,
  placeholder = "Select a project type"
}: ProjectTypeSelectProps) {
  const reduceMotion = useReducedMotion();
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const labelId = `${baseId}-label`;
  const optionId = useCallback((index: number) => `${baseId}-opt-${index}`, [baseId]);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>(defaultValue ?? "");
  const [activeIndex, setActiveIndex] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const closeAndFocusTrigger = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const selectOption = useCallback(
    (value: string) => {
      setSelected(value);
      setOpen(false);
      requestAnimationFrame(() => triggerRef.current?.focus());
    },
    []
  );

  // Open / close animation (GSAP) — elegant slide + opacity with staggered options.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const optionEls = listRef.current
      ? Array.from(listRef.current.querySelectorAll<HTMLElement>("[data-option]"))
      : [];
    gsap.killTweensOf([panel, ...optionEls]);

    if (open) {
      gsap.set(panel, { display: "block", pointerEvents: "auto" });
      if (reduceMotion) {
        gsap.set(panel, { opacity: 1, y: 0, scale: 1 });
        gsap.set(optionEls, { opacity: 1, y: 0 });
        return;
      }
      const tl = gsap.timeline();
      tl.fromTo(
        panel,
        { opacity: 0, y: -12, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.46, ease: "power3.out" }
      );
      tl.fromTo(
        optionEls,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.34, stagger: 0.022, ease: "power2.out" },
        "-=0.30"
      );
      return () => {
        tl.kill();
      };
    }

    if (reduceMotion) {
      gsap.set(panel, { display: "none", opacity: 0, pointerEvents: "none" });
      return;
    }
    const tl = gsap.timeline();
    tl.to(panel, { opacity: 0, y: -10, scale: 0.985, duration: 0.26, ease: "power2.in" });
    tl.set(panel, { display: "none", pointerEvents: "none" });
    return () => {
      tl.kill();
    };
  }, [open, reduceMotion]);

  // On open: sync highlight to the selected option.
  useEffect(() => {
    if (!open) return;
    const idx = options.indexOf(selected);
    setActiveIndex(idx >= 0 ? idx : 0);
  }, [open, options, selected]);

  // Stay in sync with native form.reset() (called after a successful submit).
  useEffect(() => {
    const form = rootRef.current?.closest("form");
    if (!form) return;
    const handleReset = () => {
      setSelected(defaultValue ?? "");
      setOpen(false);
    };
    form.addEventListener("reset", handleReset);
    return () => form.removeEventListener("reset", handleReset);
  }, [defaultValue]);

  // Keep the active option scrolled into view.
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  // Click / touch outside closes the dropdown.
  useEffect(() => {
    if (!open) return;
    const handlePointer = (event: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
    };
  }, [open]);

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " " || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
    }
  };

  const onListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((current) => (options.length ? (current + 1) % options.length : 0));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((current) => (options.length ? (current - 1 + options.length) % options.length : 0));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(Math.max(0, options.length - 1));
        break;
      case "Enter":
        event.preventDefault();
        if (options[activeIndex]) selectOption(options[activeIndex]);
        break;
      case "Escape":
        event.preventDefault();
        closeAndFocusTrigger();
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className={`arch-projecttype-control${open ? " is-open" : ""}`} ref={rootRef}>
      <input type="hidden" name={name} value={selected} />
      <button
        type="button"
        ref={triggerRef}
        className="arch-projecttype-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-labelledby={`${labelId} ${baseId}-value`}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={onTriggerKeyDown}
      >
        <span id={labelId} className="sr-only">
          Project type
        </span>
        <span
          id={`${baseId}-value`}
          className="arch-projecttype-trigger-value"
          data-placeholder={selected ? "false" : "true"}
        >
          {selected || placeholder}
        </span>
        <ChevronDown className="arch-projecttype-chevron" aria-hidden="true" />
      </button>

      <div className="arch-projecttype-panel" ref={panelRef} role="presentation">
        <ul className="arch-projecttype-list" id={listboxId} role="listbox" aria-label="Project type" ref={listRef} onKeyDown={onListKeyDown}>
          {options.length === 0 ? (
            <li className="arch-projecttype-empty" role="presentation">
              No project types available.
            </li>
          ) : (
            options.map((option, index) => {
              const isSelected = option === selected;
              const isActive = index === activeIndex;
              return (
                <li
                  key={option}
                  id={optionId(index)}
                  data-option
                  data-index={index}
                  role="option"
                  aria-selected={isSelected}
                  className={`arch-projecttype-option${isSelected ? " is-selected" : ""}${
                    isActive ? " is-active" : ""
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectOption(option)}
                >
                  <span>{option}</span>
                  <Check className="arch-projecttype-check" aria-hidden="true" />
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}

export default ProjectTypeSelect;
