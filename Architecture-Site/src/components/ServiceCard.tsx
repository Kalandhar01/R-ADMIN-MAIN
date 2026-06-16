import type { MouseEvent } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { OptimizedImage as Image } from "@/components/OptimizedImage";

interface ServiceCardProps {
  index?: number;
  title: string;
  shortDescription: string;
  image: string;
  imageAlt: string;
  description: string;
  features: readonly string[];
  cta: string;
  href: string;
  onNavigate?: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
}

const reveal: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
};

export default function ServiceCard({
  index,
  title,
  shortDescription,
  image,
  imageAlt,
  description,
  features,
  cta,
  href,
  onNavigate
}: ServiceCardProps) {
  return (
    <motion.article
      className="group relative flex h-full flex-col overflow-hidden bg-stone-50 transition-colors duration-500 hover:bg-white"
      variants={reveal}
    >
      {/* Immersive Image Header */}
      <div className="relative aspect-[16/9] overflow-hidden sm:aspect-[16/9]">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(min-width: 1280px) 40vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1.5s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-nearblack/10 transition-opacity duration-700 group-hover:opacity-0" />
        
        {/* Floating Index */}
        {index && (
          <div className="absolute left-8 top-8 overflow-hidden">
            <motion.span 
              className="block font-display text-4xl font-light text-white opacity-40 group-hover:opacity-100 transition-opacity duration-500"
            >
              {String(index).padStart(2, "0")}
            </motion.span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-8 lg:p-12">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px w-8 bg-executive-red/40 transition-all duration-500 group-hover:w-12 group-hover:bg-executive-red" />
          <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-nearblack/40">
            {shortDescription}
          </p>
        </div>

        <h3 className="font-display text-4xl font-light leading-none tracking-tight text-nearblack sm:text-4xl lg:text-5xl">
          {title}
        </h3>

        <p className="mt-8 text-lg leading-relaxed text-nearblack/60 sm:text-lg">
          {description}
        </p>

        {/* Features Reveal */}
        <div className="mt-10 grid gap-4 overflow-hidden transition-all duration-700 group-hover:mt-12">
          {features.slice(0, 3).map((feature) => (
            <div key={feature} className="flex items-center gap-4 border-t border-nearblack/5 pt-4">
              <span className="h-1 w-1 rounded-full bg-executive-red/40" />
              <span className="text-xs font-bold uppercase tracking-widest text-nearblack/40">{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-12">
          <a
            href={href}
            className="inline-flex items-center gap-4 text-[0.7rem] font-black uppercase tracking-[0.4em] text-nearblack transition-colors hover:text-executive-red"
            onClick={(event) => onNavigate?.(event, href)}
          >
            <span>{cta}</span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      {/* Subtle Bottom Accent */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-executive-red transition-all duration-700 group-hover:w-full" />
    </motion.article>
  );
}
