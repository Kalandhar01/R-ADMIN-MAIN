import ConstructionFooter from "@/components/ConstructionFooter";
import ConstructionNavbar from "@/components/ConstructionNavbar";
import WorksGallery from "@/components/WorksGallery";
import { getConstructionWorks } from "@/lib/server/construction-works";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Project Work | Ractysh Construction",
  description: "Finished and active construction work shaped by Ractysh project-control execution.",
};

export default async function WorksPage() {
  const works = await getConstructionWorks({ skip: 0, take: 6 });

  return (
    <main id="home" className="min-h-screen bg-white text-slate-950">
      <ConstructionNavbar />

      <section className="px-5 pb-20 pt-32 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-4 inline-flex border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-red-800">
                Ractysh project work
              </p>
              <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Project Work
              </h1>
            </div>
            <p className="max-w-md text-sm leading-7 text-slate-600">
              A growing record of finished spaces, site progress, and
              handover-ready construction managed through our project-control
              rhythm.
            </p>
          </div>

          <WorksGallery
            initialItems={works.items}
            initialHasMore={works.hasMore}
            initialNextSkip={works.nextSkip}
          />
        </div>
      </section>

      <div className="relative overflow-hidden bg-black bg-[radial-gradient(circle_at_20%_0%,rgba(153,27,27,0.28),transparent_34%),linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:auto,72px_72px,72px_72px]">
        <ConstructionFooter />
      </div>
    </main>
  );
}
