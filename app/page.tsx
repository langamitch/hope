"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import NewsletterSignupButton, {
  type NewsletterSignupState,
} from "./components/NewsletterSignupButton";
import Grid from "./components/Grid";
import SiteIntro from "./components/SiteIntro";
import SiteNavbar from "./components/SiteNavbar";
import { iphoneModels } from "./data/iphoneModels";
import { useCart } from "./components/CartProvider";

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
    "We specialize in affordable Pre-Owned and quality pre-owned iPhones. Every device is carefully tested to ensure excellent performance and reliability. Our goal is to provide trusted devices at competitive prices with honest service.",

  privacy:
    "Customer information E.g name, cell number, device purchased,and location sent to is stored securely and only kept for a limited period for record-keeping and dispute resolution purposes. We do not share your personal details with third parties.",
};

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function Home() {
  const router = useRouter();
  const { cartItemIds, toggleItem, closeCart } = useCart();
  const youtubeVideoId = "Gg_ncsRWboo";
  const [showIntro, setShowIntro] = useState(true);
  const [useInteractiveHeroVideo] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const ua = navigator.userAgent || "";
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    return isIOS || isTouch;
  });
  const [activeFooterInfo, setActiveFooterInfo] =
    useState<FooterInfoKey | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterState, setNewsletterState] =
    useState<NewsletterSignupState>("idle");
  const [newsletterFeedback, setNewsletterFeedback] = useState("");
  const [cartNotice, setCartNotice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleIntroDone = useCallback(() => {
    setShowIntro(false);
  }, []);

  const handleToggleWishlist = (itemId: string) => {
    const item = iphoneModels.find((phone) => phone.id === itemId);
    const itemName = item?.model.replace(/^Apple\s+/i, "") ?? "Item";
    const isRemoving = cartItemIds.includes(itemId);
    toggleItem(itemId);
    setCartNotice(
      `${itemName} ${isRemoving ? "removed from cart" : "added to cart"}`,
    );
  };

  const navigateTo = useCallback(
    (path: string) => {
      closeCart();
      router.push(path);
    },
    [closeCart, router],
  );

  const handleNewsletterSignup = async () => {
    const email = newsletterEmail.trim().toLowerCase();

    if (!isValidEmail(email)) {
      setNewsletterState("error");
      setNewsletterFeedback("Please enter a valid email address.");
      return;
    }

    setNewsletterState("loading");
    setNewsletterFeedback("");

    try {
      const response = await fetch("/api/newsletter-signups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source: "footer",
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        alreadySubscribed?: boolean;
      } | null;

      if (!response.ok) {
        setNewsletterState("error");
        setNewsletterFeedback(
          payload?.error ?? "Could not sign you up right now.",
        );
        return;
      }

      setNewsletterState("done");
      setNewsletterFeedback(
        payload?.alreadySubscribed
          ? "You are already subscribed."
          : "Thanks you.",
      );
      setNewsletterEmail("");
    } catch (error) {
      console.error("Newsletter signup failed", error);
      setNewsletterState("error");
      setNewsletterFeedback("Network error. Please try again.");
    }
  };

  return (
    <div className="relative min-h-fit">
      {showIntro && <SiteIntro onDone={handleIntroDone} />}
      <SiteNavbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      {cartNotice && (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex justify-center">
          <p className="price px-3 py-1.5 text-[12px] text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            {cartNotice}
          </p>
        </div>
      )}

      {/*hero */}
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <iframe
            className={`absolute top-1/2 left-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 ${
              useInteractiveHeroVideo
                ? "pointer-events-auto"
                : "pointer-events-none"
            }`}
            src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&controls=${
              useInteractiveHeroVideo ? 1 : 0
            }&loop=1&playlist=${youtubeVideoId}&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`}
            title="Hero background video"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/35 to-black/35" />
        <div className="absolute top-1/2 right-6 z-10 max-w-xl -translate-y-1/2 text-right text-white sm:right-10">
          <p className="text-lg leading-tight tracking-tight mix-blend-difference sm:text-2xl">
            Affordable Pre-Owned and pre-owned devices at a <br />
            student-friendly prices. We specialize in affordable Pre-Owned and
            quality pre-owned iPhones. Every device is carefully tested to
            ensure excellent performance and reliability. Our goal is to provide
            trusted devices at competitive prices with honest service
          </p>
          <button
            type="button"
            onClick={() => navigateTo("/shop")}
            className="mt-6 inline-flex items-center border border-white bg-white px-6 py-2 text-sm font-medium text-black transition hover:bg-transparent hover:text-white"
          >
            Shop now
          </button>
        </div>
      </section>

      <section className="p-4 gap-1 min-h-screen flex flex-col">
        <div className="mb-3 flex w-full justify-between">
          <h3 className="text-white mono text-xs  px-2 price">Shop</h3>
          <h3 className="text-white mono text-xs  px-2 bg-black">Pre-Owned</h3>
          <h3 className="text-white mono text-xs  px-2 bg-black">Pre-owned</h3>
          <h3 className="text-white mono text-xs  px-2 bg-black">
            Student sale{" "}
          </h3>
        </div>
        <h3 className="mono text-sm leading-tight mb-3">
          Browse at your own pace and reach out <br />
          anytime if you need advice, we&apos;re here <br />
          to help
        </h3>
        <Grid
          wishlistItemIds={cartItemIds}
          onToggleWishlist={handleToggleWishlist}
          searchQuery={searchQuery}
        />
      </section>

      <section className="h-screen hidden p-4 mt-6">
        <div className="w-full h-full bg-[#f3f3f3]"></div>
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
              value={newsletterEmail}
              onChange={(event) => {
                setNewsletterEmail(event.target.value);
                if (newsletterState !== "idle") {
                  setNewsletterState("idle");
                  setNewsletterFeedback("");
                }
              }}
              className="w-full border-b mt-5 uppercase bg-transparent px-0 text-black placeholder:text-black/70 outline-none"
            />
            <span className="text-[13px]">
              Subscribe to receice monthly updates on new devices and exclusive
              offers.
            </span>
            {newsletterFeedback && (
              <span
                className={`text-[12px] ${
                  newsletterState === "error" ? "text-red-600" : "text-black/70"
                }`}
              >
                {newsletterFeedback}
              </span>
            )}
            <NewsletterSignupButton
              state={newsletterState}
              onClick={handleNewsletterSignup}
              disabled={newsletterEmail.trim().length === 0}
            />
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
