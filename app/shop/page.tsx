"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import PageEntryIntro from "../components/PageEntryIntro";

export default function ShopPage() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroDone = useCallback(() => {
    setShowIntro(false);
  }, []);

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-black">
      {showIntro && <PageEntryIntro label="Shop" onDone={handleIntroDone} />}
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between border-b border-black/20 pb-3">
          <h1 className="mono text-xl uppercase">Shop</h1>
          <Link href="/" className="mono text-[13px] uppercase hover:bg-black hover:text-white px-1">
            Home
          </Link>
        </div>
        <p className="mono text-[13px] text-black/70">
          Welcome to the shop page. We can now plug in shop-specific content and filters here.
        </p>
      </div>
    </main>
  );
}
