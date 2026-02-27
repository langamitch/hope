import React, { useState } from "react";
import type { IphoneModel } from "../data/iphoneModels";
import Image from "next/image";
import DualRingLoader from "./DualRingLoader";

type PostCardProps = Pick<
  IphoneModel,
  "model" | "storageOptions" | "condition" | "price" | "ctaLabel" | "image"
> & {
  isWishlisted: boolean
  onToggleWishlist: () => void
}

const PostCard = ({
  model,
  storageOptions,
  condition,
  price,
  ctaLabel,
  image,
  isWishlisted,
  onToggleWishlist,
}: PostCardProps) => {
  const hasImage = Boolean(image && image !== "/");
  const imageSrc = hasImage ? image : "";
  const [isImageLoading, setIsImageLoading] = useState(hasImage);

  return (
    <div className="flex flex-col w-full">
      {/* IMAGE AREA */}
      <div className="relative h-70 bg-[#f3f3f3] flex items-center justify-center">
        {hasImage && (
          <>
            {isImageLoading && (
              <div className="absolute inset-0 z-0 flex items-center justify-center">
                <DualRingLoader />
              </div>
            )}
            <Image
              src={imageSrc}
              alt={model}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 16vw"
              className={`object-cover transition-opacity duration-300 ${
                isImageLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
            />
          </>
        )}
      </div>

      {/* TEXT AREA */}
      <div className="flex flex-col text-[13px] w-full p-1">
        <div className="flex justify-between">
          <span>{model}</span>
        </div>

        <div>
          <span className="gap-1 text-black/50 flex">
            {storageOptions.map((storage) => (
              <span key={storage}>{storage}</span>
            ))}
          </span>
        </div>

        <div>
          <span className="text-black/50">{condition}</span>
        </div>

        <div className="flex w-full mt-1 justify-between capitalize">
          <span className="price px-0.5 text-white">{price}</span>
          <button
            type="button"
            onClick={onToggleWishlist}
            aria-label={
              isWishlisted
                ? `Remove ${model} from list`
                : `Add ${model} to list`
            }
            className={`price px-1 text-white cursor-pointer ${
              isWishlisted ? "bg-black" : ""
            }`}
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
