"use client";
import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { PlaceholderImage } from "./PlaceholderImage";

type Props = Omit<ImageProps, "onError"> & {
  fallbackType?: "product" | "cover" | "logo";
};

export function SafeImage({ fallbackType = "product", alt, ...props }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed || !props.src) {
    return <PlaceholderImage type={fallbackType} title={alt || "Geekfy"} />;
  }

  return <Image alt={alt} {...props} onError={() => setFailed(true)} />;
}
