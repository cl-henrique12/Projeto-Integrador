interface PlaceholderImageProps {
  type?: "product" | "cover" | "logo";
  title?: string;
  className?: string;
}

export function PlaceholderImage({
  type = "product",
  title = "Geekfy",
  className = "",
}: PlaceholderImageProps) {
  if (type === "cover") {
    return (
      <div
        className={`w-full h-full bg-gradient-to-r from-mauve/40 via-blushpop/30 to-aquamarine/40 flex items-center justify-center relative overflow-hidden ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/30 via-transparent to-transparent opacity-70" />
        <div className="flex items-center gap-2 text-text-primary/60 font-display font-black text-lg sm:text-2xl tracking-wide z-10">
          <span className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-mauve text-sm font-bold shadow-sm">
            🛍️
          </span>
          <span>{title}</span>
        </div>
      </div>
    );
  }

  if (type === "logo") {
    const firstLetter = title.trim().charAt(0).toUpperCase() || "G";
    return (
      <div
        className={`w-full h-full bg-gradient-to-br from-aquamarine via-mauve to-blushpop flex items-center justify-center font-display font-black text-text-primary shadow-sm ${className}`}
      >
        <span className="text-2xl sm:text-3xl">{firstLetter}</span>
      </div>
    );
  }

  // Produto por padrão
  return (
    <div
      className={`w-full h-full bg-gradient-to-br from-mauve/15 to-aquamarine/20 flex flex-col items-center justify-center p-4 text-center border border-lavendergrey/10 ${className}`}
    >
      <div className="w-10 h-10 rounded-full bg-mauve/20 text-mauve flex items-center justify-center mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 text-text-primary/70"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      </div>
      <span className="text-xs font-semibold text-lavendergrey line-clamp-1 font-sans">
        {title}
      </span>
    </div>
  );
}
