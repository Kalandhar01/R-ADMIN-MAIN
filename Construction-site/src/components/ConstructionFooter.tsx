import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { MapPin } from "lucide-react";

const footerColumns = [
  {
    title: "Pages",
    links: [
      { title: "Home", href: "#home" },
      { title: "Idea", href: "#intro" },
      { title: "Work", href: "#works" },
      { title: "Services", href: "#services" },
      { title: "Contact", href: "#contact" },
      { title: "Start a brief", href: "mailto:hello@ractysh.com" },
    ],
  },
  {
    title: "Services",
    links: [
      { title: "Civil & MEP engineering", href: "#services" },
      { title: "Turnkey construction", href: "#services" },
      { title: "PMC & approvals", href: "#services" },
      { title: "Infrastructure projects", href: "#services" },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "Approval mapping", href: "#services" },
      { title: "Execution control", href: "#info-2" },
      { title: "Quality assurance", href: "#services" },
      { title: "Closeout readiness", href: "#contact" },
    ],
  },
  {
    title: "Contact",
    links: [
      { title: "hello@ractysh.com", href: "mailto:hello@ractysh.com" },
      { title: "Start a project", href: "#contact" },
      { title: "Share a brief", href: "#contact" },
      { title: "View project work", href: "#works" },
    ],
  },
];

export default function ConstructionFooter() {
  return (
    <footer className="relative w-full overflow-hidden bg-transparent px-8 py-20 text-neutral-400">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-12 text-sm sm:flex-row md:px-8">
        <div className="relative z-10 max-w-sm">
          <a
            href="#home"
            className="relative z-20 mr-0 mb-4 flex items-center space-x-2 py-1 text-sm font-normal text-white md:mr-4"
          >
            <span className="flex size-8 items-center justify-center rounded-full border border-red-500/45 bg-red-950 text-[10px] font-semibold text-red-50">
              RC
            </span>
            <span className="font-medium text-white">
              Ractysh Construction
            </span>
          </a>
          <p className="mt-4 max-w-xs leading-6 text-neutral-400">
            Premium design-build construction, engineering, project management,
            approvals, quality visibility, and handover readiness.
          </p>
          <div className="mt-5 flex max-w-xs items-start gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 backdrop-blur-sm">
            <MapPin className="mt-0.5 size-4 shrink-0 text-red-300" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Location
              </p>
              <p className="mt-1 leading-5 text-neutral-300">
                Palani, Dindigul, Coimbatore
              </p>
            </div>
          </div>
          <div className="mt-6 text-neutral-500">
            Copyright Ractysh Construction 2026. All rights reserved.
          </div>
        </div>

        <div className="relative z-10 grid w-full grid-cols-2 items-start gap-10 sm:w-auto sm:shrink-0 lg:grid-cols-4">
          {footerColumns.map((column) => (
            <div
              key={column.title}
              className="flex w-full flex-col justify-center space-y-4"
            >
              <p className="font-bold text-neutral-200 transition-colors hover:text-white">
                {column.title}
              </p>
              <ul className="list-none space-y-4 text-neutral-400 transition-colors">
                {column.links.map((link) => (
                  <li key={link.title} className="list-none">
                    <a
                      className="transition-colors hover:text-white"
                      href={link.href}
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-14 h-32 w-full max-w-6xl sm:h-44 md:h-60 lg:h-72">
        <TextHoverEffect text="Ractysh" duration={6.5} align="center" automatic />
      </div>
    </footer>
  );
}
