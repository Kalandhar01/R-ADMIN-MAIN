"use client";

import type {
  ConstructionWorkItem,
  ConstructionWorksResult,
} from "@/lib/server/construction-works";
import { ArrowDown, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

const pageSize = 6;

export default function WorksGallery({
  initialItems,
  initialHasMore,
  initialNextSkip,
}: {
  initialItems: ConstructionWorkItem[];
  initialHasMore: boolean;
  initialNextSkip: number;
}) {
  const [works, setWorks] = useState(initialItems);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [nextSkip, setNextSkip] = useState(initialNextSkip);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/works?skip=${nextSkip}&take=${pageSize}`);
      const result = (await response.json()) as ConstructionWorksResult & {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(result.message || "Unable to load more project work.");
      }

      setWorks((current) => {
        const existing = new Set(current.map((item) => item.id));
        const incoming = result.items.filter((item) => !existing.has(item.id));

        return [...current, ...incoming];
      });
      setNextSkip(result.nextSkip);
      setHasMore(result.hasMore);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load more project work.");
    } finally {
      setLoading(false);
    }
  };

  if (!works.length) {
    return (
      <div className="border border-slate-200 bg-slate-50 px-6 py-14 text-center">
        <p className="text-sm font-medium text-slate-600">
          No project work is published yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {works.map((work, index) => (
          <motion.article
            key={work.id}
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.46,
              delay: Math.min(index % pageSize, 5) * 0.045,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group block overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(127,29,29,0.12)]"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
              <Image
                src={work.image}
                alt={`${work.title} by Ractysh Construction`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                quality={55}
                className="object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex items-start justify-between gap-4 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-700">
                  {work.type}
                </p>
                <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-slate-950">
                  {work.title}
                </h2>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                  {work.summary}
                </p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        {message ? <p className="text-sm font-medium text-red-700">{message}</p> : null}
        {hasMore ? (
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#991b1b] px-6 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(127,29,29,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#b91c1c] disabled:cursor-not-allowed disabled:opacity-65"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Loading project work
              </>
            ) : (
              <>
                Load more work
                <ArrowDown className="size-4" />
              </>
            )}
          </button>
        ) : (
          <p className="text-sm font-medium text-slate-500">
            All project work is loaded.
          </p>
        )}
      </div>
    </>
  );
}
