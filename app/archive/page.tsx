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

    </main>
  );
}
