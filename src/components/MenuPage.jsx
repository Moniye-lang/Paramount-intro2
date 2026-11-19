import React, { useState, useMemo } from "react";
import { MENU_ITEMS, CATEGORIES } from "../data/menuData";
import MenuHeader from "./MenuHeader";
import CategoryNav from "./CategoryNav";
import MenuItemCard from "./MenuItemCard";
import { SearchIcon, CloseIcon } from "./Icons";

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Filtering
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchCat) return false;
      }

      if (activeCategory !== "all" && item.category !== activeCategory) {
        return false;
      }

      return true;
    });
  }, [searchQuery, activeCategory]);

  const isBrowsingAll = activeCategory === "all" && !searchQuery.trim();

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-24 font-sans selection:bg-blue-600 selection:text-white">
      {/* Brand Header (Scrolls naturally) */}
      <MenuHeader />

      {/* Search & Category Filter Sticky On-Scroll (Zero top border lines) */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md shadow-sm transition-shadow duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-2.5 space-y-2.5">
          {/* High Contrast Search Bar with Smooth Focus Ring */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <SearchIcon className="w-4 h-4 text-slate-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by dish, drink, or ingredient (e.g. Catfish, Jollof, Heineken)..."
              className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-700 focus:ring-4 focus:ring-blue-600/10 text-sm sm:text-base text-slate-950 placeholder:text-slate-500 font-medium transition-all duration-200 focus:outline-none shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-800 active:scale-90 transition-all duration-150"
                aria-label="Clear Search"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sticky Horizontal Category Filter */}
          <CategoryNav
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </div>
      </div>

      {/* Main Menu Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        
        {/* If user is searching or viewing a single category */}
        {!isBrowsingAll ? (
          <div key={activeCategory + (searchQuery ? `-${searchQuery}` : "")} className="animate-fade-in-up">
            <div className="flex items-baseline justify-between pb-3 mb-6">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-black text-slate-950 tracking-tight uppercase">
                  {searchQuery ? `Search Results` : CATEGORIES.find((c) => c.id === activeCategory)?.name}
                </h2>
                <p className="text-sm font-semibold text-slate-600 mt-1">
                  {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>

              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-900 active:scale-95 transition-all duration-150 underline underline-offset-4 cursor-pointer"
              >
                View Full Menu
              </button>
            </div>

            {filteredItems.length === 0 ? (
              <div className="py-16 text-center text-slate-600 space-y-2 animate-fade-in">
                <p className="text-base font-bold text-slate-800">No dishes or drinks match your search.</p>
                <p className="text-sm text-slate-500">Try searching for other terms like Jollof, Suya, Catfish, or Heineken.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200/90 sm:grid sm:grid-cols-2 sm:gap-x-12 sm:gap-y-0 sm:divide-y-0">
                {filteredItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Classical Categorized Menu Layout */
          <div className="space-y-12 sm:space-y-16">
            {CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
              const catItems = filteredItems.filter((i) => i.category === cat.id);
              if (catItems.length === 0) return null;

              return (
                <section key={cat.id} className="space-y-2 animate-fade-in-up">
                  {/* Category Header (No border line underneath) */}
                  <div className="pb-1 pt-2 flex items-baseline justify-between">
                    <div>
                      <h2 className="font-serif text-xl sm:text-2xl font-black tracking-wider text-slate-950 uppercase">
                        {cat.name}
                      </h2>
                      {cat.note && (
                        <p className="text-xs sm:text-sm font-bold text-blue-700 tracking-wide mt-0.5">
                          {cat.note}
                        </p>
                      )}
                    </div>

                    <span className="text-xs font-bold font-mono text-slate-600 bg-slate-100 border border-slate-200/80 px-2.5 py-0.5 rounded-full">
                      {catItems.length} {catItems.length === 1 ? "item" : "items"}
                    </span>
                  </div>

                  {/* Items List (Two column spread on desktop) */}
                  <div className="divide-y divide-slate-200/90 sm:grid sm:grid-cols-2 sm:gap-x-12 sm:gap-y-0 sm:divide-y-0">
                    {catItems.map((item) => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* Elegant Editorial Footer */}
        <footer className="mt-20 pt-8 border-t border-slate-200 text-center space-y-2 text-xs text-slate-500">
          <div className="font-serif font-black text-slate-900 uppercase tracking-widest text-xs sm:text-sm">
            Paramount Place
          </div>
          <p className="text-xs font-semibold text-slate-600">
            Hotel &bull; Restaurant &bull; Lounge &bull; Swimming Pool &bull; Gym
          </p>
          <p className="text-xs text-slate-500">
            Elewuro, Akobo, Ibadan, Oyo State, Nigeria
          </p>
          <div className="pt-2 text-[11px] text-slate-400">
            All prices are in Nigerian Naira (₦). Tax and standard service included.
          </div>
        </footer>
      </main>
    </div>
  );
}
