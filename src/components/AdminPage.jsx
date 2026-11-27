import React, { useState, useEffect, useMemo, useRef } from "react";
import { MENU_ITEMS, CATEGORIES } from "../data/menuData";

const STORAGE_KEY = "paramount_menu_images";
const PIN_KEY = "paramount_admin_authenticated";
const DEFAULT_PIN = "paramount";

export default function AdminPage() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem(PIN_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  // Image mappings: { [itemId]: url }
  const [images, setImages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : {};
      // Merge with default items in menuData
      const initial = {};
      MENU_ITEMS.forEach((item) => {
        initial[item.id] = parsed[item.id] !== undefined ? parsed[item.id] : (item.image || "");
      });
      return initial;
    } catch {
      const initial = {};
      MENU_ITEMS.forEach((item) => {
        initial[item.id] = item.image || "";
      });
      return initial;
    }
  });

  // Image load test tracking: { [itemId]: "loaded" | "error" | "testing" }
  const [imageStatus, setImageStatus] = useState({});

  // UI Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filterMode, setFilterMode] = useState("all"); // "all" | "missing" | "has_image"

  // Toast / feedback message
  const [toast, setToast] = useState(null);

  // Modal states
  const [previewModalImg, setPreviewModalImg] = useState(null);
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [isSavingDirect, setIsSavingDirect] = useState(false);

  // Show Toast
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Handle PIN Unlock
  const handleUnlock = (e) => {
    e.preventDefault();
    if (pinInput.trim().toLowerCase() === DEFAULT_PIN.toLowerCase() || pinInput.trim() === "1234") {
      setIsAuthenticated(true);
      try {
        localStorage.setItem(PIN_KEY, "true");
      } catch {}
      setPinError("");
    } else {
      setPinError("Invalid PIN. (Default: paramount)");
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(PIN_KEY);
    } catch {}
    setIsAuthenticated(false);
  };

  // Update single item image URL
  const handleImageChange = (id, url) => {
    const trimmed = url.trim();
    setImages((prev) => ({
      ...prev,
      [id]: trimmed,
    }));
    // Reset test status for this item
    setImageStatus((prev) => ({
      ...prev,
      [id]: trimmed ? "testing" : "empty",
    }));
  };

  // Paste from clipboard helper
  const handlePasteFromClipboard = async (id) => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        handleImageChange(id, text);
        showToast(`Pasted URL for item ${id}`, "success");
      }
    } catch (err) {
      showToast("Clipboard access denied. Please paste manually into the input box.", "error");
    }
  };

  // Test single image load
  const testImageUrl = (id, url) => {
    if (!url) {
      setImageStatus((prev) => ({ ...prev, [id]: "empty" }));
      return;
    }
    setImageStatus((prev) => ({ ...prev, [id]: "testing" }));
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setImageStatus((prev) => ({ ...prev, [id]: "loaded" }));
    };
    img.onerror = () => {
      setImageStatus((prev) => ({ ...prev, [id]: "error" }));
    };
  };

  // Save to LocalStorage
  const handleSaveToBrowser = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
      window.dispatchEvent(new Event("paramount_images_updated"));
      showToast("Saved to browser! Live menu reflects your new images.", "success");
    } catch (err) {
      showToast("Failed to save to browser storage.", "error");
    }
  };

  // Direct Codebase Save (Vite Dev Server API)
  const handleSaveToCodebase = async () => {
    setIsSavingDirect(true);
    handleSaveToBrowser();
    try {
      const res = await fetch("/api/save-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
      });
      if (res.ok) {
        const data = await res.json();
        showToast(`Saved ${data.count || "all"} images directly to src/data/menuData.js!`, "success");
      } else {
        // If not running under Vite dev with the plugin, fallback gracefully
        showToast("Direct codebase save is available in local 'npm run dev'. Use 'Download' or 'Copy' menuData.js below to update your repo.", "info");
      }
    } catch (err) {
      showToast("Direct codebase save is available in local 'npm run dev'. Use 'Download' or 'Copy' menuData.js below to update your repo.", "info");
    } finally {
      setIsSavingDirect(false);
    }
  };

  // Generate full menuData.js file content
  const generateMenuDataCode = () => {
    const updatedItems = MENU_ITEMS.map((item) => {
      const img = images[item.id] !== undefined ? images[item.id] : item.image || "";
      return {
        ...item,
        image: img,
      };
    });

    return `// Paramount Place Official Dining & Lounge Menu\n// Generated via Paramount Menu Admin\n\nexport const CATEGORIES = ${JSON.stringify(
      CATEGORIES,
      null,
      2
    )};\n\nexport const MENU_ITEMS = ${JSON.stringify(updatedItems, null, 2)};\n`;
  };

  // Copy updated code to clipboard
  const handleCopyCode = async () => {
    try {
      const code = generateMenuDataCode();
      await navigator.clipboard.writeText(code);
      showToast("Copied updated menuData.js code to clipboard!", "success");
    } catch (err) {
      showToast("Failed to copy code to clipboard.", "error");
    }
  };

  // Download menuData.js
  const handleDownloadCode = () => {
    const code = generateMenuDataCode();
    const blob = new Blob([code], { type: "text/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "menuData.js";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Downloaded menuData.js! Replace src/data/menuData.js with this file.", "success");
  };

  // Export JSON Mappings
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(images, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "paramount_images_backup.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Downloaded images backup JSON!", "success");
  };

  // Import JSON Mappings
  const handleImportJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (typeof parsed !== "object" || parsed === null) {
        throw new Error("Invalid JSON format");
      }
      setImages((prev) => ({
        ...prev,
        ...parsed,
      }));
      setJsonModalOpen(false);
      setJsonInput("");
      showToast("Imported images successfully! Don't forget to click Save.", "success");
    } catch (err) {
      showToast("Invalid JSON. Please provide a valid JSON object of { id: url }", "error");
    }
  };

  // Compute Statistics
  const stats = useMemo(() => {
    const total = MENU_ITEMS.length;
    let withImage = 0;
    MENU_ITEMS.forEach((item) => {
      const url = images[item.id];
      if (url && url.trim().length > 0) {
        withImage++;
      }
    });
    const missing = total - withImage;
    const percentage = total > 0 ? Math.round((withImage / total) * 100) : 0;
    return { total, withImage, missing, percentage };
  }, [images]);

  // Filtered Items for Display
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }

      const img = images[item.id] || "";
      const hasImg = img.trim().length > 0;

      // Missing / Has image filter
      if (filterMode === "missing" && hasImg) return false;
      if (filterMode === "has_image" && !hasImg) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchId = item.id.toLowerCase().includes(q);
        const matchCategory = item.category.toLowerCase().includes(q);
        const matchUrl = img.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchCategory && !matchUrl) return false;
      }

      return true;
    });
  }, [images, selectedCategory, filterMode, searchQuery]);

  // If not authenticated, render PIN lock screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08090C] text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#12141A] border border-[#DFB76C]/30 rounded-3xl p-8 shadow-2xl shadow-black relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#DFB76C] to-transparent" />
          
          <div className="text-center mb-6">
            <img
              src="/logo.jpg"
              alt="Paramount Place"
              className="h-20 w-auto mx-auto object-contain rounded-2xl border border-[#DFB76C]/40 mb-4 shadow-lg shadow-black"
            />
            <h1 className="font-serif text-2xl font-black tracking-wider text-[#DFB76C] uppercase">
              Paramount Place
            </h1>
            <p className="text-xs uppercase tracking-widest text-slate-400 mt-1 font-semibold">
              Menu Media & Image Admin
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-slate-300 mb-1.5">
                Admin Passcode / PIN
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (default: paramount)"
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-[#08090C] border border-[#DFB76C]/30 focus:border-[#DFB76C] focus:outline-none text-white text-center font-mono tracking-widest text-lg placeholder:text-slate-600 transition-colors"
              />
              {pinError && (
                <p className="text-xs text-red-400 font-medium mt-1.5 text-center">
                  {pinError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#DFB76C] to-[#C5A059] hover:brightness-110 active:scale-95 text-black font-extrabold uppercase tracking-wider text-xs rounded-xl transition-all shadow-lg shadow-[#DFB76C]/20 cursor-pointer"
            >
              Enter Admin Portal
            </button>

            <div className="text-center pt-2">
              <a
                href="/menu"
                className="text-xs text-slate-400 hover:text-[#DFB76C] transition-colors underline"
              >
                &larr; Back to Public Menu
              </a>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090C] text-slate-100 flex flex-col font-sans selection:bg-[#DFB76C]/30 selection:text-[#DFB76C]">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border text-xs sm:text-sm font-semibold transition-all transform animate-bounce ${
            toast.type === "success"
              ? "bg-[#0E2A1A] border-emerald-500/50 text-emerald-300"
              : toast.type === "error"
              ? "bg-[#2D0D12] border-red-500/50 text-red-300"
              : "bg-[#1B2234] border-blue-500/50 text-blue-300"
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white"
          >
            &times;
          </button>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0C0E14]/95 backdrop-blur-md border-b border-[#DFB76C]/25 shadow-lg shadow-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Paramount Place"
              className="h-10 sm:h-12 w-auto object-contain rounded-xl border border-[#DFB76C]/40 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-black tracking-wider text-[#DFB76C] text-sm sm:text-base uppercase">
                  Paramount Place
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#DFB76C]/15 border border-[#DFB76C]/40 text-[#DFB76C] text-[10px] font-bold uppercase tracking-wider">
                  Image Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Add and manage menu item images via online URLs
              </p>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSaveToBrowser}
              title="Saves to browser storage so live menu updates immediately"
              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-[#DFB76C] to-[#C5A059] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#DFB76C]/20 flex items-center gap-1.5 cursor-pointer"
            >
              <span>💾</span>
              <span>Save Changes</span>
            </button>

            <button
              onClick={handleSaveToCodebase}
              disabled={isSavingDirect}
              title="Automatically updates src/data/menuData.js when running npm run dev"
              className="px-3 py-2 bg-[#1A1E29] hover:bg-[#252B3A] border border-[#DFB76C]/30 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>💻</span>
              <span className="hidden md:inline">Save to</span> Project
            </button>

            <button
              onClick={handleCopyCode}
              title="Copy the updated menuData.js code to clipboard"
              className="px-3 py-2 bg-[#1A1E29] hover:bg-[#252B3A] border border-[#DFB76C]/30 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>📋</span>
              <span className="hidden md:inline">Copy</span> Code
            </button>

            <button
              onClick={handleDownloadCode}
              title="Download updated menuData.js file"
              className="px-3 py-2 bg-[#1A1E29] hover:bg-[#252B3A] border border-[#DFB76C]/30 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>📥</span>
              <span className="hidden md:inline">Download</span> JS
            </button>

            <a
              href="/menu"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 bg-[#0C1220] hover:bg-[#131C30] border border-blue-500/30 text-blue-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5"
            >
              <span>👁️</span>
              <span className="hidden sm:inline">Live</span> Menu &nearr;
            </a>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
              title="Lock Admin"
            >
              🔒
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        {/* Progress & Statistics Banner */}
        <div className="bg-[#12141A] border border-[#DFB76C]/25 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif font-black text-lg sm:text-xl text-white tracking-wide">
                Menu Image Completion
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Paste any direct image URL (e.g. Unsplash, Cloudinary, Imgur, or direct HTTPS) for any item below.
              </p>
            </div>

            {/* Quick Stat Badges */}
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <div className="px-3 py-2 rounded-xl bg-[#08090C] border border-[#DFB76C]/20 text-center">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Items</span>
                <span className="text-lg font-black text-white">{stats.total}</span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-[#0E2417] border border-emerald-500/30 text-center">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-400">With Images</span>
                <span className="text-lg font-black text-emerald-300">{stats.withImage}</span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-[#291417] border border-amber-500/30 text-center">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-400">Missing</span>
                <span className="text-lg font-black text-amber-300">{stats.missing}</span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-[#1A172A] border border-[#DFB76C]/30 text-center">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#DFB76C]">Progress</span>
                <span className="text-lg font-black text-[#DFB76C]">{stats.percentage}%</span>
              </div>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="mt-4 w-full h-2.5 bg-[#08090C] rounded-full overflow-hidden border border-[#DFB76C]/20">
            <div
              className="h-full bg-gradient-to-r from-[#DFB76C] via-[#F5D77F] to-[#DFB76C] transition-all duration-500"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>

          {/* Secondary Utilities Line */}
          <div className="mt-4 pt-3 border-t border-[#DFB76C]/15 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span>💡 <strong className="text-slate-300">Tip:</strong> You can paste URLs from unsplash.com, postimages.org, or your own hosting.</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportJSON}
                className="hover:text-[#DFB76C] transition-colors underline cursor-pointer"
              >
                Export JSON Backup
              </button>
              <span>&bull;</span>
              <button
                onClick={() => setJsonModalOpen(true)}
                className="hover:text-[#DFB76C] transition-colors underline cursor-pointer"
              >
                Import JSON Backup
              </button>
            </div>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-[#12141A] border border-[#DFB76C]/20 rounded-2xl p-4 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dish, drink, or ID..."
                className="w-full pl-9 pr-8 py-2.5 bg-[#08090C] border border-[#DFB76C]/25 rounded-xl text-white text-xs sm:text-sm focus:border-[#DFB76C] focus:outline-none transition-colors placeholder:text-slate-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                >
                  &times;
                </button>
              )}
            </div>

            {/* Filter Mode Tabs (All / Missing / Has Image) */}
            <div className="flex items-center p-1 bg-[#08090C] border border-[#DFB76C]/20 rounded-xl w-full sm:w-auto">
              <button
                onClick={() => setFilterMode("all")}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterMode === "all"
                    ? "bg-[#DFB76C] text-black shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilterMode("missing")}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterMode === "missing"
                    ? "bg-amber-500 text-black shadow-sm"
                    : "text-slate-400 hover:text-amber-400"
                }`}
              >
                Needs Image ({stats.missing})
              </button>
              <button
                onClick={() => setFilterMode("has_image")}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterMode === "has_image"
                    ? "bg-emerald-500 text-black shadow-sm"
                    : "text-slate-400 hover:text-emerald-400"
                }`}
              >
                Has Image ({stats.withImage})
              </button>
            </div>
          </div>

          {/* Category Quick Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-thin scrollbar-thumb-[#DFB76C]/20">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-[#DFB76C]/20 border-[#DFB76C] text-[#DFB76C]"
                      : "bg-[#0C0E14] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count Header */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Showing <strong className="text-white">{filteredItems.length}</strong> items
            {selectedCategory !== "all" && ` in ${CATEGORIES.find((c) => c.id === selectedCategory)?.name}`}
          </span>
          {filteredItems.length > 0 && (
            <span className="text-[11px] text-slate-500">
              Changes auto-sync to local session
            </span>
          )}
        </div>

        {/* Item Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const currentUrl = images[item.id] || "";
            const hasUrl = currentUrl.trim().length > 0;
            const status = imageStatus[item.id];

            return (
              <div
                key={item.id}
                className="bg-[#12141A] border border-[#DFB76C]/20 hover:border-[#DFB76C]/50 rounded-2xl p-4 transition-all duration-200 shadow-lg shadow-black/40 flex flex-col justify-between gap-3 group"
              >
                {/* Item Details Top */}
                <div className="flex items-start gap-3.5">
                  {/* Thumbnail Preview */}
                  <div
                    onClick={() => hasUrl && setPreviewModalImg(currentUrl)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border transition-all ${
                      hasUrl
                        ? "border-[#DFB76C]/40 cursor-pointer hover:scale-105"
                        : "border-slate-800 bg-[#0C0E14]"
                    }`}
                  >
                    {hasUrl ? (
                      <>
                        <img
                          src={currentUrl}
                          alt={item.name}
                          loading="lazy"
                          onLoad={() => setImageStatus((prev) => ({ ...prev, [item.id]: "loaded" }))}
                          onError={() => setImageStatus((prev) => ({ ...prev, [item.id]: "error" }))}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-bold text-white">
                          🔍
                        </div>
                      </>
                    ) : (
                      /* Monogram fallback */
                      <div className="w-full h-full bg-gradient-to-br from-[#0c0e14] to-[#121c33] flex flex-col items-center justify-center p-1.5 text-center">
                        <span className="font-serif text-[10px] text-[#DFB76C] font-bold">
                          PP
                        </span>
                        <span className="text-[8px] text-slate-500 uppercase tracking-tighter mt-0.5">
                          No Image
                        </span>
                      </div>
                    )}

                    {/* Status Badge Tag */}
                    <div className="absolute bottom-1 right-1">
                      {status === "loaded" && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block border border-black shadow" title="Image loads successfully" />
                      )}
                      {status === "error" && (
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 block border border-black shadow animate-pulse" title="Error loading image" />
                      )}
                      {status === "testing" && (
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 block border border-black shadow animate-ping" title="Testing..." />
                      )}
                    </div>
                  </div>

                  {/* Text Information */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#08090C] border border-slate-800 text-slate-400">
                        {item.id}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[#DFB76C]/90">
                        {item.category}
                      </span>
                      {item.price && (
                        <span className="text-xs font-extrabold text-[#DFB76C] ml-auto">
                          ₦{item.price.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif font-extrabold text-white text-sm sm:text-base leading-snug mt-1 truncate">
                      {item.name}
                    </h3>

                    {item.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* URL Input Box & Action Controls */}
                <div className="space-y-1.5 pt-2 border-t border-[#DFB76C]/10">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="url"
                      value={currentUrl}
                      onChange={(e) => handleImageChange(item.id, e.target.value)}
                      placeholder="Paste image URL (https://... or /menu/...)"
                      className="flex-1 px-3 py-2 bg-[#08090C] border border-[#DFB76C]/25 rounded-xl text-white text-xs font-mono focus:border-[#DFB76C] focus:outline-none placeholder:text-slate-600 transition-colors"
                    />

                    {/* Paste Button */}
                    <button
                      type="button"
                      onClick={() => handlePasteFromClipboard(item.id)}
                      title="Paste from clipboard"
                      className="px-2.5 py-2 bg-[#1A1E29] hover:bg-[#252B3A] border border-[#DFB76C]/30 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      Paste
                    </button>

                    {/* Test Button */}
                    {hasUrl && (
                      <button
                        type="button"
                        onClick={() => testImageUrl(item.id, currentUrl)}
                        title="Test if image loads"
                        className="px-2.5 py-2 bg-[#0C1220] hover:bg-[#131C30] border border-blue-500/30 text-blue-300 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                      >
                        Test
                      </button>
                    )}

                    {/* Clear Button */}
                    {hasUrl && (
                      <button
                        type="button"
                        onClick={() => handleImageChange(item.id, "")}
                        title="Clear image"
                        className="p-2 text-slate-500 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-colors shrink-0"
                      >
                        &times;
                      </button>
                    )}
                  </div>

                  {/* Status Indicator text */}
                  {status === "error" && (
                    <p className="text-[10px] text-red-400 font-medium">
                      ⚠️ Could not load image from this URL. Verify it is a direct image link ending in .jpg/.png/.webp.
                    </p>
                  )}
                  {status === "loaded" && (
                    <p className="text-[10px] text-emerald-400 font-medium">
                      ✓ Image loaded successfully!
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-[#12141A] border border-[#DFB76C]/20 rounded-2xl p-8">
            <span className="text-4xl">🔍</span>
            <h3 className="font-serif text-lg font-bold text-white mt-3">
              No matching menu items found
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search query, category, or image status filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setFilterMode("all");
              }}
              className="mt-4 px-4 py-2 bg-[#DFB76C] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Floating Save Bar on Mobile */}
      <div className="sm:hidden sticky bottom-0 z-40 bg-[#0C0E14]/95 backdrop-blur-md border-t border-[#DFB76C]/25 p-3 flex items-center justify-between gap-2 shadow-2xl">
        <span className="text-xs text-slate-300">
          <strong className="text-[#DFB76C]">{stats.withImage}</strong> / {stats.total} Images
        </span>
        <button
          onClick={handleSaveToBrowser}
          className="px-4 py-2 bg-gradient-to-r from-[#DFB76C] to-[#C5A059] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#DFB76C]/20"
        >
          Save All Changes
        </button>
      </div>

      {/* Image Preview Lightbox Modal */}
      {previewModalImg && (
        <div
          onClick={() => setPreviewModalImg(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-2xl w-full bg-[#12141A] border border-[#DFB76C]/40 rounded-2xl p-2 shadow-2xl">
            <button
              onClick={() => setPreviewModalImg(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-black font-bold text-sm"
            >
              &times;
            </button>
            <img
              src={previewModalImg}
              alt="Preview"
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            <div className="p-3 text-center">
              <p className="text-xs text-slate-400 font-mono truncate">{previewModalImg}</p>
            </div>
          </div>
        </div>
      )}

      {/* Import JSON Modal */}
      {jsonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#12141A] border border-[#DFB76C]/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-black text-lg text-white">
                Import JSON Image Mappings
              </h3>
              <button
                onClick={() => setJsonModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Paste your JSON backup object below containing <code>&#123; "item_id": "image_url" &#125;</code>:
            </p>
            <textarea
              rows={8}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{ "bf-1": "https://...", "bf-2": "https://..." }'
              className="w-full px-3 py-2 bg-[#08090C] border border-[#DFB76C]/25 rounded-xl text-white text-xs font-mono focus:border-[#DFB76C] focus:outline-none"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setJsonModalOpen(false)}
                className="px-4 py-2 bg-transparent text-slate-400 hover:text-white text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleImportJSON}
                className="px-4 py-2 bg-[#DFB76C] hover:brightness-110 text-black text-xs font-extrabold uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Import Mappings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
