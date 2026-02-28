"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type PageEntryIntroProps = {
  label: string;
  onDone: () => void;
  holdMs?: number;
};

export default function PageEntryIntro({
  label,
  onDone,
  holdMs = 1200,
}: PageEntryIntroProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const overlay = overlayRef.current;

    if (!overlay) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    gsap.set(overlay, { clipPath: "inset(0% 0% 0% 0%)" });

    const timeline = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = previousOverflow;
        onDone();
      },
    });

    timeline.to({}, { duration: holdMs / 1000 });
    timeline.to(overlay, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 0.9,
      ease: "power4.inOut",
    });

    return () => {
      timeline.kill();
      gsap.killTweensOf(overlay);
      document.body.style.overflow = previousOverflow;
    };
  }, [holdMs, onDone]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center price text-white"
    >
      <p className="mono text-[13px] capitalize tracking-tight">{label}</p>
    </div>
  );
}
