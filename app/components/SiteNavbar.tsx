"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { iphoneModels } from "../data/iphoneModels";

const WISHLIST_STORAGE_KEY = "hope:wishlist:item-ids";

const getWishlistItemCount = () => {
  if (typeof window === "undefined") {
    return 0;
  }

  try {
    const storedItemIds = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!storedItemIds) {
      return 0;
    }

    const parsedItemIds: unknown = JSON.parse(storedItemIds);
    if (!Array.isArray(parsedItemIds)) {
      return 0;
    }

    return parsedItemIds.filter(
      (itemId): itemId is string =>
        typeof itemId === "string" &&
        iphoneModels.some((phone) => phone.id === itemId)
    ).length;
  } catch {
    return 0;
  }
};

export default function SiteNavbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const navigateTo = useCallback(
    (path: string) => {
      setIsMobileMenuOpen(false);
      router.push(path);
    },
    [router]
  );

  useEffect(() => {
    const syncWishlistCount = () => {
      setWishlistCount(getWishlistItemCount());
    };
    const syncTimeoutId = window.setTimeout(syncWishlistCount, 0);

    window.addEventListener("storage", syncWishlistCount);
    window.addEventListener("focus", syncWishlistCount);
    window.addEventListener("wishlist-updated", syncWishlistCount);

    return () => {
      window.clearTimeout(syncTimeoutId);
      window.removeEventListener("storage", syncWishlistCount);
      window.removeEventListener("focus", syncWishlistCount);
      window.removeEventListener("wishlist-updated", syncWishlistCount);
    };
  }, []);

  useEffect(() => {
    const mobileMenu = mobileMenuRef.current;

    if (!mobileMenu) {
      return;
    }

    gsap.set(mobileMenu, {
      yPercent: -100,
      autoAlpha: 1,
      display: "none",
      pointerEvents: "none",
    });
  }, []);

  useEffect(() => {
    const mobileMenu = mobileMenuRef.current;

    if (!mobileMenu) {
      return;
    }

    gsap.killTweensOf(mobileMenu);

    if (isMobileMenuOpen) {
      gsap.set(mobileMenu, {
        display: "block",
        pointerEvents: "auto",
      });

      gsap.to(mobileMenu, {
        yPercent: 0,
        duration: 0.55,
        ease: "power3.out",
      });

      return;
    }

    gsap.to(mobileMenu, {
      yPercent: -100,
      duration: 0.45,
      ease: "power3.in",
      onComplete: () => {
        gsap.set(mobileMenu, {
          display: "none",
          pointerEvents: "none",
        });
      },
    });
  }, [isMobileMenuOpen]);

  return (
    <>
      <div className="fixed top-0 z-20 w-full text-white mix-blend-difference">
        <div className="flex items-center justify-between p-2 md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((previous) => !previous)}
            className="cursor-pointer px-2 py-1 text-[13px] text-white uppercase transition hover:bg-white hover:text-black"
          >
            {isMobileMenuOpen ? "Close" : "Menu"}
          </button>
          <div className="logo p-2 text-sm mix-blend-difference tracking-wide">
            HIC
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigateTo("/")}
              className="cursor-pointer px-1 text-[13px] uppercase transition hover:bg-white hover:text-black"
            >
              Wishlist
            </button>
            <span className="border-2 border-white px-2 text-white">
              {wishlistCount}
            </span>
          </div>
        </div>
        <div className="hidden w-full flex-row justify-between p-2 md:flex">
          <div className="flex cursor-pointer gap-4 p-2">
            <span onClick={() => navigateTo("/shop")}>Shop</span>
            <span onClick={() => navigateTo("/archive")}>Archive</span>
            <span onClick={() => navigateTo("/accessories")}>Accessories</span>
          </div>
          <div className="logo flex gap-4 p-2">
            <span>Hope&apos;s iPhone Collection</span>
          </div>
          <div className="flex cursor-pointer gap-4 p-2">
            <input
              type="text"
              placeholder="Search"
              className="w-50 border-b bg-transparent px-1 text-white placeholder:text-white/70 outline-none"
            />
            <button
              type="button"
              onClick={() => navigateTo("/")}
              className="cursor-pointer px-1 transition hover:bg-white hover:text-black"
            >
              Wishlist
            </button>
            <span className="border-2 border-white px-2 text-white">
              {wishlistCount}
            </span>
          </div>
        </div>
      </div>

      <div
        ref={mobileMenuRef}
        className="fixed top-0 right-0 left-0 z-50 price px-4 pt-4 pb-6 text-white/90 mix-blend-normal md:hidden"
      >
        <div className="relative flex items-center justify-center pb-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="cursor-pointer mono font-semibold px-2 py-1 text-[13px] uppercase transition hover:bg-white hover:text-black"
          >
            CLOSE
          </button>
        </div>
        <div className="mt-5 flex flex-col gap-3 text-base font-semibold uppercase mono">
          <button
            type="button"
            onClick={() => navigateTo("/shop")}
            className="w-fit cursor-pointer px-1 text-left font-medium uppercase mono hover:bg-white hover:text-black"
          >
            Shop
          </button>
          <button
            type="button"
            onClick={() => navigateTo("/archive")}
            className="w-fit cursor-pointer px-1 text-left font-medium uppercase mono hover:bg-white hover:text-black"
          >
            Archive
          </button>
          <button
            type="button"
            onClick={() => navigateTo("/accessories")}
            className="w-fit cursor-pointer px-1 text-left font-medium uppercase mono hover:bg-white hover:text-black"
          >
            Accessories
          </button>
        </div>
        <div className="mt-8">
          <input
            type="text"
            placeholder="Search"
            className="w-full border-b bg-transparent px-1 pb-2 text-white/90 placeholder:text-white/50 outline-none mono"
          />
        </div>
      </div>
    </>
  );
}
