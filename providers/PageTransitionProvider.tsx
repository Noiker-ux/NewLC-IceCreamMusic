"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

type TPageTransitionProvider = { className?: string };

export function PageTransitionProvider({
  children,
  className,
}: Readonly<PropsWithChildren<TPageTransitionProvider>>) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        key={pathname}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
