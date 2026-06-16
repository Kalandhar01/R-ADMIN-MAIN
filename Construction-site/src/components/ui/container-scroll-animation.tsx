"use client";
import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion, type MotionValue } from "motion/react";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="relative flex h-auto items-start justify-center px-2 pb-10 pt-5 sm:h-[94rem] sm:p-2 sm:pt-5 md:h-[70rem] md:p-10 md:pt-8"
      ref={containerRef}
    >
      <div
        className="relative w-full py-8 md:py-16"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: string | React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="mx-auto max-w-5xl text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  const [isPhoneShell, setIsPhoneShell] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const updateShellMode = () => setIsPhoneShell(mediaQuery.matches);

    updateShellMode();
    mediaQuery.addEventListener("change", updateShellMode);
    return () => mediaQuery.removeEventListener("change", updateShellMode);
  }, []);

  return (
    <motion.div
      style={{
        rotateX: isPhoneShell ? 0 : rotate,
        scale: isPhoneShell ? 1 : scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="relative mx-auto -mt-8 aspect-[9/18.6] w-[min(78vw,330px)] rounded-[2.6rem] border border-white/20 bg-[#080d0b] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.55)] sm:-mt-10 sm:aspect-auto sm:h-[68rem] sm:w-full sm:max-w-5xl sm:rounded-[30px] sm:border-red-950/20 sm:bg-[#07090d] sm:p-2 sm:shadow-2xl sm:shadow-red-950/20 sm:ring-1 sm:ring-white/70 md:-mt-12 md:h-[40rem] md:p-6"
    >
      <div className="pointer-events-none absolute left-1/2 top-3 z-20 h-7 w-28 -translate-x-1/2 rounded-full bg-black shadow-[0_8px_28px_rgba(0,0,0,0.45)] sm:hidden" />
      <div className="relative h-full w-full overflow-y-auto overflow-x-hidden rounded-[2rem] border border-white/10 bg-[#07100d] [-ms-overflow-style:none] [scrollbar-width:none] sm:overflow-hidden sm:rounded-2xl sm:border-0 sm:bg-[#05070c] md:rounded-2xl [&::-webkit-scrollbar]:hidden">
        {children}
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10 sm:hidden" />
      </div>
    </motion.div>
  );
};
