"use client";

import { useCallback, useEffect, useState } from "react";
import PageEntryIntro from "../components/PageEntryIntro";
import SiteNavbar from "../components/SiteNavbar";
import Grid from "../components/Grid";
import { iphoneModels } from "../data/iphoneModels";
import { useCart } from "../components/CartProvider";

export default function ShopPage() {
  const { cartItemIds, toggleItem } = useCart();
  const [showIntro, setShowIntro] = useState(true);
  const [cartNotice, setCartNotice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleIntroDone = useCallback(() => {
    setShowIntro(false);
  }, []);

  useEffect(() => {
    if (!cartNotice) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCartNotice("");
    }, 1800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [cartNotice]);

  const handleToggleWishlist = (itemId: string) => {
    const item = iphoneModels.find((phone) => phone.id === itemId);
    const itemName = item?.model.replace(/^Apple\s+/i, "") ?? "Item";
    const isRemoving = cartItemIds.includes(itemId);
    toggleItem(itemId);
    setCartNotice(
      `${itemName} ${isRemoving ? "removed from cart" : "added to cart"}`
    );
  };

  return (
    <main className="min-h-screen bg-white pb-10 pt-18 text-black">
      <SiteNavbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      {showIntro && <PageEntryIntro label="Shop" onDone={handleIntroDone} />}
      <div className='flex flex-col p-4'>
      <section className="mb-4 mt-2 flex flex-col max-w-75 gap-2 text-[13px]">
        <p className="mono  text-black/70">
          Browse our tested iPhone range and  open any device card to view full
          details before ordering.
        </p>
        <p className="price w-fit px-2 py-1 text-white">
          Lay-buy is available on all devices.
        </p>
      </section>
      <Grid
        wishlistItemIds={cartItemIds}
        onToggleWishlist={handleToggleWishlist}
        searchQuery={searchQuery}
      />
      {cartNotice && (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex justify-center">
          <p className="price rounded-sm px-3 py-1.5 text-[12px] text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            {cartNotice}
          </p>
        </div>
      )}</div>
    </main>
  );
}
