"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function PortalScrollWrapper({ children }: { children: React.ReactNode }) {
  const ref = useScrollReveal();

  return (
    <div ref={ref}>
      {children}
    </div>
  );
}
