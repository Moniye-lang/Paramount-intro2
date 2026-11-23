import React, { useState, useMemo, useRef, useEffect } from "react";
import { MENU_ITEMS, CATEGORIES } from "../data/menuData";
import MenuHeader from "./MenuHeader";
import CategoryDrawer from "./CategoryDrawer";
import CategoryNav from "./CategoryNav";
import MenuItemCard from "./MenuItemCard";
import { SearchIcon, CloseIcon } from "./Icons";

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const searchInputRef = useRef(null);

  // Monitor scroll for Back-to-Top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filtered items when searching or filtering
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

  const isSearching = searchQuery.trim().length > 0;

  // Handle drawer category selection with smooth scroll
  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    setSearchQuery("");

    if (catId === "all") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setTimeout(() => {
        const section = document.getElementById(catId);
        if (section) {
          const yOffset = -90; // offset for fixed header
          const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 50);
    }
  };

  const handleScrollToSearch = () => {
    const cover = document.getElementById("cover");
    if (cover) {
      cover.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 400);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Horizontal scroll helpers for category aisles
  const scrollRow = (categoryId, direction) => {
    const row = document.getElementById(`row-${categoryId}`);
    if (row) {
      const scrollAmount = direction === "left" ? -320 : 320;
      row.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-[#DFB76C] selection:text-black">
      {/* Category Slide-in Drawer (#drop) */}
      <CategoryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelectCategory={handleSelectCategory}
      />

      {/* Fixed Luxury Header (#head) */}
      <MenuHeader
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onScrollToSearch={handleScrollToSearch}
      />

      {/* Hero & Search Banner (#cover) */}
      <section
        id="cover"
        className="relative bg-gradient-to-b from-[#0c0e14] via-[#0e121a] to-[#0a0a0c] border-b border-[#DFB76C]/20 pt-10 pb-8 px-4 sm:px-6 text-center overflow-hidden"
      >
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-64 bg-radial from-[#DFB76C]/10 via-[#0B1B3D]/20 to-transparent blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto space-y-4">
          <h2 className="font-serif font-black text-2xl sm:text-4xl text-white tracking-widest uppercase">
            Paramount Place Menu
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-medium">
            Explore our curated culinary selections, signature grill platters, premium beverages, and bespoke bar cocktails.
          </p>

          {/* Search Input Box */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center gap-2 max-w-xl mx-auto mt-4 bg-[#12141A] p-1.5 rounded-2xl border border-[#DFB76C]/40 shadow-xl shadow-black/60 focus-within:border-[#DFB76C] focus-within:ring-2 focus-within:ring-[#DFB76C]/20 transition-all"
          >
            <div className="pl-3 text-slate-400">
              <SearchIcon className="w-5 h-5 text-[#DFB76C]" />
            </div>

            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, drinks, or ingredients (e.g. Catfish, Jollof, Heineken)..."
              className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-slate-400 px-2 py-2 focus:outline-none font-medium"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-1.5 text-slate-400 hover:text-white transition-colors"
                aria-label="Clear Search"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => {}}
              className="px-4 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#DFB76C] to-[#C5A059] text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#DFB76C]/20 shrink-0"
            >
              Search
            </button>
          </form>

          {/* Sticky Category Quick Pills */}
          <div className="pt-2">
            <CategoryNav
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
            />
          </div>
        </div>
      </section>

      {/* Marquee Announcement Bar */}
      <div className="bg-[#0e1118] border-b border-[#DFB76C]/20 py-2.5 overflow-hidden text-xs font-semibold text-[#DFB76C] tracking-wider uppercase select-none">
        <div className="whitespace-nowrap animate-marquee inline-block">
          PARAMOUNT PLACE &bull; FINE DINING &bull; SIGNATURE GRILL &bull; LUXURY LOUNGE &bull; ELEWURO, AKOBO, IBADAN &bull; ALL PRICES IN NIGERIAN NAIRA (₦) &bull; TAX & SERVICE INCLUDED &bull; WELCOME TO PARAMOUNT PLACE
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* ==================================================== */}
        {/* SEARCH RESULTS VIEW (Grid Mode for easy scanning)    */}
        {/* ==================================================== */}
        {isSearching ? (
          <div className="animate-fade-in-up">
            <div className="flex items-baseline justify-between border-b border-[#DFB76C]/20 pb-4 mb-6">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#DFB76C] tracking-wide uppercase">
                  Search Results
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Found <span className="font-bold text-white">{filteredItems.length}</span>{" "}
                  {filteredItems.length === 1 ? "item" : "items"} matching "{searchQuery}"
                </p>
              </div>

              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="text-xs sm:text-sm font-bold text-[#DFB76C] hover:text-[#F5D77F] underline underline-offset-4 cursor-pointer"
              >
                Clear Search
              </button>
            </div>

            {filteredItems.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <p className="text-lg font-serif font-bold text-slate-300">
                  No menu items found
                </p>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  We couldn't find anything matching "{searchQuery}". Try searching for Jollof, Catfish, Suya, Smoothies, or Heineken.
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-5 py-2 rounded-xl bg-[#DFB76C] text-black font-bold text-xs uppercase tracking-wider"
                >
                  View All Items
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} isGrid={true} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ==================================================== */
          /* THE SEED HORIZONTAL SWIPEABLE AISLE LAYOUT          */
          /* ==================================================== */
          <div className="space-y-12 sm:space-y-16">
            {CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
              // If user selected a specific category from pills, only show that category
              if (activeCategory !== "all" && activeCategory !== cat.id) {
                return null;
              }

              const catItems = MENU_ITEMS.filter((i) => i.category === cat.id);
              if (catItems.length === 0) return null;

              return (
                <section
                  key={cat.id}
                  id={cat.id}
                  className="relative space-y-4 scroll-mt-28 animate-fade-in-up"
                >
                  {/* Category Title & Controls Header */}
                  <div className="flex items-center justify-between border-b border-[#DFB76C]/25 pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#DFB76C]" />
                        <h2 className="font-serif text-xl sm:text-2xl font-black tracking-wider text-white uppercase">
                          {cat.name}
                        </h2>
                      </div>
                      {cat.note && (
                        <p className="text-xs font-semibold text-[#DFB76C] pl-5">
                          {cat.note}
                        </p>
                      )}
                    </div>

                    {/* Right Controls: Item Count + Scroll Buttons */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-300 bg-[#12141A] border border-[#DFB76C]/25 px-2.5 py-0.5 rounded-full">
                        {catItems.length} {catItems.length === 1 ? "item" : "items"}
                      </span>

                      {/* Desktop Left/Right Scroll Arrows */}
                      <div className="hidden sm:flex items-center gap-1 ml-2">
                        <button
                          onClick={() => scrollRow(cat.id, "left")}
                          className="w-8 h-8 rounded-full bg-[#12141A] border border-[#DFB76C]/30 text-[#DFB76C] hover:bg-[#DFB76C]/20 flex items-center justify-center transition-colors cursor-pointer"
                          aria-label={`Scroll ${cat.name} left`}
                        >
                          &#8249;
                        </button>
                        <button
                          onClick={() => scrollRow(cat.id, "right")}
                          className="w-8 h-8 rounded-full bg-[#12141A] border border-[#DFB76C]/30 text-[#DFB76C] hover:bg-[#DFB76C]/20 flex items-center justify-center transition-colors cursor-pointer"
                          aria-label={`Scroll ${cat.name} right`}
                        >
                          &#8250;
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Scrollable Row (.itemcover from The Seed) */}
                  <div
                    id={`row-${cat.id}`}
                    className="itemcover flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-0.5"
                  >
                    {catItems.map((item) => (
                      <MenuItemCard key={item.id} item={item} isGrid={false} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      {/* Luxury Footer (#foot) */}
      <footer
        id="foot"
        className="mt-20 border-t border-[#DFB76C]/30 bg-[#060709] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 text-xs font-sans"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="Paramount Place"
                className="w-10 h-10 rounded-lg object-contain border border-[#DFB76C]/40"
              />
              <span className="font-serif font-black text-sm tracking-widest text-[#DFB76C] uppercase">
                Paramount Place
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Experience the pinnacle of hospitality, exquisite Nigerian & Continental dining, and a premier lounge atmosphere in Akobo, Ibadan.
            </p>
          </div>

          {/* Dining Hours */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-[#DFB76C] text-xs uppercase tracking-wider">
              Dining Hours
            </h4>
            <ul className="space-y-1.5 text-slate-300 text-xs">
              <li><span className="text-white font-semibold">Breakfast:</span> 7:00 AM – 11:00 AM</li>
              <li><span className="text-white font-semibold">All-Day Dining:</span> 11:00 AM – 11:00 PM</li>
              <li><span className="text-white font-semibold">Grill & BBQ:</span> 4:00 PM – Late</li>
              <li><span className="text-white font-semibold">Lounge & Bar:</span> Open Daily</li>
            </ul>
          </div>

          {/* Location & Contact */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-[#DFB76C] text-xs uppercase tracking-wider">
              Location & Details
            </h4>
            <p className="text-slate-300 leading-relaxed text-xs">
              Elewuro, Akobo, Ibadan, Oyo State, Nigeria.
            </p>
            <p className="text-slate-400 text-[11px] pt-1">
              Hotel &bull; Restaurant &bull; Lounge &bull; Swimming Pool &bull; Gym
            </p>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-[#DFB76C] text-xs uppercase tracking-wider">
              Navigation
            </h4>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="text-left text-[#DFB76C] hover:underline cursor-pointer"
              >
                &rarr; View All Categories
              </button>
              <button
                onClick={handleScrollToSearch}
                className="text-left text-[#DFB76C] hover:underline cursor-pointer"
              >
                &rarr; Search Dishes & Drinks
              </button>
              <button
                onClick={scrollToTop}
                className="text-left text-slate-400 hover:text-white cursor-pointer"
              >
                &uarr; Back to Top
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <p>&copy; {new Date().getFullYear()} Paramount Place. All rights reserved.</p>
          <p>Prices in Nigerian Naira (₦). Tax & Service Included.</p>
        </div>
      </footer>

      {/* Floating Back to Top Button (#totop) */}
      {showScrollTop && (
        <button
          id="totop"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-gradient-to-r from-[#DFB76C] to-[#C5A059] text-black shadow-lg shadow-black/80 flex items-center justify-center font-bold text-lg hover:brightness-110 active:scale-90 transition-all cursor-pointer"
          aria-label="Back to Top"
        >
          &#8593;
        </button>
      )}
    </div>
  );
}
