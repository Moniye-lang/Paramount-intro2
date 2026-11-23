import React from "react";

export default function MenuHeader({ onOpenDrawer, onScrollToSearch }) {
  return (
    <header className="sticky top-0 z-30 bg-[#0c0e14]/95 backdrop-blur-md border-b border-[#DFB76C]/20 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        
        {/* Brand Logo & Name (matching #head .logo) */}
        <div className="flex items-center gap-3 sm:gap-4">
          <img
            src="/logo.jpg"
            alt="Paramount Place Logo"
            className="h-14 sm:h-16 md:h-20 w-auto object-contain rounded-xl border border-[#DFB76C]/40 shadow-lg shadow-black"
          />
          <div>
            <h1 className="font-serif font-black tracking-widest text-[#DFB76C] text-base sm:text-lg md:text-xl uppercase leading-tight">
              Paramount Place
            </h1>
            <p className="text-[10px] sm:text-xs tracking-wider uppercase font-semibold text-slate-300">
              Restaurant &bull; Lounge &bull; Hotel
            </p>
          </div>
        </div>

        {/* Right Navigation / Controls (matching #btn in The Seed) */}
        <div className="flex items-center">
          {/* Category Drawer Hamburger Button (#btn) */}
          <button
            onClick={onOpenDrawer}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#DFB76C] to-[#C5A059] text-black flex flex-col items-center justify-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#DFB76C]/20 cursor-pointer"
            aria-label="Open Menu Categories"
          >
            <span className="h-0.5 w-5 bg-black rounded-full transition-transform"></span>
            <span className="h-0.5 w-5 bg-black rounded-full transition-opacity"></span>
            <span className="h-0.5 w-5 bg-black rounded-full transition-transform"></span>
          </button>
        </div>

      </div>
    </header>
  );
}
