"use client";

import { useEffect, useMemo, useState } from "react";
import NewsletterSignupButton from "./components/NewsletterSignupButton";
import Grid from "./components/Grid";
import { iphoneModels, type IphoneModel } from "./data/iphoneModels";

const WISHLIST_STORAGE_KEY = "hope:wishlist:item-ids";

type FooterInfoKey =
  | "shipping"
  | "payments"
  | "returnsAndRefunds"
  | "about"
  | "privacy";

const footerInfoContent: Record<FooterInfoKey, string> = {
  shipping:
    "We offer reliable nationwide delivery. Orders are processed once confirmed via WhatsApp. Delivery may take up to 5 business days if there were no complications from the courier used.",

  payments:
    "All checkouts are currently completed via WhatsApp. After placing your order, you will be redirected to chat with us to confirm payment. Instant transfers, and lay-by options. Payment must be confirmed before any device is shipped.",

  returnsAndRefunds:
    "We do not offer refunds. However, exchanges are accepted within 3 months of purchase if the device has a verified technical issue. The device must be returned in good condition with no physical damage. All exchanges are subject to inspection.",

  about:
    "We specialize in affordable brand new and quality pre-owned iPhones. Every device is carefully tested to ensure excellent performance and reliability. Our goal is to provide trusted devices at competitive prices with honest service.",

  privacy:
    "Customer information E.g name, cell number, device purchased,and location sent to is stored securely and only kept for a limited period for record-keeping and dispute resolution purposes. We do not share your personal details with third parties.",
};

export default function Home() {
  const youtubeVideoId = "Gg_ncsRWboo";
  const [activeFooterInfo, setActiveFooterInfo] = useState<FooterInfoKey | null>(
    null
  );
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
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
    } catch (error) {
      console.error("Unable to read wishlist data from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItemIds));
  }, [wishlistItemIds]);

  const wishlistItems = useMemo<IphoneModel[]>(
    () =>
      wishlistItemIds
        .map((itemId) => iphoneModels.find((phone) => phone.id === itemId))
        .filter((item): item is IphoneModel => Boolean(item)),
    [wishlistItemIds]
  );

  const handleToggleWishlist = (itemId: string) => {
    setWishlistItemIds((currentItems) =>
      currentItems.includes(itemId)
        ? currentItems.filter((existingId) => existingId !== itemId)
        : [...currentItems, itemId]
    );
  };

  return (
    <div className="relative min-h-screen">
      {/*navbar */}
      <div className="fixed top-0 z-20 flex w-full mix-blend-difference flex-row justify-between p-2 text-white">
        <div className="flex  cursor-pointer gap-4 p-2">
          <span onClick={() => window.open("./shop")}>Shop</span>
          <span onClick={() => window.open("./archive", "_blank")}>
            Archive
          </span>
          <span onClick={() => window.open("./accessories", "_blank")}>
            Accessories
          </span>
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
            onClick={() => setIsWishlistOpen((previous) => !previous)}
            className="cursor-pointer px-1 transition hover:bg-white hover:text-black"
          >
            Wishlist
          </button>
          <span className="border-2 border-white px-2 text-white">
            {wishlistItemIds.length}
          </span>
        </div>
      </div>
      {isWishlistOpen && (
        <div className="fixed top-0 right-0 z-30 w-[380px] border min-h-50 border-black/15 bg-white p-4 text-black shadow-[0_4000px_5000px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between text-[13px] uppercase">
            <span>Wishlist</span>
            <button
              type="button"
              onClick={() => setIsWishlistOpen(false)}
              className="cursor-pointer px-1 hover:bg-black hover:text-white"
            >
              CLOSE
            </button>
          </div>
          <div className="mt-4 text-[13px]">
            {wishlistItems.length === 0 ? (
              <p>Nothing here</p>
            ) : (
              <ul className="mt-10 space-y-2">
                {wishlistItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex flex-col">
                      <span>{item.model}</span>
                      
                      <span className="text-black/50">
                        {item.storageOptions.join(", ")}
                      </span>
                      <span className='text-black/50'>{item.price}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleWishlist(item.id)}
                        className="cursor-pointer p-1 price hover:bg-black hover:text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#fff"
                        >
                          <path d="M252.31-100Q222-100 201-121q-21-21-21-51.31v-455.38Q180-658 201-679q21-21 51.31-21H330v-10q0-62.15 43.92-106.08Q417.85-860 480-860t106.08 43.92Q630-772.15 630-710v10h77.69Q738-700 759-679q21 21 21 51.31v455.38Q780-142 759-121q-21 21-51.31 21H252.31Zm0-60h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-455.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H630v90q0 12.77-8.62 21.38Q612.77-520 600-520t-21.38-8.62Q570-537.23 570-550v-90H390v90q0 12.77-8.62 21.38Q372.77-520 360-520t-21.38-8.62Q330-537.23 330-550v-90h-77.69q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v455.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85ZM390-700h180v-10q0-37.61-26.19-63.81Q517.62-800 480-800q-37.62 0-63.81 26.19Q390-747.61 390-710v10ZM240-160v-480 480Z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleWishlist(item.id)}
                        className="cursor-pointer px-1 hover:bg-black hover:text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="currentColor"
                        >
                          <path d="M256-213.85 213.85-256l224-224-224-224L256-746.15l224 224 224-224L746.15-704l-224 224 224 224L704-213.85l-224-224-224 224Z" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/*hero */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <iframe
            className="pointer-events-none absolute top-1/2 left-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
            src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeVideoId}&modestbranding=1&rel=0&playsinline=1`}
            title="Hero background video"
            allow="autoplay; fullscreen; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/35" />
        <div className="absolute top-1/2 right-6 z-10 max-w-xl -translate-y-1/2 text-right text-white sm:right-10">
          <p className="text-lg leading-tight tracking-tight mix-blend-difference sm:text-2xl">
            Affordable brand new and pre-owned devices at a <br />
            student-friendly prices. We specialize in affordable brand new and
            quality pre-owned iPhones. Every device is carefully tested to
            ensure excellent performance and reliability. Our goal is to provide
            trusted devices at competitive prices with honest service
          </p>
          <button
            type="button"
            className="mt-6 inline-flex items-center border border-white bg-white px-6 py-2 text-sm font-medium text-black transition hover:bg-transparent hover:text-white"
          >
            Shop now
          </button>
        </div>
      </section>

      <section className="p-4 gap-1 min-h-screen flex">
        <Grid
          wishlistItemIds={wishlistItemIds}
          onToggleWishlist={handleToggleWishlist}
        />
      </section>

      {/*footer */}
      <section className="relative flex flex-col w-full bg-[#f3f3f3]">
        <div className="grid w-full grid-cols-12 gap-8 px-4 py-15">
          <div className="col-span-12 flex flex-col gap-2 py-4 uppercase text-[13px] md:col-span-3">
            <span
              onClick={() => window.open("https://wa.me/0718198376", "_blank")}
              className="hover:bg-black hover:text-white w-fit px-1 cursor-pointer"
            >
              WhatsApp
            </span>
            <span
              onClick={() =>
                window.open("https://tiktok.com/@hopemalimba", "_blank")
              }
              className="hover:bg-black hover:text-white w-fit px-1 cursor-pointer"
            >
              TikTok
            </span>

            <span
              onClick={() =>
                window.open("https://instagram.com/hope_malimba", "_blank")
              }
              className="hover:bg-black hover:text-white w-fit px-1 cursor-pointer"
            >
              Instagram
            </span>
            <span
              onClick={() =>
                window.open(
                  "https://www.facebook.com/share/1Bvyijguz6/?mibextid=wwXIfr",
                  "_blank",
                )
              }
              className="hover:bg-black hover:text-white w-fit px-1 cursor-pointer"
            >
              Facebook
            </span>

            <span
              onClick={() =>
                (window.location.href = "mailto:clodttec@gmail.com")
              }
              className="hover:bg-black hover:text-white w-fit px-1 cursor-pointer"
            >
              E-Mail
            </span>
          </div>
          <div
            className="col-span-12 flex flex-col gap-2 py-4 uppercase text-[13px] md:col-span-3"
            onMouseLeave={() => setActiveFooterInfo(null)}
          >
            <button
              type="button"
              onMouseEnter={() => setActiveFooterInfo("shipping")}
              onFocus={() => setActiveFooterInfo("shipping")}
              className="w-fit uppercase cursor-pointer text-left hover:bg-black hover:text-white px-1"
            >
              Shipping
            </button>
            <button
              type="button"
              onMouseEnter={() => setActiveFooterInfo("payments")}
              onFocus={() => setActiveFooterInfo("payments")}
              className="w-fit uppercase cursor-pointer text-left hover:bg-black hover:text-white px-1"
            >
              Payments
            </button>
            <button
              type="button"
              onMouseEnter={() => setActiveFooterInfo("returnsAndRefunds")}
              onFocus={() => setActiveFooterInfo("returnsAndRefunds")}
              className="w-fit uppercase cursor-pointer text-left hover:bg-black hover:text-white px-1"
            >
              Returns and Refunds
            </button>
          </div>
          <div
            className="col-span-12 flex flex-col gap-2 py-4 uppercase text-[13px] md:col-span-3"
            onMouseLeave={() => setActiveFooterInfo(null)}
          >
            <button
              type="button"
              onMouseEnter={() => setActiveFooterInfo("about")}
              onFocus={() => setActiveFooterInfo("about")}
              className="w-fit uppercase cursor-pointer text-left hover:bg-black hover:text-white px-1"
            >
              About
            </button>
            <button
              type="button"
              onMouseEnter={() => setActiveFooterInfo("privacy")}
              onFocus={() => setActiveFooterInfo("privacy")}
              className="w-fit uppercase cursor-pointer text-left hover:bg-black hover:text-white px-1"
            >
              Privacy
            </button>
          </div>
          <div className="col-span-12 flex flex-col gap-2 py-4 text-[13px] md:col-span-3">
            <span>JOIN THE COMMUNITY</span>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border-b mt-5 uppercase bg-transparent px-0 text-black placeholder:text-black/70 outline-none"
            />
            <span className="text-[13px]">
              Subscribe to receice monthly updates on new devices and exclusive
              offers.
            </span>
            <NewsletterSignupButton />
          </div>
          {/** 
          <div className='col-span-12 flex flex-col gap-2 py-4 text-[13px] md:col-span-3'>
            <span>Sellers image</span>
            <div className='relative mt-3 aspect-[4/5] w-full max-w-[220px] overflow-hidden border border-black/10 bg-white'>
              <Image
                src='/seller-placeholder.svg'
                alt='Seller placeholder'
                fill
                sizes='(max-width: 768px) 80vw, 220px'
                className='object-cover'
              />
            </div>
          </div>*/}
        </div>

        {activeFooterInfo && (
          <div className="absolute right-4 bottom-4 z-10 w-full max-w-xs border border-black/15 bg-white p-4 text-[12px] leading-relaxed text-black shadow-[0_16px_40px_rgba(0,0,0,0.12)] sm:right-6 sm:bottom-6 sm:max-w-sm">
            <p>{footerInfoContent[activeFooterInfo]}</p>
          </div>
        )}
      </section>
    </div>
  );
}
