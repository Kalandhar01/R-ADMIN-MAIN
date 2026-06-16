import type { CSSProperties } from "react";
import {
  ArrowLeft,
  Bell,
  Building2,
  DraftingCompass,
  Globe2,
  HardHat,
  Network,
  ShieldCheck,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { CompanyContactPanel } from "@/components/CompanyContactPanel";

export type DivisionPortalKey = "architecture" | "construction" | "real-estate" | "import-export" | "otc-exchange";

type DivisionPortalVisualKind = "architecture" | "construction" | "real-estate" | "trade" | "network";

interface DivisionPortalConfig {
  title: string;
  label: string;
  metadataDescription: string;
  visualKind: DivisionPortalVisualKind;
  Icon: LucideIcon;
}

type PortalStyle = CSSProperties & Record<`--${string}`, string>;

export const divisionPortalConfig: Record<DivisionPortalKey, DivisionPortalConfig> = {
  architecture: {
    title: "Architecture Division",
    label: "Architectural blueprint wireframe",
    metadataDescription: "Architecture Division launching soon inside the Ractysh Group enterprise ecosystem.",
    visualKind: "architecture",
    Icon: DraftingCompass
  },
  construction: {
    title: "Construction Division",
    label: "Structural framework animation",
    metadataDescription: "Construction Division launching soon inside the Ractysh Group enterprise ecosystem.",
    visualKind: "construction",
    Icon: HardHat
  },
  "real-estate": {
    title: "Real Estate Division",
    label: "Luxury property silhouette",
    metadataDescription: "Real Estate Division launching soon inside the Ractysh Group enterprise ecosystem.",
    visualKind: "real-estate",
    Icon: Building2
  },
  "import-export": {
    title: "Export & Import Division",
    label: "Global trade network",
    metadataDescription: "Export & Import Division launching soon inside the Ractysh Group enterprise ecosystem.",
    visualKind: "trade",
    Icon: Globe2
  },
  "otc-exchange": {
    title: "OTC Exchange Division",
    label: "Enterprise network visualization",
    metadataDescription: "OTC Exchange Division launching soon inside the Ractysh Group enterprise ecosystem.",
    visualKind: "network",
    Icon: ShieldCheck
  }
};

const particles = [
  ["12%", "18%", "0s"],
  ["24%", "74%", "-5s"],
  ["36%", "27%", "-9s"],
  ["47%", "83%", "-13s"],
  ["59%", "16%", "-2s"],
  ["68%", "71%", "-7s"],
  ["76%", "32%", "-11s"],
  ["84%", "58%", "-4s"],
  ["91%", "22%", "-15s"],
  ["8%", "54%", "-10s"]
] as const;

function portalStyle(x: string, y: string, delay: string): PortalStyle {
  return {
    "--portal-particle-x": x,
    "--portal-particle-y": y,
    "--portal-particle-delay": delay
  };
}

export function DivisionPortalPlaceholderPage({ division }: { division: DivisionPortalKey }) {
  const config = divisionPortalConfig[division];

  return (
    <main
      className="division-portal-page relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden px-5 py-5 text-[#fff7e8] sm:px-6 sm:py-7 md:px-8"
      aria-labelledby="division-portal-heading"
    >
      <PortalAtmosphere />

      <section className="relative z-10 mx-auto flex w-full max-w-[56rem] flex-col items-center text-center">
        <div className="division-portal-brand" aria-label="Ractysh Group">
          <BrandLogo size="lg" priority decorative imageClassName="drop-shadow-[0_0_28px_rgba(214,180,95,0.24)]" />
          <p className="mt-2 text-[0.82rem] font-semibold uppercase leading-none tracking-[0] text-[#f6dfad] sm:mt-3 sm:text-[0.9rem]">
            RACTYSH GROUP
          </p>
          <p className="mt-1.5 text-[0.76rem] font-medium leading-none tracking-[0] text-[#b7aa99] sm:mt-2 sm:text-[0.84rem]">
            Private Enterprise Ecosystem
          </p>
        </div>

        <div className="mt-5 sm:mt-7">
          <p className="division-portal-kicker mx-auto w-fit text-[0.72rem] font-semibold leading-none tracking-[0] text-[#d6b45f]">
            Division Portal
          </p>
          <h1
            id="division-portal-heading"
            className="mt-3 font-display text-[2.15rem] font-semibold leading-[0.94] tracking-[0] text-[#fff8ec] sm:mt-4 sm:text-[3.55rem] md:text-[4.3rem] lg:text-[5.15rem]"
          >
            <span className="block">{config.title}</span>
            {" "}
            <span className="block bg-[linear-gradient(112deg,#fff6df_0%,#d6b45f_42%,#f7e1a4_66%,#9d7329_100%)] bg-clip-text text-transparent">
              Launching Soon
            </span>
          </h1>
        </div>

        <DivisionPortalVisual config={config} />

        <p className="mt-4 max-w-[41rem] text-[0.9rem] font-medium leading-6 tracking-[0] text-[#c9bdad] sm:mt-6 sm:text-[1rem] sm:leading-7">
          This enterprise division is currently under development and will soon launch as a dedicated platform within the Ractysh ecosystem.
        </p>

        <CompanyContactPanel mode="company" tone="dark" className="mt-5 w-full max-w-[48rem] sm:mt-7" />

        <div className="mt-5 flex w-full max-w-[23rem] flex-col items-stretch justify-center gap-3 sm:mt-7 sm:max-w-none sm:flex-row sm:items-center">
          <Link href="/contact" className="division-portal-button division-portal-button-primary group">
            <Bell className="h-4 w-4 transition-transform duration-500 group-hover:rotate-6" strokeWidth={1.8} />
            Notify Me
          </Link>
          <Link href="http://localhost:3000" prefetch={false} className="division-portal-button division-portal-button-secondary group">
            <ArrowLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-0.5" strokeWidth={1.8} />
            Return Home
          </Link>
        </div>

        <p className="mt-4 text-[0.72rem] font-semibold leading-none tracking-[0] text-[#8f8374] sm:mt-7 sm:text-[0.78rem]">
          Part of the Ractysh Group Enterprise Ecosystem
        </p>
      </section>
    </main>
  );
}

function PortalAtmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <div className="division-portal-burgundy-wash absolute inset-0" />
      <div className="division-portal-architectural-grid absolute -inset-20" />
      <div className="division-portal-blueprint-lines absolute -inset-14" />
      <div className="division-portal-scan absolute inset-x-0 top-0 h-px" />
      <div className="division-portal-grain absolute inset-0" />
      {particles.map(([x, y, delay]) => (
        <span key={`${x}-${y}`} className="division-portal-particle absolute" style={portalStyle(x, y, delay)} />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,transparent,#030303)]" />
    </div>
  );
}

function DivisionPortalVisual({ config }: { config: DivisionPortalConfig }) {
  const Icon = config.Icon;

  return (
    <div className="division-portal-visual relative mt-5 flex h-[11.75rem] w-[11.75rem] items-center justify-center sm:mt-8 sm:h-[16.5rem] sm:w-[16.5rem] md:h-[18.5rem] md:w-[18.5rem]">
      <div className="division-portal-visual-glow absolute inset-0" />
      <div className="division-portal-ring division-portal-ring-one absolute inset-[0.65rem]" />
      <div className="division-portal-ring division-portal-ring-two absolute inset-[1.8rem]" />
      <svg
        viewBox="0 0 240 240"
        className="division-portal-svg relative z-10 h-full w-full overflow-visible"
        fill="none"
        role="img"
        aria-label={config.label}
      >
        <defs>
          <linearGradient id="division-portal-gold" x1="24" x2="216" y1="42" y2="198" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF1BE" stopOpacity="0.92" />
            <stop offset="0.46" stopColor="#D6B45F" stopOpacity="0.98" />
            <stop offset="1" stopColor="#8B1118" stopOpacity="0.72" />
          </linearGradient>
        </defs>
        <BlueprintBase />
        <VisualPaths kind={config.visualKind} />
      </svg>
      <div className="division-portal-icon-core absolute left-1/2 top-1/2 z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[8px] border border-[#d6b45f]/42 bg-[#090706]/88 text-[#d6b45f] shadow-[0_0_42px_rgba(214,180,95,0.18),inset_0_1px_0_rgba(255,255,255,0.1)] sm:h-16 sm:w-16">
        <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.5} />
      </div>
    </div>
  );
}

function BlueprintBase() {
  return (
    <g className="division-portal-blueprint-base">
      <path d="M32 64H208M32 104H208M32 144H208M32 184H208M64 32V208M104 32V208M144 32V208M184 32V208" />
      <path d="M44 196L196 44M44 44L196 196" />
      <circle cx="120" cy="120" r="78" />
      <circle cx="120" cy="120" r="48" />
    </g>
  );
}

function VisualPaths({ kind }: { kind: DivisionPortalVisualKind }) {
  if (kind === "architecture") {
    return (
      <g className="division-portal-turntable">
        <path className="division-portal-line division-portal-line-ivory division-portal-draw" d="M72 172V76L120 50L168 76V172H72Z" />
        <path className="division-portal-line division-portal-line-gold division-portal-draw division-portal-delay-a" d="M72 76L120 104L168 76M120 50V172M88 164V104H152V164M96 122H144M96 142H144" />
        <path className="division-portal-line division-portal-line-ivory division-portal-draw division-portal-delay-b" d="M60 172H180M88 76V62H152V76M92 92L120 76L148 92" />
        <path className="division-portal-scan-stroke" d="M58 132H182" />
        <circle className="division-portal-node" cx="120" cy="104" r="3.4" />
      </g>
    );
  }

  if (kind === "construction") {
    return (
      <g>
        <path className="division-portal-line division-portal-line-ivory division-portal-draw" d="M62 174H178M76 174V68M164 174V68M76 68H164M94 174V98M146 174V98M94 98H146" />
        <path className="division-portal-line division-portal-line-gold division-portal-draw division-portal-delay-a" d="M76 174L94 68L120 174L146 68L164 174M94 68H146M76 122H164" />
        <path className="division-portal-line division-portal-line-ivory division-portal-draw division-portal-delay-b" d="M62 90H178M70 90L120 54L170 90" />
        <path className="division-portal-scan-stroke" d="M58 112H182" />
        <circle className="division-portal-node" cx="120" cy="54" r="3.6" />
      </g>
    );
  }

  if (kind === "real-estate") {
    return (
      <g>
        <path className="division-portal-line division-portal-line-gold division-portal-draw" d="M62 166H178M76 166V102L120 70L164 102V166M92 166V116H108V166M132 166V116H148V166" />
        <path className="division-portal-line division-portal-line-ivory division-portal-draw division-portal-delay-a" d="M70 104L120 66L170 104M86 102H154M84 130H156M84 148H156" />
        <path className="division-portal-line division-portal-line-ivory division-portal-draw division-portal-delay-b" d="M102 94H138M120 70V166M62 178H178" />
        <path className="division-portal-scan-stroke" d="M66 136H174" />
        <circle className="division-portal-node" cx="120" cy="70" r="3.5" />
      </g>
    );
  }

  if (kind === "trade") {
    return (
      <g>
        <circle className="division-portal-line division-portal-line-ivory division-portal-draw" cx="120" cy="120" r="62" />
        <path className="division-portal-line division-portal-line-gold division-portal-draw division-portal-delay-a" d="M58 120H182M120 58C104 78 96 98 96 120C96 142 104 162 120 182M120 58C136 78 144 98 144 120C144 142 136 162 120 182" />
        <path className="division-portal-line division-portal-line-ivory division-portal-draw division-portal-delay-b" d="M76 82C96 96 142 96 164 82M76 158C96 144 142 144 164 158" />
        <path className="division-portal-scan-stroke" d="M78 120C98 104 142 104 162 120" />
        <circle className="division-portal-node" cx="74" cy="120" r="3.5" />
        <circle className="division-portal-node division-portal-delay-a" cx="166" cy="90" r="3.5" />
        <circle className="division-portal-node division-portal-delay-b" cx="152" cy="158" r="3.5" />
      </g>
    );
  }

  return (
    <g>
      <path className="division-portal-line division-portal-line-ivory division-portal-draw" d="M120 70L168 98V154L120 182L72 154V98L120 70Z" />
      <path className="division-portal-line division-portal-line-gold division-portal-draw division-portal-delay-a" d="M120 70V120M168 98L120 120M168 154L120 120M120 182V120M72 154L120 120M72 98L120 120" />
      <path className="division-portal-line division-portal-line-ivory division-portal-draw division-portal-delay-b" d="M88 88L152 172M152 88L88 172M88 120H152" />
      <path className="division-portal-scan-stroke" d="M70 120H170" />
      <circle className="division-portal-node" cx="120" cy="70" r="3.5" />
      <circle className="division-portal-node division-portal-delay-a" cx="168" cy="98" r="3.5" />
      <circle className="division-portal-node division-portal-delay-b" cx="72" cy="154" r="3.5" />
      <Network className="division-portal-svg-icon" x="108" y="108" width="24" height="24" strokeWidth={1.4} />
    </g>
  );
}
