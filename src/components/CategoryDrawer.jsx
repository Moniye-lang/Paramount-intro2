import React, { useEffect } from "react";
import { CATEGORIES } from "../data/menuData";

export default function CategoryDrawer({ isOpen, onClose, onSelectCategory }) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Drawer Container (#drop from The Seed) */}
      <div className="relative w-80 max-w-[85vw] bg-[#0c0e14] border-r border-[#DFB76C]/30 text-white flex flex-col h-full shadow-2xl shadow-black z-10 animate-drawer">
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#DFB76C]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Paramount Place"
              className="w-9 h-9 rounded-lg object-contain border border-[#DFB76C]/40"
            />
            <div>
              <h2 className="font-serif font-black tracking-widest text-sm text-[#DFB76C] uppercase">
                MENU CATEGORY
              </h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Paramount Place
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#DFB76C]/40 text-[#DFB76C] hover:bg-[#DFB76C]/10 flex items-center justify-center text-xl leading-none transition-colors"
            aria-label="Close Categories Menu"
          >
            &times;
          </button>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                onClose();
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-150 flex items-center justify-between text-slate-200 hover:text-[#DFB76C] hover:bg-[#DFB76C]/10 active:scale-98"
            >
              <span>{cat.name}</span>
              {cat.note && (
                <span className="text-[10px] text-[#DFB76C]/70 lowercase font-normal">
                  {cat.note}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#DFB76C]/20 bg-[#08090d] text-center text-[11px] text-slate-400">
          <div className="font-serif font-bold text-[#DFB76C] uppercase tracking-wider">
            Paramount Place
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Akobo, Ibadan, Nigeria</p>
        </div>
      </div>
    </div>
  );
}
