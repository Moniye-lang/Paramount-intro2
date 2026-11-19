import React from "react";

export default function MenuItemCard({ item }) {
  // Format price without weird font-mono spacing
  const priceDisplay = item.priceRange
    ? item.priceRange
    : (typeof item.price === "number" && item.price > 0 ? `₦${item.price.toLocaleString()}` : null);

  return (
    <article className="group py-4 sm:py-5 border-b border-slate-200/80 last:border-b-0 px-2.5 sm:px-3.5 -mx-2.5 sm:-mx-3.5 rounded-2xl hover:bg-slate-50/80 active:bg-blue-50/40 transition-all duration-200 ease-out cursor-default">
      {/* Title & Price Line */}
      <div className="flex items-baseline justify-between gap-4 mb-1">
        <h3 className="font-extrabold text-slate-950 group-hover:text-blue-900 text-base sm:text-lg leading-snug tracking-tight transition-colors duration-200">
          {item.name}
        </h3>

        {/* Space for the Price */}
        <div className="shrink-0 text-right min-w-[70px] sm:min-w-[85px]">
          {priceDisplay ? (
            <span className="inline-block font-sans font-extrabold text-lg sm:text-xl text-blue-700 tracking-tight whitespace-nowrap group-hover:scale-[1.03] transition-transform duration-200 origin-right">
              {priceDisplay}
            </span>
          ) : (
            <span className="font-sans font-bold text-slate-300 text-base sm:text-lg tracking-wider select-none">
              —
            </span>
          )}
        </div>
      </div>

      {/* High-Contrast, Bold & Readable Description */}
      {item.description && (
        <p className="text-sm sm:text-[15px] text-slate-800 font-semibold leading-relaxed mt-1.5 transition-colors duration-200">
          {item.description}
        </p>
      )}

      {/* Service Availability Badge */}
      {item.time && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Hours:
          </span>
          <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/80">
            {item.time}
          </span>
        </div>
      )}
    </article>
  );
}
