import React from "react";

export default function MenuHeader() {
  return (
    <header className="bg-white pt-5 pb-3">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Brand Crest & Title */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-serif font-black text-base tracking-widest shadow-md shadow-blue-700/20">
              P
            </div>
            <div>
              <h1 className="font-serif font-black tracking-wider text-slate-950 text-base sm:text-lg uppercase">
                Paramount Place
              </h1>
              <p className="text-xs tracking-wider uppercase font-semibold text-slate-600">
                Restaurant &bull; Lounge &bull; Hotel
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs tracking-wider uppercase font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Akobo, Ibadan
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
