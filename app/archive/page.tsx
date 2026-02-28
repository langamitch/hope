"use client";

import { useCallback, useState } from "react";
import PageEntryIntro from "../components/PageEntryIntro";
import SiteNavbar from "../components/SiteNavbar";

export default function ArchivePage() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroDone = useCallback(() => {
    setShowIntro(false);
  }, []);

  return (
    <main className="min-h-screen bg-white px-4 pb-10 pt-18 text-black">
      <SiteNavbar />
      {showIntro && <PageEntryIntro label="Archive" onDone={handleIntroDone} />}
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between border-b border-black/20 pb-3">
          <h1 className="mono text-xl uppercase">Archive</h1>
        </div>
        <p className="mono text-[13px] text-black/70">
          Archive page is ready. We can add past collections and sold devices here.
        </p>
      </div>
    </main>
  );
}
