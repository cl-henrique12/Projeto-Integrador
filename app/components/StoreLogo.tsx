"use client";
import { useState } from "react";
import Image from "next/image";

export function StoreLogo({
  logoUrl,
  name,
  size = 56,
}: {
  logoUrl?: string | null;
  name: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const showFallback = !logoUrl || failed;

  return (
    <div
      className="rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-mauve to-blushpop"
      style={{ width: size, height: size }}
    >
      {showFallback ? (
        <span className="font-display font-black text-text-primary" style={{ fontSize: size * 0.35 }}>
          {name.charAt(0)}
        </span>
      ) : (
        <Image
          src={logoUrl!}
          alt={`Logo ${name}`}
          width={size}
          height={size}
          className="object-cover w-full h-full"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
