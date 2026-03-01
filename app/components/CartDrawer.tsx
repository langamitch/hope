"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DualRingLoader from "./DualRingLoader";
import { useCart } from "./CartProvider";
import { type IphoneModel } from "../data/iphoneModels";

const WHATSAPP_CONTACT_NAME = "Wandile";
const WHATSAPP_NUMBER = "0815909191";

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

export default function CartDrawer() {
  const router = useRouter();
  const { isCartOpen, closeCart, cartItems, removeItem } = useCart();
  const [activeOrderItem, setActiveOrderItem] = useState<IphoneModel | null>(
    null
  );
  const [isQrLoading, setIsQrLoading] = useState(false);

  useEffect(() => {
    setIsQrLoading(Boolean(activeOrderItem));
  }, [activeOrderItem]);

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

    window.open(getWhatsappUrl(activeOrderItem), "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {isCartOpen && (
        <div className="fixed top-16 right-2 left-2 z-30 max-h-[85vh] overflow-y-auto border border-black/15 bg-white p-4 text-black shadow-[0_4000px_5000px_rgba(0,0,0,0.12)] md:top-0 md:right-0 md:left-auto md:min-h-50 md:w-[380px]">
          <div className="flex items-center justify-between text-[13px] uppercase">
            <span>Cart</span>
            <button
              type="button"
              onClick={closeCart}
              className="cursor-pointer px-1 hover:bg-black hover:text-white"
            >
              CLOSE
            </button>
          </div>
          <div className="mt-4 text-[13px]">
            {cartItems.length === 0 ? (
              <div className="flex flex-col gap-1">
                <p className="w-fit mt-2 p-1">
                  Nothing here yet! Browse to see more
                </p>
                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    router.push("/shop");
                  }}
                  className="mono price mt-4 w-fit cursor-pointer px-1 mx-1 text-white"
                >
                  Shop
                </button>
              </div>
            ) : (
              <ul className="mt-10 space-y-2">
                {cartItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-2"
                  >
                    <div className="flex gap-2">
                      <div className="h-15 w-15 bg-[#f3f3f3]" />
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
                        onClick={() => removeItem(item.id)}
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
                className="price mono uppercase text-[12px] cursor-pointer px-2 text-white hover:bg-black"
              >
                Use this device
              </button>
              <button
                type="button"
                onClick={() => setActiveOrderItem(null)}
                className="cursor-pointer mono uppercase text-[12px] border border-black px-2 py-1 hover:bg-black hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
