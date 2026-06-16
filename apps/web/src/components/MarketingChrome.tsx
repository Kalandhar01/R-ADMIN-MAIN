import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import type { SiteContent } from "@/lib/types";

interface MarketingChromeProps {
  content: SiteContent;
  children: ReactNode;
  className?: string;
  showServiceRequestCTA?: boolean;
}

export function MarketingChrome({ content, children, className }: MarketingChromeProps) {
  const chrome = (
    <>
      <Navbar logoText={content.nav.logoText} items={content.nav.items} />
      <main className="min-h-screen bg-[#f8f4ea] text-[#201714]">
        {children}
      </main>
      <Footer
        headline={content.footer.headline}
        description={content.footer.description}
        links={content.footer.links}
        socialLinks={content.footer.socialLinks}
      />
    </>
  );

  return className ? <div className={className}>{chrome}</div> : chrome;
}
