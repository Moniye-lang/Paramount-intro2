import React from "react";

export default function MenuHeader({ onOpenDrawer, onScrollToSearch }) {
  return (
    <header className="sticky top-0 z-30 bg-[#0c0e14]/95 backdrop-blur-md border-b border-[#DFB76C]/20 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        
        {/* Brand Logo & Name (matching #head .logo) */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.jpg"
            alt="Paramount Place Logo"
            className="h-10 sm:h-12 w-auto object-contain rounded-lg border border-[#DFB76C]/40 shadow-md shadow-black"
          />
          <div>
            <h1 className="font-serif font-black tracking-widest text-[#DFB76C] text-sm sm:text-base uppercase leading-tight">
              Paramount Place
            </h1>
            <p className="text-[10px] sm:text-[11px] tracking-wider uppercase font-semibold text-slate-300">
              Restaurant &bull; Lounge &bull; Hotel
            </p>
          </div>
        </div>

        {/* Right Navigation / Controls (matching #btn in The Seed) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Shortcut */}
          <button
            onClick={onScrollToSearch}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-[#DFB76C]/30 text-slate-300 hover:text-[#DFB76C] hover:border-[#DFB76C] hover:bg-[#DFB76C]/10 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            aria-label="Search Menu"
          >
            <svg className="w-4 h-4 text-[#DFB76C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span className="hidden sm:inline">Search</span>
          </button>

          {/* Category Drawer Trigger Button (#btn) */}
          <button
            onClick={onOpenDrawer}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#DFB76C] to-[#C5A059] text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#DFB76C]/20 cursor-pointer"
            aria-label="Open Categories Menu"
          >
            {/* Hamburger 3-line icon */}
            <div className="flex flex-col gap-1 w-4 justify-center">
              <span className="h-0.5 w-full bg-black rounded-full"></span>
              <span className="h-0.5 w-full bg-black rounded-full"></span>
              <span className="h-0.5 w-full bg-full bg-black rounded-full"></span>
            </div>
            <span>Categories</span>
          </button>
        </div>

      </div>
    </header>
  );
}
