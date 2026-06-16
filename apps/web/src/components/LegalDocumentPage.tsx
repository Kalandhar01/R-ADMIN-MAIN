import { Download, FileBadge } from "lucide-react";
import { MarketingChrome } from "@/components/MarketingChrome";
import type { LegalDocument, SiteContent } from "@/lib/types";

interface LegalDocumentPageProps {
  content: SiteContent;
  document: LegalDocument;
}

export function LegalDocumentPage({ content, document }: LegalDocumentPageProps) {
  const isTrademark = document.slug === "trademark-certification";

  return (
    <MarketingChrome content={content}>
      <section className="bg-[#12090b] px-5 pb-20 pt-32 text-white md:px-8 lg:pb-28 lg:pt-40">
        <div className="mx-auto max-w-[72rem]">
          <p className="text-[0.76rem] font-semibold uppercase tracking-[0.24em] text-[#d6b45f]">Legal</p>
          <h1 className="mt-6 font-display text-[3.5rem] font-semibold leading-[0.96] md:text-[5.6rem]">
            {document.title}
          </h1>
          <p className="mt-7 max-w-[48rem] text-[1.08rem] leading-8 text-white/64">{document.summary}</p>
        </div>
      </section>

      <section className="px-5 py-20 md:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[92rem] gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <aside className="rounded-[26px] border border-[#dfcfaa] bg-white p-6 shadow-[0_24px_70px_rgba(80,52,24,0.08)]">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#8b1118]">Last updated</p>
            <p className="mt-3 font-display text-3xl font-semibold">{document.updatedAt}</p>
            <p className="mt-6 text-sm leading-6 text-[#655b54]">{content.legal.trademarkNotice}</p>
          </aside>
          <article className="rounded-[26px] border border-[#dfcfaa] bg-white p-6 shadow-[0_24px_70px_rgba(80,52,24,0.08)] md:p-8">
            <p className="text-[1.05rem] leading-9 text-[#4f463f]">{document.body}</p>

            {isTrademark ? (
              <div className="mt-8 overflow-hidden rounded-[24px] border border-[#eadfc8] bg-[#fbf8f0] p-4">
                <img
                  src={content.legal.certificatePreviewUrl}
                  alt={content.legal.certificateTitle}
                  className="max-h-[30rem] w-full rounded-[18px] object-cover"
                />
                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <FileBadge className="h-5 w-5 text-[#8b1118]" />
                    <p className="font-semibold">{content.legal.certificateTitle}</p>
                  </div>
                  <a
                    href={content.legal.certificateUrl}
                    download
                    className="premium-cta"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </a>
                </div>
              </div>
            ) : null}
          </article>
        </div>
      </section>
    </MarketingChrome>
  );
}
