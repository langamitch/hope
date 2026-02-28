"use client";

import { useCallback, useState } from "react";
import PageEntryIntro from "../components/PageEntryIntro";
import SiteNavbar from "../components/SiteNavbar";

export default function AccessoriesPage() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroDone = useCallback(() => {
    setShowIntro(false);
  }, []);

  return (
    <main className="min-h-screen bg-white px-4 pb-10 pt-18 text-black">
      <SiteNavbar />
      {showIntro && (
        <PageEntryIntro label="Accessories" onDone={handleIntroDone} />
      )}
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between border-b border-black/20 pb-3">
          <h1 className="mono text-xl uppercase">Accessories</h1>
        </div>
        <p className="mono text-[13px] text-black/70">
          Accessories page is ready. We can add chargers, cables, and cases here.
        </p>
      </div>
    </main>
  );
}
