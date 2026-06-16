"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

type Product = {
  title: string;
  link: string;
  thumbnail: string;
};

export const HeroParallax = ({ products }: { products: Product[] }) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig,
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig,
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig,
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig,
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig,
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig,
  );

  return (
    <div
      ref={ref}
      className="relative flex h-[300vh] flex-col overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fff7f7_46%,#ffffff_100%)] py-40 antialiased [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
      >
        <motion.div className="mb-20 flex flex-row-reverse space-x-20 space-x-reverse">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="mb-20 flex flex-row space-x-20">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-20 space-x-reverse">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-24 z-20 flex justify-center px-4">
        <Link
          href="/works"
          className="pointer-events-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#991b1b] px-6 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(127,29,29,0.28)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#b91c1c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-4 focus-visible:ring-offset-white"
        >
          Explore project work
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="relative left-0 top-0 mx-auto w-full max-w-7xl px-4 py-20 md:py-40">
      <p className="mb-5 inline-flex border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-red-800">
        Project gallery
      </p>
      <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
        Finished spaces backed by controlled site execution.
      </h1>
      <p className="mt-8 max-w-2xl text-base leading-8 text-slate-600 md:text-xl md:leading-9">
        A visual record of homes, commercial blocks, interiors,
        infrastructure, and handover moments shaped through the Ractysh
        project-control idea.
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: Product;
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product relative h-96 w-[30rem] shrink-0 overflow-hidden rounded-lg border border-white/70 bg-slate-950 shadow-[0_24px_80px_rgba(15,23,42,0.18)] ring-1 ring-slate-950/5"
    >
      <Image
        src={product.thumbnail}
        fill
        sizes="30rem"
        quality={55}
        className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover/product:scale-105"
        alt={product.title}
      />
    </motion.div>
  );
};
