"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import NewsletterSignupButton from "./components/NewsletterSignupButton";
import Grid from "./components/Grid";
import DualRingLoader from "./components/DualRingLoader";
import { iphoneModels, type IphoneModel } from "./data/iphoneModels";

const WISHLIST_STORAGE_KEY = "hope:wishlist:item-ids";
const WHATSAPP_CONTACT_NAME = "Wandile";
const WHATSAPP_NUMBER = "0815909191";

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

const getPrimaryStorage = (item: IphoneModel) =>
  item.storageOptions[0] ?? "Storage option";

const normalizeWhatsappNumber = (value: string) => {
  const digitsOnly = value.replace(/\D/g, "");
  if (digitsOnly.startsWith("0")) {
    return `27${digitsOnly.slice(1)}`;
  }

  return digitsOnly;
};

const getWhatsappMessage = (item: IphoneModel) => {
  const cleanModel = item.model.replace(/^Apple\s+/i, "");
  return `Hi ${WHATSAPP_CONTACT_NAME}, i am contacting you regarding the ${cleanModel}, ${getPrimaryStorage(item)}, ${item.price} in price i would like to know available colors and continue with buying`;
};

const getWhatsappUrl = (item: IphoneModel) => {
  const phone = normalizeWhatsappNumber(WHATSAPP_NUMBER);
  return `https://wa.me/${phone}?text=${encodeURIComponent(
    getWhatsappMessage(item)
  )}`;
};

const getWhatsappQrUrl = (item: IphoneModel) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
    getWhatsappUrl(item)
  )}`;

export default function Home() {
  const youtubeVideoId = "Gg_ncsRWboo";
  const [activeFooterInfo, setActiveFooterInfo] = useState<FooterInfoKey | null>(
    null
  );
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [activeOrderItem, setActiveOrderItem] = useState<IphoneModel | null>(
    null
  );
  const [isQrLoading, setIsQrLoading] = useState(false);
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

  useEffect(() => {
    setIsQrLoading(Boolean(activeOrderItem));
  }, [activeOrderItem]);

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

  const logWishlistInquiry = async (item: IphoneModel) => {
    try {
      await fetch("/api/wishlist-inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: item.id,
          model: item.model,
          storage: getPrimaryStorage(item),
          price: item.price,
          message: getWhatsappMessage(item),
          whatsappUrl: getWhatsappUrl(item),
        }),
      });
    } catch (error) {
      console.error("Failed to log wishlist inquiry", error);
    }
  };

  const handleStartOrder = (item: IphoneModel) => {
    if (activeOrderItem?.id === item.id) {
      return;
    }

    setActiveOrderItem(item);
    void logWishlistInquiry(item);
  };

  const handleContinueOnPc = () => {
    if (!activeOrderItem) {
      return;
    }

    window.open(
      getWhatsappUrl(activeOrderItem),
      "_blank",
      "noopener,noreferrer"
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
              <p className='justify-center bg-[#f3f3f3] p-1'>Nothing here yet!</p>
            ) : (
              <ul className="mt-10 space-y-2">
                {wishlistItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-2"
                  >
                    <div className="flex gap-2">
                      <div className="h-15 w-15 bg-[#f3f3f3]"></div>
                      <div className="flex flex-col">
                        <span>{item.model}</span>
                        <span className="text-black/50">
                          {item.storageOptions.join(", ")}
                        </span>
                        <span className="text-black/50">{item.price}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleStartOrder(item)}
                        className="cursor-pointer text-white px-2 p-0.5 price hover:bg-black hover:text-white"
                      >
                        Start order
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
      {activeOrderItem && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm bg-white p-4 text-black shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
            <div className="flex items-center justify-between text-[13px] uppercase">
              <span>Complete On WhatsApp</span>
              <button
                type="button"
                onClick={() => setActiveOrderItem(null)}
                className="cursor-pointer px-1 hover:bg-black hover:text-white"
              >
                CLOSE
              </button>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed">
              Scan the QR code to open WhatsApp with your pre-filled message for{" "}
              {activeOrderItem.model}.
            </p>
            <div className="mt-3 flex justify-center">
              <div className="relative h-50 w-50">
                {isQrLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
                    <DualRingLoader />
                  </div>
                )}
                <Image
                  src={getWhatsappQrUrl(activeOrderItem)}
                  alt={`QR code to start WhatsApp order for ${activeOrderItem.model}`}
                  fill
                  sizes="200px"
                  className={`border border-black/10 object-contain transition-opacity duration-300 ${
                    isQrLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={() => setIsQrLoading(false)}
                  onError={() => setIsQrLoading(false)}
                  unoptimized
                />
              </div>
            </div>
            <div className="mt-4 flex uppercase gap-2">
              <button
                type="button"
                onClick={handleContinueOnPc}
                className="price mono uppercase  text-[12px] cursor-pointer px-2 text-white hover:bg-black"
              >
                Use this device
              </button>
              <button
                type="button"
                onClick={() => setActiveOrderItem(null)}
                className="cursor-pointer mono uppercase  text-[12px] border border-black px-2 py-1 hover:bg-black hover:text-white"
              >
                Cancel
              </button>
            </div>
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

      <section className="p-4 gap-1 min-h-screen flex flex-col">
        <div className='mb-3 flex w-full justify-between'>
          
          <h3 className='text-white mono text-xs  px-2 price'>Shop</h3>
          <h3 className='text-white mono text-xs  px-2 bg-black'>Brand New</h3>
          <h3 className='text-white mono text-xs  px-2 bg-black'>Pre-owned</h3>
          <h3 className='text-white mono text-xs  px-2 bg-black'>Student sale</h3>
        </div>
         <h3 className='mono text-sm leading-tight mb-3'>Browse at your own pace and reach out <br />anytime if you need advice, we&apos;re here <br />to help</h3>
        <Grid
          wishlistItemIds={wishlistItemIds}
          onToggleWishlist={handleToggleWishlist}
        />
      </section>

      <section className='h-screen p-4 mt-6'>
        <div className='w-full h-full bg-[#f3f3f3]'></div>
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
