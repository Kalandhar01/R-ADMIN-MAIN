"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Globe2,
  Mail,
  Route,
  ShieldCheck,
} from "lucide-react";

const footerColumns = [
  {
    title: "Desk",
    links: [
      { label: "Start a mandate", href: "#contact" },
      { label: "Desk flow", href: "#desk" },
      { label: "Capabilities", href: "#features" },
      { label: "Global routes", href: "#routes" },
    ],
  },
  {
    title: "Markets",
    links: [
      { label: "Crypto blocks", href: "#contact" },
      { label: "Treasury routes", href: "#routes" },
      { label: "Gold settlement", href: "#contact" },
      { label: "Private liquidity", href: "#features" },
    ],
  },
  {
    title: "Control",
    links: [
      { label: "Counterparty checks", href: "#contact" },
      { label: "Quote discipline", href: "#features" },
      { label: "Route approval", href: "#routes" },
      { label: "Settlement proof", href: "#features" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Email desk", href: "mailto:desk@ractysh.com" },
      { label: "Client request", href: "#contact" },
      { label: "Private review", href: "#contact" },
      { label: "Ractysh home", href: "/" },
    ],
  },
];

export default function SiteFooter() {
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [subscribeMessage, setSubscribeMessage] = useState("");
  const [showSubscribeNotice, setShowSubscribeNotice] = useState(false);
  const isSubmitting = subscribeStatus === "submitting";
  const isSubscribed = subscribeStatus === "success";

  useEffect(() => {
    if (!isSubscribed) {
      setShowSubscribeNotice(false);
      return;
    }

    setShowSubscribeNotice(true);

    const fadeTimer = window.setTimeout(() => {
      setShowSubscribeNotice(false);
    }, 2800);
    const resetTimer = window.setTimeout(() => {
      setSubscribeStatus("idle");
      setSubscribeMessage("");
    }, 3600);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(resetTimer);
    };
  }, [isSubscribed]);

  async function handleSubscribeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    const email = subscriberEmail.trim();
    if (!email) {
      setSubscribeStatus("error");
      setSubscribeMessage("Please enter your email address.");
      return;
    }

    setSubscribeStatus("submitting");
    setSubscribeMessage("Subscribing...");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "otc_footer_newsletter",
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        success?: boolean;
        alreadySubscribed?: boolean;
        message?: string;
      };

      if (!response.ok || payload.ok === false || payload.success === false) {
        throw new Error(payload.message || "Unable to subscribe right now.");
      }

      setSubscribeStatus("success");
      setSubscribeMessage(payload.alreadySubscribed ? "Already subscribed" : "Subscribed");
      setSubscriberEmail("");
    } catch (error) {
      setSubscribeStatus("error");
      setSubscribeMessage(
        error instanceof Error
          ? error.message
          : "Unable to subscribe right now. Please try again.",
      );
    }
  }

  return (
    <footer className="relative z-20 overflow-hidden bg-[#020403] px-5 pt-20 pb-8 text-white sm:px-8 lg:px-10 lg:pt-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(22,184,147,0.08),transparent_40%),radial-gradient(circle_at_84%_20%,rgba(243,201,135,0.06),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#040706] to-transparent" />

      <div className="relative z-10 mx-auto max-w-[92rem]">
        <div className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3 text-white"
              aria-label="Ractysh OTC home"
            >
              <Image
                src="/logo.png"
                alt=""
                width={48}
                height={48}
                className="size-12 shrink-0 object-contain"
              />
              <span>
                <span className="block text-xl font-semibold">
                  Ractysh OTC Exchange
                </span>
                <span className="mt-1 block text-sm text-white/48">
                  Private mandate coordination
                </span>
              </span>
            </Link>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/58 sm:text-lg">
              Ractysh OTC Exchange gives verified counterparties a private
              operating layer for price discipline, route control, settlement
              clarity, and clean reporting.
            </p>

          </div>

          <div className="flex flex-col gap-2 lg:items-end">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
              <div className="relative w-full sm:w-auto sm:min-w-[28rem]">
                <form
                  onSubmit={handleSubscribeSubmit}
                  className={`flex w-full flex-col gap-3 transition-all duration-500 ease-out sm:flex-row ${
                    isSubscribed
                      ? "pointer-events-none scale-[0.98] opacity-0 blur-sm"
                      : "scale-100 opacity-100 blur-0"
                  }`}
                >
                  <label className="sr-only" htmlFor="footer-subscribe-email">
                    Email address
                  </label>
                  <div className="relative min-w-0 flex-1">
                    <Mail
                      className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/42"
                      aria-hidden="true"
                    />
                    <input
                      id="footer-subscribe-email"
                      name="email"
                      type="email"
                      required
                      value={subscriberEmail}
                      onChange={(event) => {
                        setSubscriberEmail(event.target.value);
                        if (!isSubmitting) {
                          setSubscribeStatus("idle");
                          setSubscribeMessage("");
                        }
                      }}
                      aria-describedby="footer-subscribe-status"
                      placeholder="Enter email"
                      className="min-h-12 w-full rounded-full border border-white/12 bg-white/[0.045] pr-4 pl-11 text-sm font-medium text-white outline-none backdrop-blur-md transition placeholder:text-white/34 focus:border-emerald-200/30 focus:bg-white/[0.07] focus:ring-2 focus:ring-emerald-300/10"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-12 min-w-[9rem] items-center justify-center gap-2 rounded-full bg-[#16b893] px-6 text-sm font-bold text-[#04100c] shadow-[0_18px_60px_rgba(22,184,147,0.24)] transition hover:bg-[#54d7bb] disabled:cursor-not-allowed disabled:bg-white/14 disabled:text-white/42 disabled:shadow-none"
                  >
                    {isSubmitting ? "Sending..." : "Subscribe"}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </button>
                </form>
                {isSubscribed ? (
                  <div
                    aria-live="polite"
                    className={`absolute inset-0 flex items-center transition-all duration-700 ease-out ${
                      showSubscribeNotice
                        ? "translate-y-0 opacity-100 blur-0"
                        : "translate-y-2 opacity-0 blur-sm"
                    }`}
                  >
                    <div
                      role="status"
                      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-emerald-100/25 bg-white/[0.085] px-5 text-sm font-semibold text-emerald-50 shadow-[0_22px_70px_rgba(22,184,147,0.2)] backdrop-blur-2xl"
                    >
                      <CheckCircle2
                        className="size-4 text-emerald-200"
                        aria-hidden="true"
                      />
                      <span>{subscribeMessage || "Subscribed"}</span>
                    </div>
                  </div>
                ) : null}
              </div>
              <a
                href="#contact"
                className="inline-flex min-h-12 items-center rounded-full border border-white/12 bg-white/[0.045] px-6 text-sm font-semibold text-white/70 backdrop-blur-md transition hover:border-emerald-200/25 hover:text-white"
              >
                Start mandate
              </a>
            </div>
            <p
              id="footer-subscribe-status"
              aria-live="polite"
              className={`text-xs font-medium ${
                isSubscribed
                  ? "sr-only"
                  : subscribeStatus === "error"
                    ? "min-h-5 text-rose-200"
                    : "min-h-5 text-emerald-100/80"
              }`}
            >
              {isSubscribed ? "" : subscribeMessage}
            </p>
          </div>
        </div>

        <div className="grid gap-10 py-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">
              Global private desk
            </p>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/50">
              Built for deal conversations where authority, liquidity, privacy,
              and settlement proof must be aligned before movement.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/52">
              <span className="inline-flex min-h-10 items-center gap-2 border border-white/10 bg-black/20 px-3">
                <Globe2 className="size-4 text-emerald-200" aria-hidden="true" />
                Global routes
              </span>
              <span className="inline-flex min-h-10 items-center gap-2 border border-white/10 bg-black/20 px-3">
                <Route className="size-4 text-[#f3c987]" aria-hidden="true" />
                Controlled execution
              </span>
              <span className="inline-flex min-h-10 items-center gap-2 border border-white/10 bg-black/20 px-3">
                <ShieldCheck className="size-4 text-sky-200" aria-hidden="true" />
                Verified counterparties
              </span>
            </div>
          </div>

          <nav
            aria-label="Footer navigation"
            className="grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-semibold text-white">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm leading-6 text-white/48 transition hover:text-emerald-100"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-sm text-white/42 sm:flex-row sm:items-center sm:justify-between">
          <p>(c) 2026 Ractysh OTC Exchange. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href="#contact" className="transition hover:text-white">
              Contact
            </a>
            <a href="#routes" className="transition hover:text-white">
              Routes
            </a>
            <a href="mailto:desk@ractysh.com" className="transition hover:text-white">
              Email desk
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
