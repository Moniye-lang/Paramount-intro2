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
                  ? "bg-blue-700 text-white shadow-md shadow-blue-700/25 scale-[1.02]"
                  : "bg-slate-100/90 text-slate-800 hover:bg-slate-200 hover:text-blue-800 border border-slate-200/80 hover:scale-[1.01]"
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
