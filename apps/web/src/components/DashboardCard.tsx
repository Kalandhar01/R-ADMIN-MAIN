import { memo } from "react";
import { CalendarDays, Check, Hourglass, LockKeyhole, ShieldCheck, Star, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  eyebrow: string;
  status: string;
  description: string;
  iconText: string;
  assignee: string;
  progress: string;
  due: string;
  className?: string;
  index?: number;
  floating?: boolean;
  compact?: boolean;
  showcase?: boolean;
  statusMotionState?: "hidden" | "visible";
  statusMotionDelay?: number;
}

const OperationBadge = memo(function OperationBadge({ label, compact = false, showcase = false }: { label: string; compact?: boolean; showcase?: boolean }) {
  const sizeClasses = compact
    ? showcase
      ? "h-[3.05rem] w-[3.05rem] rounded-lg"
      : "h-9 w-9 rounded-md md:h-[3.05rem] md:w-[3.05rem] md:rounded-lg"
    : "h-[4rem] w-[4rem] rounded-xl";
  const normalized = label.toLowerCase();

  if (normalized.includes("pci")) {
    return (
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center border border-[#ece8e4] bg-white text-center font-semibold text-[#303030] shadow-[0_12px_24px_rgba(48,48,48,0.10)]",
          sizeClasses,
          compact ? (showcase ? "text-[0.95rem]" : "text-[0.72rem] md:text-[0.95rem]") : "text-[1.1rem]"
        )}
      >
        PCI
        <Check
          className={cn(
            "absolute text-[#26b873]",
            compact
              ? showcase
                ? "bottom-2 right-2 h-3 w-3"
                : "bottom-1.5 right-1.5 h-2.5 w-2.5 md:bottom-2 md:right-2 md:h-3 md:w-3"
              : "bottom-3 right-3 h-4 w-4"
          )}
          strokeWidth={3}
        />
      </div>
    );
  }

  if (normalized.includes("soc")) {
    return (
      <div
        className={cn(
          "flex shrink-0 flex-col items-center justify-center border border-[#ece8e4] bg-white text-center font-semibold leading-none text-[#303030] shadow-[0_12px_24px_rgba(48,48,48,0.10)]",
          sizeClasses
        )}
      >
        <ShieldCheck className={cn("mb-1", compact ? (showcase ? "h-4 w-4" : "h-3.5 w-3.5 md:h-4 md:w-4") : "h-5 w-5")} strokeWidth={1.8} />
        <span className={compact ? (showcase ? "text-[0.54rem]" : "text-[0.48rem] md:text-[0.54rem]") : "text-[0.62rem]"}>SOC 2</span>
        <span className={compact ? (showcase ? "text-[0.45rem]" : "text-[0.4rem] md:text-[0.45rem]") : "text-[0.52rem]"}>TYPE II</span>
      </div>
    );
  }

  if (normalized.includes("gdpr")) {
    return (
      <div
        className={cn(
          "flex shrink-0 flex-col items-center justify-center border border-[#ece8e4] bg-white text-center font-semibold leading-none text-[#303030] shadow-[0_12px_24px_rgba(48,48,48,0.10)]",
          sizeClasses
        )}
      >
        <span className="mb-0.5 flex items-center gap-0.5">
          <Star className={compact ? (showcase ? "h-2 w-2" : "h-1.5 w-1.5 md:h-2 md:w-2") : "h-2.5 w-2.5"} fill="currentColor" />
          <Star className={compact ? (showcase ? "h-2.5 w-2.5" : "h-2 w-2 md:h-2.5 md:w-2.5") : "h-3 w-3"} fill="currentColor" />
          <Star className={compact ? (showcase ? "h-2 w-2" : "h-1.5 w-1.5 md:h-2 md:w-2") : "h-2.5 w-2.5"} fill="currentColor" />
        </span>
        <LockKeyhole className={cn("mb-1", compact ? (showcase ? "h-4 w-4" : "h-3.5 w-3.5 md:h-4 md:w-4") : "h-5 w-5")} strokeWidth={1.8} />
        <span className={compact ? (showcase ? "text-[0.56rem]" : "text-[0.5rem] md:text-[0.56rem]") : "text-[0.68rem]"}>GDPR</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center border border-[#ece8e4] bg-white text-center font-bold leading-none text-[#303030] shadow-[0_12px_24px_rgba(48,48,48,0.10)]",
        sizeClasses,
        compact ? (showcase ? "text-[0.76rem]" : "text-[0.66rem] md:text-[0.76rem]") : "text-base"
      )}
    >
      {label}
    </div>
  );
});

export const DashboardCard = memo(function DashboardCard({
  title,
  eyebrow,
  status,
  description,
  iconText,
  assignee,
  progress,
  due,
  className,
  index = 0,
  floating = false,
  compact = false,
  showcase = false,
  statusMotionState,
  statusMotionDelay = 0
}: DashboardCardProps) {
  const animateStatus = Boolean(statusMotionState);

  return (
    <article
      data-floating-stack-card={floating ? "" : undefined}
      data-card-index={index}
      className={cn(
        "overflow-hidden border border-[#e8e6e3] bg-white text-left will-change-transform",
        compact
          ? showcase
            ? "relative min-h-[15.45rem] w-full rounded-md shadow-none"
            : "relative min-h-[7.35rem] w-full rounded-md shadow-none md:min-h-[15.45rem]"
          : "absolute min-h-[22rem] w-[19.5rem] rounded-[0.72rem] shadow-[0_22px_64px_rgba(48,48,48,0.10)]",
        floating && "w-[20rem] border-[#e7e3df] shadow-[0_30px_82px_rgba(48,48,48,0.12),0_0_0_1px_rgba(255,255,255,0.86)_inset]",
        className
      )}
    >
      <div
        className={cn(
          "flex border-b border-[#eeeae6]",
          compact
            ? showcase
              ? "min-h-[4.8rem] gap-3 px-3.5 py-3"
              : "min-h-[3.15rem] gap-2 px-2.5 py-2 md:min-h-[4.8rem] md:gap-3 md:px-3.5 md:py-3"
            : "min-h-[6.35rem] gap-4 px-[1.125rem] py-4"
        )}
      >
        <OperationBadge label={iconText} compact={compact} showcase={showcase} />
        <div className={cn(compact ? (showcase ? "min-w-0 pt-1" : "min-w-0 pt-0.5 md:pt-1") : "pt-1")}>
          <p className={cn("text-[#555]", compact ? (showcase ? "text-[0.63rem] leading-5" : "text-[0.56rem] leading-tight md:text-[0.63rem] md:leading-5") : "text-[0.83rem] leading-5")}>{eyebrow}</p>
          <h3
            className={cn(
              "mt-1 font-display font-medium leading-[1.17] tracking-normal text-[#303030]",
              compact ? (showcase ? "text-[0.92rem]" : "text-[0.78rem] md:text-[0.92rem]") : "text-[1.22rem]"
            )}
          >
            {title}
          </h3>
        </div>
      </div>
      <div className={cn(compact ? (showcase ? "px-3.5 py-3" : "px-2.5 py-2 md:px-3.5 md:py-3") : "px-[1.125rem] py-4")}>
        <motion.p
          data-mobile-dashboard-status
          className={cn("font-semibold", compact ? (showcase ? "text-[0.72rem]" : "text-[0.62rem] md:text-[0.72rem]") : "text-sm", status === "Ongoing" ? "text-[#178b61]" : "text-[#5967d9]")}
          initial={animateStatus ? { opacity: 0 } : false}
          animate={
            animateStatus
              ? statusMotionState === "visible"
                ? { opacity: 1 }
                : { opacity: 0 }
              : undefined
          }
          transition={{ delay: statusMotionDelay, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          {status}
        </motion.p>
        <p className={cn("text-[#5c5b58]", compact ? (showcase ? "mt-2 min-h-[2.95rem] text-[0.68rem] leading-4" : "mt-1 text-[0.6rem] leading-[1.35] md:mt-2 md:min-h-[2.95rem] md:text-[0.68rem] md:leading-4") : "mt-2 min-h-[3.9rem] text-sm leading-6")}>
          {description}
        </p>
        <div className={cn("divide-y divide-[#efebe7]", compact ? (showcase ? "mt-2 block" : "hidden md:mt-2 md:block") : "mt-4")}>
          <div className={cn("flex items-center justify-between gap-4", compact ? "py-2 text-[0.66rem]" : "py-2.5 text-sm")}>
            <span className="flex items-center gap-3 text-[#9c9994]">
              <UserRound className={cn("text-[#303030]", compact ? "h-3.5 w-3.5" : "h-[1.125rem] w-[1.125rem]")} />
              Assigned to
            </span>
            <span className="font-medium text-[#303030]">{assignee}</span>
          </div>
          <div className={cn("flex items-center justify-between gap-4", compact ? "py-2 text-[0.66rem]" : "py-2.5 text-sm")}>
            <span className="flex items-center gap-3 text-[#9c9994]">
              <Hourglass className={cn("text-[#303030]", compact ? "h-3.5 w-3.5" : "h-[1.125rem] w-[1.125rem]")} />
              Open work
            </span>
            <span className="font-medium text-[#303030]">{progress}</span>
          </div>
          <div className={cn("flex items-center justify-between gap-4 opacity-60", compact ? "py-2 text-[0.66rem]" : "py-2.5 text-sm")}>
            <span className="flex items-center gap-3 text-[#9c9994]">
              <CalendarDays className={cn("text-[#303030]", compact ? "h-3.5 w-3.5" : "h-[1.125rem] w-[1.125rem]")} />
              Due on
            </span>
            <span className="font-medium text-[#303030]">{due}</span>
          </div>
        </div>
      </div>
    </article>
  );
});
