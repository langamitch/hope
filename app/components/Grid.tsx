import React, { useMemo, useState } from "react";
import Image from "next/image";
import PostCard from "./PostCard";
import { iphoneModels, type IphoneModel } from "../data/iphoneModels";

type GridProps = {
  wishlistItemIds: string[];
  onToggleWishlist: (itemId: string) => void;
  searchQuery?: string;
};

const Grid = ({ wishlistItemIds, onToggleWishlist, searchQuery = "" }: GridProps) => {
  const [activeItem, setActiveItem] = useState<IphoneModel | null>(null);
  const hasItemImage = Boolean(activeItem?.image && activeItem.image !== "/");
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredPhones = useMemo(() => {
    if (!normalizedQuery) {
      return iphoneModels;
    }

    return iphoneModels.filter((phone) => {
      const haystack = [
        phone.model,
        phone.condition,
        phone.price,
        ...phone.storageOptions,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  return (
    <>
      {filteredPhones.length > 0 ? (
        <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-4 md:gap-4 lg:grid-cols-6">
          {filteredPhones.map((phone) => (
            <PostCard
              key={phone.id}
              model={phone.model}
              storageOptions={phone.storageOptions}
              condition={phone.condition}
              price={phone.price}
              ctaLabel={phone.ctaLabel}
              image={phone.image}
              isWishlisted={wishlistItemIds.includes(phone.id)}
              onToggleWishlist={() => onToggleWishlist(phone.id)}
              onOpenDetails={() => setActiveItem(phone)}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[34vh] w-full items-center justify-center border border-black/10 bg-[#f7f7f7] px-4 text-center">
          <p className="mono text-[13px] text-black/60">
            No devices found{searchQuery.trim() ? ` for "${searchQuery.trim()}"` : "."}
          </p>
        </div>
      )}

      {activeItem && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg bg-white p-4 text-black shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
            <div className="flex items-center justify-between text-[13px] uppercase">
              <span>Device details</span>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="cursor-pointer uppercase px-1 hover:bg-black hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="relative h-56 bg-[#f3f3f3]">
                {hasItemImage ? (
                  <Image
                    src={activeItem.image}
                    alt={activeItem.model}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[12px] text-black/50">
                    No image available
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 text-[13px]">
                <div className="mono text-sm uppercase">{activeItem.model}</div>
                <div className="text-black/60">
                  Storage: {activeItem.storageOptions.join(", ")}
                </div>
                <div className="text-black/60">
                  Condition: {activeItem.condition}
                </div>
                <div className="text-black/60">Price: {activeItem.price}</div>
                <div className="text-black/60">
                  Description: Reliable iPhone with full core features working
                  and ready for everyday us. Comes with a charging cable and devices 
                  are available in assorted colors.
                </div>
                <div className="text-black/60">
                  Lay-buy: Available on all devices.
                </div>
                
                <button
                  type="button"
                  onClick={() => onToggleWishlist(activeItem.id)}
                  className="price mt-2 w-fit cursor-pointer px-2 py-1 text-white"
                >
                  {wishlistItemIds.includes(activeItem.id)
                    ? "Remove from cart"
                    : "Add to cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Grid;
