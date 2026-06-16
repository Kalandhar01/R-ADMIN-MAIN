"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useRef, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Services", href: "#otc-services" },
  { label: "Process", href: "#otc-process" },
  { label: "Trust", href: "#otc-trust" },
  { label: "Routes", href: "#routes" },
];

export default function NavbarDemo() {
  return <Navbar className="top-4 md:top-6" />;
}

function Navbar({ className }: { className?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 40) {
        setNavVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mobileLinks = [...navLinks, { label: "Contact", href: "#contact" }];

  const handleAnchorClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href.startsWith("#")) return;

    const target = document.getElementById(href.slice(1));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", href);
    setMobileOpen(false);
  };

  return (
    <div
      className={cn(
        "fixed inset-x-3 z-50 mx-auto max-w-6xl transition-all duration-500 sm:inset-x-6",
        navVisible ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0",
        className,
      )}
    >
      <nav
        aria-label="Single page navigation"
        className="relative flex w-full items-center justify-between gap-2 rounded-full border border-white/[0.16] bg-black/72 px-2.5 py-2.5 shadow-2xl backdrop-blur-xl sm:gap-4 sm:px-5 sm:py-4"
      >
        <a
          href="#home"
          onClick={(event) => handleAnchorClick(event, "#home")}
          className="flex min-w-0 shrink-0 items-center gap-2 text-white"
          aria-label="Ractysh OTC home"
        >
          <Image
            src="/logo.png"
            alt=""
            width={32}
            height={32}
            priority
            className="size-8 shrink-0 object-contain"
          />
          <span className="whitespace-nowrap text-xs font-semibold sm:text-sm">
            Ractysh OTC<span className="hidden sm:inline"> Exchange</span>
          </span>
        </a>

        <div className="hidden shrink-0 items-center justify-center gap-4 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => handleAnchorClick(event, link.href)}
              className="whitespace-nowrap px-1.5 py-1 text-xs font-medium text-white/72 sm:text-sm"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href="#contact"
            onClick={(event) => handleAnchorClick(event, "#contact")}
            className="shrink-0 whitespace-nowrap rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:border-emerald-200/30 hover:bg-white/14 sm:px-4"
          >
            Contact
          </a>
          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-otc-navigation"
            onClick={() => setMobileOpen((current) => !current)}
            className="grid size-9 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition hover:border-emerald-200/30 hover:bg-white/14 md:hidden"
          >
            {mobileOpen ? (
              <X className="size-4" aria-hidden="true" />
            ) : (
              <Menu className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {mobileOpen ? (
        <div
          id="mobile-otc-navigation"
          className="absolute inset-x-0 top-[calc(100%+0.65rem)] overflow-hidden rounded-[1.45rem] border border-white/[0.14] bg-black/82 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-2xl md:hidden"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(22,184,147,0.2),transparent_38%),radial-gradient(circle_at_86%_100%,rgba(243,201,135,0.14),transparent_42%)]" />
          <div className="relative grid gap-1">
            {mobileLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => handleAnchorClick(event, link.href)}
                className="flex min-h-11 items-center justify-between rounded-2xl px-4 text-sm font-semibold text-white/78 transition hover:bg-white/10 hover:text-white"
              >
                {link.label}
                <span className="text-xs text-emerald-200/60">#{link.href.slice(1)}</span>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
