import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { COMPANY_CONTACT_ITEMS, CONSULTATION_CONTACT_ITEMS } from "@/lib/companyContact";
import { cn } from "@/lib/utils";

type ContactMode = "company" | "consultation";
type ContactTone = "light" | "dark" | "transparent";

interface CompanyContactPanelProps {
  mode?: ContactMode;
  tone?: ContactTone;
  className?: string;
  compact?: boolean;
}

const iconByLabel = {
  Email: Mail,
  Mobile: Phone,
  Phone: Phone,
  Office: Building2,
  Locations: MapPin
} as const;

export function CompanyContactPanel({
  mode = "company",
  tone = "light",
  className,
  compact = false
}: CompanyContactPanelProps) {
  const items = mode === "consultation" ? CONSULTATION_CONTACT_ITEMS : COMPANY_CONTACT_ITEMS;
  const isDark = tone === "dark";
  const isTransparent = tone === "transparent";

  return (
    <div
      className={cn(
        "grid gap-3",
        compact ? "sm:grid-cols-3" : mode === "consultation" ? "sm:grid-cols-3" : "sm:grid-cols-2",
        className
      )}
    >
      {items.map((item) => {
        const Icon = iconByLabel[item.label];
        const content = (
          <>
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
                isDark
                  ? "border-[#d6b45f]/28 bg-white/[0.06] text-[#d6b45f]"
                  : "border-[#d6b45f]/34 bg-white/54 text-[#8b1118]"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.8} />
            </span>
            <span className="min-w-0">
              <span
                className={cn(
                  "block text-[0.62rem] font-bold uppercase tracking-[0.2em]",
                  isDark ? "text-[#d6b45f]" : "text-[#8b1118]"
                )}
              >
                {item.label}
              </span>
              <span
                className={cn(
                  "mt-1.5 block break-words text-[0.86rem] font-semibold leading-5",
                  isDark ? "text-[#fff8ec]/86" : "text-[#201714]"
                )}
              >
                {item.value}
              </span>
            </span>
          </>
        );

        const itemClassName = cn(
          "flex min-w-0 items-start gap-3 rounded-[8px] border p-3 text-left transition duration-300",
          isDark
            ? "border-[#d6b45f]/18 bg-white/[0.045] hover:border-[#d6b45f]/38 hover:bg-white/[0.07]"
            : isTransparent
              ? "border-[#d6b45f]/24 bg-white/24 hover:border-[#d6b45f]/44 hover:bg-white/38"
              : "border-[#d8c39b]/58 bg-white/66 shadow-[0_14px_42px_rgba(48,34,18,0.06)] hover:border-[#b88a44]/70 hover:bg-white"
        );

        return item.href ? (
          <a key={item.label} href={item.href} className={itemClassName}>
            {content}
          </a>
        ) : (
          <div key={item.label} className={itemClassName}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
