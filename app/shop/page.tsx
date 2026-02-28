"use client";

import { useCallback, useEffect, useState } from "react";
import PageEntryIntro from "../components/PageEntryIntro";
import SiteNavbar from "../components/SiteNavbar";
import Grid from "../components/Grid";
import { iphoneModels } from "../data/iphoneModels";

const WISHLIST_STORAGE_KEY = "hope:wishlist:item-ids";

export default function ShopPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [wishlistItemIds, setWishlistItemIds] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const storedItemIds = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (!storedItemIds) {
        return [];
      }

      const parsedItemIds: unknown = JSON.parse(storedItemIds);
      if (!Array.isArray(parsedItemIds)) {
        return [];
      }

      return parsedItemIds.filter(
        (itemId): itemId is string =>
          typeof itemId === "string" &&
          iphoneModels.some((phone) => phone.id === itemId)
      );
    } catch {
      return [];
    }
  });

  const handleIntroDone = useCallback(() => {
    setShowIntro(false);
  }, []);

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItemIds));
    window.dispatchEvent(new Event("wishlist-updated"));
  }, [wishlistItemIds]);

  const handleToggleWishlist = useCallback((itemId: string) => {
    setWishlistItemIds((currentItems) =>
      currentItems.includes(itemId)
        ? currentItems.filter((existingId) => existingId !== itemId)
        : [...currentItems, itemId]
    );
  }, []);

  return (
    <main className="min-h-screen bg-white px-4 pb-10 pt-18 text-black">
      <SiteNavbar />
      {showIntro && <PageEntryIntro label="Shop" onDone={handleIntroDone} />}
      <section className="mb-4 mt-2 flex flex-col gap-2 text-[13px]">
        <p className="mono text-black/70">
          Browse our tested iPhone range and open any device card to view full
          details before ordering.
        </p>
        <p className="price w-fit px-2 py-1 text-white">
          Lay-buy is available on all devices.
        </p>
      </section>
      <Grid
        wishlistItemIds={wishlistItemIds}
        onToggleWishlist={handleToggleWishlist}
      />
    </main>
  );
}
