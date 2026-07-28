"use client";
import { useState } from "react";
import Image, { ImageProps } from "next/image";

// Ícone de imagem quebrada (inline, sem dependência externa)
function ImageOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={32}
      height={32}
      className="text-lavendergrey/40"
    >
      <line x1="2" y1="2" x2="22" y2="22" />
      <path d="M10.41 10.41a2 2 0 1 1-2.83-2.83" />
      <line x1="13.5" y1="6" x2="6" y2="6" />
      <line x1="18" y1="11.5" x2="18" y2="18" />
      <path d="M21 15.5V6a2 2 0 0 0-2-2H9.5" />
      <path d="M3 9v9a2 2 0 0 0 2 2h11.5" />
      <path d="m15 2-3.3 3.3" />
    </svg>
  );
}

type Props = Omit<ImageProps, "onError">;

export function SafeImage(props: Props) {
  const [failed, setFailed] = useState(false);

  if (failed || !props.src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-lavendergrey/10">
        <ImageOffIcon />
      </div>
    );
  }

  return <Image {...props} onError={() => setFailed(true)} />;
}
