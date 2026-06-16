"use client";

import * as React from "react";
import { motion } from "framer-motion";

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12.75 11.25 15 15 9.75" />
    <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const LoadingSpinner = () => (
  <svg
    className="animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export function MultiStepLoader({
  loadingStates,
  loading,
  duration = 2000,
  loop = true
}: {
  loadingStates: { text: string }[];
  loading: boolean;
  duration?: number;
  loop?: boolean;
}) {
  const [currentState, setCurrentState] = React.useState(0);

  React.useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentState((prev) => {
        if (prev >= loadingStates.length - 1) {
          if (loop) return 0;
          return prev;
        }
        return prev + 1;
      });
    }, duration);

    return () => clearInterval(interval);
  }, [loading, loadingStates.length, duration, loop]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-5">
        {loadingStates.map((state, index) => (
          <motion.div
            key={state.text}
            initial={{ opacity: 0 }}
            animate={{ opacity: index <= currentState ? 1 : 0.2 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 text-sm"
          >
            {index < currentState ? (
              <CheckIcon className="h-5 w-5 text-emerald-500" />
            ) : index === currentState ? (
              <LoadingSpinner />
            ) : (
              <div className="h-5 w-5 rounded-full border border-[#232323]" />
            )}
            <span className={index <= currentState ? "text-[#F5F5F5]" : "text-[#9B9B9B]"}>
              {state.text}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
