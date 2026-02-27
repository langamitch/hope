import React from "react";

type DualRingLoaderProps = {
  className?: string;
};

const DualRingLoader = ({ className = "" }: DualRingLoaderProps) => {
  return (
    <div className={`relative flex h-14 w-14 items-center justify-center ${className}`}>
      <span className="loader-ring h-12 w-12 rounded-full border-2 border-black/20 border-t-black/70" />
      <span className="loader-ring-reverse absolute h-6 w-6 rounded-full border-2 border-black/25 border-b-black/70" />
    </div>
  );
};

export default DualRingLoader;
