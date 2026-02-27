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

        <button
          type="button"
          aria-label={
            isWishlisted
              ? `Remove ${model} from wishlist`
              : `Add ${model} to wishlist`
          }
          onClick={onToggleWishlist}
          className={`absolute top-0 right-0 z-10 p-2 cursor-pointer w-fit ${
            isWishlisted
              ? "bg-black text-white"
              : "hover:bg-black hover:text-white"
          }`}
        >
          <svg
            width="14"
            height="16"
            viewBox="0 0 10 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.87891 0.900391V0.90332C9.0766 0.917727 9.2303 1.07762 9.23047 1.2793V11.4082C9.23047 11.4337 9.22738 11.4587 9.22266 11.4824L9.20312 11.5498C9.18615 11.5951 9.15852 11.6413 9.12305 11.6768L9.11719 11.6816C9.08491 11.7093 9.04504 11.7385 8.99609 11.7568C8.95613 11.7718 8.91093 11.7842 8.8584 11.7842C8.81058 11.7841 8.76157 11.7722 8.7207 11.7568V11.7559C8.69484 11.7469 8.67174 11.736 8.65137 11.7227L8.59473 11.6768L5.0625 8.14453L1.53125 11.6768L1.52539 11.6816C1.49316 11.7093 1.4541 11.7385 1.40527 11.7568C1.36529 11.7718 1.32015 11.7841 1.26758 11.7842C1.24352 11.7842 1.2188 11.7812 1.19531 11.7764L1.12891 11.7568C1.10458 11.7477 1.08263 11.7353 1.0625 11.7217L1.00781 11.6768C0.991718 11.6607 0.975654 11.6423 0.961914 11.6221L0.926758 11.5547C0.91111 11.513 0.900391 11.4634 0.900391 11.4121V1.2793L0.907227 1.20215C0.942426 1.02858 1.09453 0.900548 1.2793 0.900391H8.87891ZM1.65918 10.4961L4.78223 7.37305V7.37109L4.80957 7.3418C4.95655 7.18916 5.19833 7.19149 5.34766 7.34082L8.5 10.4932V1.65918H1.65918V10.4961Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="0.2"
            />
          </svg>
        </button>
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

        <div className="flex w-full mt-1 justify-between uppercase">
          <span className="price px-0.5 text-white">{price}</span>
         {/**  <span className="price px-0.5 text-white">{ctaLabel}</span>*/}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
