"use client";

import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
  }[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const NavbarSurfaceContext = React.createContext({
  isLightSurface: false,
});

const useNavbarSurface = () => React.useContext(NavbarSurfaceContext);

const isInternalRoute = (href: string) => href.startsWith("/");

const parseRgb = (value: string) => {
  const match = value.match(/rgba?\(([^)]+)\)/);
  if (!match) return null;

  const channels = match[1]
    .trim()
    .split(/[,\s/]+/)
    .filter(Boolean)
    .map(Number);

  if (channels.length < 3 || channels.some(Number.isNaN)) return null;

  return {
    r: channels[0],
    g: channels[1],
    b: channels[2],
    a: channels[3] ?? 1,
  };
};

const luminance = ({ r, g, b }: { r: number; g: number; b: number }) => {
  const channels = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};

const isLightBehindNavbar = (navElement: HTMLElement | null) => {
  if (typeof window === "undefined") return false;

  const previousPointerEvents = navElement?.style.pointerEvents;
  if (navElement) navElement.style.pointerEvents = "none";

  const navRect = navElement?.getBoundingClientRect();
  const sampleTop = navRect ? Math.min(navRect.top + 12, window.innerHeight - 1) : 50;
  const sampleMid = navRect ? Math.min(navRect.top + 48, window.innerHeight - 1) : 92;

  const positions = [sampleTop, sampleMid].map((y) => {
    const el = document.elementFromPoint(window.innerWidth / 2, y);
    return detectSurfaceAtElement(el);
  });

  if (navElement) navElement.style.pointerEvents = previousPointerEvents ?? "";

  const darkCount = positions.filter((p) => p === "dark").length;
  if (darkCount >= 1) return false;

  const lightCount = positions.filter((p) => p === "light").length;
  if (lightCount >= 2) return true;

  return window.scrollY > window.innerHeight * 0.65;
};

function detectSurfaceAtElement(
  element: Element | null,
): "light" | "dark" | "unknown" {
  let current = element instanceof HTMLElement ? element : null;

  while (current && current !== document.documentElement) {
    const style = window.getComputedStyle(current);
    const backgroundColor = parseRgb(style.backgroundColor);

    if (backgroundColor && backgroundColor.a > 0.35) {
      return luminance(backgroundColor) > 0.54 ? "light" : "dark";
    }

    const backgroundColors = style.backgroundImage.match(/rgba?\([^)]+\)/g);
    if (backgroundColors?.length) {
      const visibleColors = backgroundColors
        .map((color) => parseRgb(color))
        .filter(
          (color): color is { r: number; g: number; b: number; a: number } =>
            Boolean(color && color.a > 0.35),
        );

      if (visibleColors.length) {
        const avgLuminance =
          visibleColors.reduce((sum, color) => sum + luminance(color), 0) /
          visibleColors.length;
        return avgLuminance > 0.54 ? "light" : "dark";
      }
    }

    current = current.parentElement;
  }

  return "unknown";
}

const NavLink = ({
  href,
  className,
  children,
  onClick,
  onMouseEnter,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  onMouseEnter?: () => void;
}) => {
  if (isInternalRoute(href)) {
    return (
      <Link href={href} className={className} onClick={onClick} onMouseEnter={onMouseEnter}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} onClick={onClick} onMouseEnter={onMouseEnter}>
      {children}
    </a>
  );
};

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const surfaceRaf = useRef<number | null>(null);
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState<boolean>(false);
  const [hidden, setHidden] = useState<boolean>(false);
  const [isLightSurface, setIsLightSurface] = useState<boolean>(false);

  const updateSurface = useCallback(() => {
    if (typeof window === "undefined" || surfaceRaf.current !== null) return;

    surfaceRaf.current = window.requestAnimationFrame(() => {
      surfaceRaf.current = null;
      setIsLightSurface(isLightBehindNavbar(ref.current));
    });
  }, []);

  useEffect(() => {
    updateSurface();
    window.addEventListener("resize", updateSurface);
    window.addEventListener("scroll", updateSurface, { passive: true });

    return () => {
      window.removeEventListener("resize", updateSurface);
      window.removeEventListener("scroll", updateSurface);
      if (surfaceRaf.current !== null) {
        window.cancelAnimationFrame(surfaceRaf.current);
      }
    };
  }, [updateSurface]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    const isScrollingDown = latest > previous;

    setVisible(latest > 80);
    setHidden(isScrollingDown && latest > 120);
    lastScrollY.current = latest;
    updateSurface();
  });

  return (
    <NavbarSurfaceContext.Provider value={{ isLightSurface }}>
      <motion.nav
        ref={ref}
        aria-label="Primary"
        className={cn(
          "fixed inset-x-0 top-4 z-50 w-full transition-[opacity,transform] duration-200 ease-out",
          hidden
            ? "pointer-events-none -translate-y-28 opacity-0"
            : "pointer-events-auto translate-y-0 opacity-100",
          className,
        )}
      >
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(
                child as React.ReactElement<{ visible?: boolean }>,
                { visible },
              )
            : child,
      )}
      </motion.nav>
    </NavbarSurfaceContext.Provider>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  const { isLightSurface } = useNavbarSurface();

  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(14px)" : "blur(10px)",
        boxShadow: visible
          ? isLightSurface
            ? "0 18px 50px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255,255,255,0.72)"
            : "0 18px 50px rgba(5, 7, 12, 0.18), inset 0 1px 0 rgba(255,255,255,0.16)"
          : isLightSurface
            ? "0 10px 34px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255,255,255,0.68)"
            : "0 10px 34px rgba(5, 7, 12, 0.08), inset 0 1px 0 rgba(255,255,255,0.12)",
        width: visible ? "72%" : "100%",
        y: visible ? 8 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 34,
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full px-3 py-0 supports-[backdrop-filter]:backdrop-blur-xl lg:flex",
        isLightSurface
          ? "border border-slate-950/10 bg-white/[0.74] text-slate-950 supports-[backdrop-filter]:bg-white/[0.64]"
          : "border border-white/18 bg-white/[0.075] text-white supports-[backdrop-filter]:bg-white/[0.055]",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const { isLightSurface } = useNavbarSurface();

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium transition duration-200 lg:flex lg:space-x-2",
        isLightSurface
          ? "text-slate-600 hover:text-slate-950"
          : "text-white/68 hover:text-white",
        className,
      )}
    >
      {items.map((item, idx) => (
        <NavLink
          onClick={onItemClick}
          onMouseEnter={() => setHovered(idx)}
          className={cn(
            "relative px-4 py-1 transition",
            isLightSurface
              ? "text-slate-600 hover:text-slate-950"
              : "text-white/70 hover:text-white",
          )}
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className={cn(
                "absolute inset-0 h-full w-full rounded-full",
                isLightSurface ? "bg-red-100" : "bg-red-700/18",
              )}
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </NavLink>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  const { isLightSurface } = useNavbarSurface();

  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(14px)" : "blur(10px)",
        boxShadow: visible
          ? isLightSurface
            ? "0 18px 50px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255,255,255,0.72)"
            : "0 18px 50px rgba(5, 7, 12, 0.18), inset 0 1px 0 rgba(255,255,255,0.16)"
          : isLightSurface
            ? "0 10px 34px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255,255,255,0.68)"
            : "0 10px 34px rgba(5, 7, 12, 0.08), inset 0 1px 0 rgba(255,255,255,0.12)",
        width: visible ? "90%" : "100%",
        paddingRight: visible ? "12px" : "0px",
        paddingLeft: visible ? "12px" : "0px",
        borderRadius: visible ? "18px" : "2rem",
        y: visible ? 8 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 34,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between px-0 py-0 supports-[backdrop-filter]:backdrop-blur-xl lg:hidden",
        isLightSurface
          ? "border border-slate-950/10 bg-white/[0.74] text-slate-950 supports-[backdrop-filter]:bg-white/[0.64]"
          : "border border-white/18 bg-white/[0.075] text-white supports-[backdrop-filter]:bg-white/[0.055]",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between px-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
        "absolute inset-x-0 top-12 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-2xl border border-red-700/20 bg-[#05070c]/95 px-4 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-xl",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  const { isLightSurface } = useNavbarSurface();
  const iconClassName = isLightSurface ? "text-slate-950" : "text-white";

  return isOpen ? (
    <IconX className={iconClassName} onClick={onClick} />
  ) : (
    <IconMenu2 className={iconClassName} onClick={onClick} />
  );
};

export const NavbarLogo = ({
  href = "/",
  label = "Ractysh Construction",
}: {
  href?: string;
  label?: string;
}) => {
  const { isLightSurface } = useNavbarSurface();

  return (
    <NavLink
      href={href}
      className="relative z-20 mr-3 flex min-w-0 items-center gap-1.5 px-1 py-0 transition-opacity hover:opacity-85"
    >
      <Image
        src="/images/brand/ractysh-logo.png"
        alt={`${label} logo`}
        width={40}
        height={40}
        className="h-7 w-7 object-contain sm:h-8 sm:w-8"
        priority
        unoptimized
      />
      <div className="flex flex-col leading-tight">
        <span
          className={cn(
            "whitespace-nowrap text-sm font-bold leading-none sm:text-base",
            isLightSurface ? "text-slate-950" : "text-white",
          )}
        >
          Ractysh
        </span>
        <span
          className={cn(
            "whitespace-nowrap text-[10px] font-medium uppercase tracking-wider leading-none sm:text-[11px]",
            "text-[#C4A87C]",
          )}
        >
          Construction
        </span>
      </div>
    </NavLink>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
  | React.ComponentPropsWithoutRef<"a">
  | React.ComponentPropsWithoutRef<"button">
)) => {
  const { isLightSurface } = useNavbarSurface();
  const baseStyles =
    "inline-block rounded-md px-3 py-1 text-center text-sm font-bold transition duration-200 hover:-translate-y-0.5";

  const variantStyles = {
    primary: "bg-[#991b1b] text-white shadow-[0_0_24px_rgba(127,29,29,0.3)]",
    secondary: isLightSurface
      ? "bg-transparent text-slate-700 shadow-none hover:text-slate-950"
      : "bg-transparent text-white/78 shadow-none hover:text-white",
    dark: "bg-black text-white shadow-[0_0_24px_rgba(34,_42,_53,_0.16)]",
    gradient:
      "bg-gradient-to-b from-red-500 to-red-900 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.22)_inset]",
  };

  return React.createElement(
    Tag,
    {
      href: href || undefined,
      className: cn(baseStyles, variantStyles[variant], className),
      ...props,
    },
    children,
  );
};
