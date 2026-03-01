"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useCart } from "./CartProvider";

type SiteNavbarProps = {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
};

export default function SiteNavbar({
  searchQuery = "",
  onSearchChange,
  showSearch,
}: SiteNavbarProps) {
  const router = useRouter();
  const { cartItemIds, toggleCart, closeCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const resolvedSearchQuery = onSearchChange ? searchQuery : localSearchQuery;
  const shouldShowSearch = showSearch ?? Boolean(onSearchChange);

  const navigateTo = useCallback(
    (path: string) => {
      setIsMobileMenuOpen(false);
      closeCart();
      router.push(path);
    },
    [closeCart, router]
  );

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

  const handleSearchInput = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
      return;
    }

    setLocalSearchQuery(value);
  };

  const handleCartClick = () => {
    setIsMobileMenuOpen(false);
    toggleCart();
  };

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
          <div className="mono p-2 text-sm tracking-tight font-medium mix-blend-difference uppercase hover:price hover:text-white">
            HOPE&apos;S IPHONES
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCartClick}
              className="cursor-pointer px-1 text-[13px] uppercase transition hover:bg-white hover:text-black"
            >
              CART
            </button>
            <span className="border-2 border-white px-2 text-white">
              {cartItemIds.length}
            </span>
          </div>
        </div>
        <div className="hidden w-full flex-row justify-between p-2 md:flex">
          <div className="flex gap-4 p-2">
            <button
              type="button"
              onClick={() => navigateTo("/")}
              data-label="home"
              className="nav-mask-link cursor-pointer"
            >
              <span>Home</span>
            </button>
            <button
              type="button"
              onClick={() => navigateTo("/shop")}
              data-label="Shop"
              className="nav-mask-link cursor-pointer"
            >
              <span>Shop</span>
            </button>
            {/** 
            <button
              type="button"
              onClick={() => navigateTo("/archive")}
              data-label="Archive"
              className="nav-mask-link cursor-pointer"
            >
              <span>Archive</span>
            </button>
            <button
              type="button"
              onClick={() => navigateTo("/accessories")}
              data-label="Accessories"
              className="nav-mask-link cursor-pointer"
            >
              <span>Accessories</span>
            </button>*/}
          </div>
          <div className="logo flex gap-4 p-2">
            <span>Hope&apos;s iPhone Collection</span>
          </div>
          <div className="flex cursor-pointer gap-4 p-2">
            {shouldShowSearch && (
              <>
                <input
                  type="text"
                  value={resolvedSearchQuery}
                  onChange={(event) => handleSearchInput(event.target.value)}
                  placeholder="Search"
                  className="w-50 border-b bg-transparent px-1 text-white placeholder:text-white/70 outline-none"
                />
                {resolvedSearchQuery.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleSearchInput("")}
                    className="cursor-pointer px-1 text-[12px] uppercase transition hover:bg-white hover:text-black"
                  >
                    Clear
                  </button>
                )}
              </>
            )}
            <button
              type="button"
              onClick={handleCartClick}
              className="cursor-pointer px-1 transition hover:bg-white hover:text-black"
            >
              Cart
            </button>
            <span className="border-2 border-white px-2 text-white">
              {cartItemIds.length}
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
            onClick={() => navigateTo("/")}
            className="w-fit cursor-pointer px-1 text-left font-medium uppercase mono hover:bg-white hover:text-black"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => navigateTo("/shop")}
            className="w-fit cursor-pointer px-1 text-left font-medium uppercase mono hover:bg-white hover:text-black"
          >
            Shop
          </button>
          {/** 
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
          </button>*/}
        </div>
        {shouldShowSearch && (
          <div className="mt-8 flex items-end gap-2">
            <input
              type="text"
              value={resolvedSearchQuery}
              onChange={(event) => handleSearchInput(event.target.value)}
              placeholder="Search"
              className="w-full border-b bg-transparent px-1 pb-2 text-white/90 placeholder:text-white/50 outline-none mono"
            />
            {resolvedSearchQuery.trim().length > 0 && (
              <button
                type="button"
                onClick={() => handleSearchInput("")}
                className="cursor-pointer px-1 pb-1 text-[12px] uppercase transition hover:bg-white hover:text-black"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
