import React, { useRef, useEffect } from "react";
import { CATEGORIES } from "../data/menuData";

export default function CategoryNav({ activeCategory, onSelectCategory }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeCategory]);

  return (
    <nav className="w-full">
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              data-active={isActive}
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all duration-200 cursor-pointer active:scale-95 ${
                isActive
                  ? "bg-gradient-to-r from-[#DFB76C] to-[#C5A059] text-black shadow-md shadow-[#DFB76C]/20 scale-[1.02] font-extrabold"
                  : "bg-[#12141A] text-slate-300 hover:text-[#DFB76C] hover:bg-[#181B24] border border-[#DFB76C]/20 hover:border-[#DFB76C]/50"
              }`}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
