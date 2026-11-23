import React, { useState } from "react";

export default function MenuItemCard({ item, isGrid = false }) {
  const [imgError, setImgError] = useState(false);

  // Format price
  const priceDisplay = item.priceRange
    ? item.priceRange
    : typeof item.price === "number" && item.price > 0
    ? `₦${item.price.toLocaleString()}`
    : null;

  const hasValidImage = Boolean(item.image) && !imgError;

  return (
    <article
      className={`group relative bg-[#12141A] hover:bg-[#161922] border border-[#DFB76C]/25 hover:border-[#DFB76C]/70 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-200 shadow-lg shadow-black/40 hover:shadow-[#DFB76C]/10 hover:-translate-y-1 ${
        isGrid
          ? "w-full"
          : "shrink-0 w-[230px] sm:w-[260px] snap-start"
      }`}
    >
      {/* Top Section */}
      <div>
        {/* .innerbox visual container */}
        <div className="innerbox relative w-full h-32 sm:h-36 rounded-xl overflow-hidden bg-[#0c0e14] border border-[#DFB76C]/20 flex items-center justify-center select-none group-hover:border-[#DFB76C]/40 transition-colors">
          {hasValidImage ? (
            /* Real uploaded image */
            <>
              <img
                src={item.image}
                alt={item.name}
                onError={() => setImgError(true)}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Subtle dark gradient overlay at bottom for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </>
          ) : (
            /* Premium Crest Monogram Badge fallback */
            <div className="w-full h-full bg-gradient-to-br from-[#0c0e14] via-[#0B1B3D] to-[#132247] flex flex-col items-center justify-center p-3 text-center">
              {/* Subtle decorative gold corner accents */}
              <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-[#DFB76C]/40"></div>
              <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-[#DFB76C]/40"></div>
              <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-[#DFB76C]/40"></div>
              <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-[#DFB76C]/40"></div>

              {/* Gold Paramount Crest Monogram */}
              <div className="w-12 h-12 rounded-full bg-[#DFB76C]/10 border border-[#DFB76C]/40 flex items-center justify-center shadow-inner mb-1.5 group-hover:scale-105 transition-transform duration-200">
                <svg
                  className="w-7 h-7 text-[#DFB76C]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    d="M3 21h18M5 21V9l7-6 7 6v12M9 21v-8h6v8M10 7h4"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <span className="font-serif text-[10px] tracking-widest text-[#DFB76C] uppercase font-bold">
                Paramount
              </span>
              <span className="text-[9px] tracking-wider text-slate-400 uppercase font-medium">
                Lounge &bull; Dining
              </span>
            </div>
          )}

          {/* Time Badge if breakfast/grill */}
          {item.time && (
            <span className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-full bg-black/85 backdrop-blur-sm border border-[#DFB76C]/40 text-[9px] font-semibold text-[#F5D77F] tracking-wide shadow-md">
              {item.time}
            </span>
          )}
        </div>

        {/* Dish / Drink Name */}
        <h3 className="font-serif font-extrabold text-white group-hover:text-[#F5D77F] text-base sm:text-[17px] leading-snug tracking-wide mt-3 line-clamp-2 transition-colors">
          {item.name}
        </h3>

        {/* High-Contrast Description */}
        {item.description && (
          <p className="text-xs sm:text-[13px] text-slate-300 font-medium leading-relaxed mt-1.5 line-clamp-3">
            {item.description}
          </p>
        )}
      </div>

      {/* Price Footer */}
      <div className="mt-4 pt-3 border-t border-[#DFB76C]/15 flex items-baseline justify-between">
        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
          Price
        </span>
        {priceDisplay ? (
          <span className="font-sans font-extrabold text-base sm:text-lg text-[#DFB76C] tracking-tight group-hover:scale-105 transition-transform origin-right">
            {priceDisplay}
          </span>
        ) : (
          <span className="font-bold text-slate-500 text-sm tracking-widest select-none">
            —
          </span>
        )}
      </div>
    </article>
  );
}
