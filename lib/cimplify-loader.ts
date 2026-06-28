import type { ImageLoader } from "next/image";

import { assetUrl, isCimplifyAsset } from "@cimplify/sdk";

const cdnBase = process.env.NEXT_PUBLIC_CIMPLIFY_CDN_URL?.trim() || undefined;

const cimplifyImageLoader: ImageLoader = ({ src, width, quality }) => {
  if (isCimplifyAsset(src, cdnBase)) {
    return assetUrl(src, {
      base: cdnBase,
      w: width,
      quality,
      format: "auto",
    });
  }
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}w=${width}&q=${quality ?? 75}`;
};

export default cimplifyImageLoader;
