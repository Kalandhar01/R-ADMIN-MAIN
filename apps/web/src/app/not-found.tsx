import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbfaf6] px-6 text-center text-[#292c2d]">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.26em] text-[#9a8a58]">Ractysh Group</p>
        <h1 className="mt-4 font-display text-5xl font-bold tracking-[-0.06em]">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-[#686868]">
          The page you are looking for is not available in this experience.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-md bg-[#343434] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(184,134,11,0.18)]"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
