import React, { useState } from "react";
import { CloseIcon, PlusIcon, MinusIcon, ClockIcon, FlameIcon, SparklesIcon, CheckIcon } from "./Icons";

export default function ItemModal({
  item,
  isOpen,
  onClose,
  onAddToCart
}) {
  if (!isOpen || !item) return null;

  const [selectedChoices, setSelectedChoices] = useState({});
  const [specialNote, setSpecialNote] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleSelectChoice = (groupKey, choiceValue) => {
    setSelectedChoices((prev) => ({
      ...prev,
      [groupKey]: choiceValue
    }));
  };

  const handleConfirmAdd = () => {
    onAddToCart(item, quantity, {
      choices: selectedChoices,
      note: specialNote
    });
    onClose();
  };

  const totalPrice = item.price * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto no-scrollbar flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div>
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
              {item.category.replace("-", " ")}
            </span>
            <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl">
              {item.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Price & Meta */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-blue-800 font-mono">
              ₦{item.price.toLocaleString()}
            </span>

            <div className="flex items-center gap-1.5">
              {item.time && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60">
                  <ClockIcon className="w-3 h-3" />
                  <span>{item.time}</span>
                </span>
              )}
              {item.popular && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  Popular
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            {item.description}
          </p>

          {/* Options: Single Choice Set */}
          {item.options?.choices && (
            <div className="pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-900 block mb-2">
                {item.options.label || "Select Option"}:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.options.choices.map((choice) => {
                  const isSelected = selectedChoices["main"] === choice;
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => handleSelectChoice("main", choice)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all text-left cursor-pointer ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/60 text-blue-900 font-bold"
                          : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                      }`}
                    >
                      <span>{choice}</span>
                      {isSelected && <CheckIcon className="w-4 h-4 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Options: Swallow Special (Swallow + Soup + Protein) */}
          {item.options?.swallows && (
            <div className="pt-2 border-t border-slate-100 space-y-4">
              {/* Swallow */}
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1.5">
                  1. Choose Swallow:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {item.options.swallows.map((swallow) => {
                    const isSelected = selectedChoices["swallow"] === swallow;
                    return (
                      <button
                        key={swallow}
                        type="button"
                        onClick={() => handleSelectChoice("swallow", swallow)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-700 text-white border-blue-700 shadow-sm"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {swallow}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Soup */}
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1.5">
                  2. Choose Soup:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {item.options.soups.map((soup) => {
                    const isSelected = selectedChoices["soup"] === soup;
                    return (
                      <button
                        key={soup}
                        type="button"
                        onClick={() => handleSelectChoice("soup", soup)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-700 text-white border-blue-700 shadow-sm"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {soup}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Protein */}
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1.5">
                  3. Choose Protein:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {item.options.proteins.map((protein) => {
                    const isSelected = selectedChoices["protein"] === protein;
                    return (
                      <button
                        key={protein}
                        type="button"
                        onClick={() => handleSelectChoice("protein", protein)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-700 text-white border-blue-700 shadow-sm"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {protein}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Special Request Input */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Special Instructions / Dietary notes (optional):
            </label>
            <input
              type="text"
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              placeholder="e.g. Mild pepper, extra onions, hot water on the side..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-900"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-5 py-4 border-t border-slate-100 flex items-center justify-between gap-3 z-10">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-xl bg-white text-slate-700 flex items-center justify-center font-bold shadow-sm active:scale-90"
              aria-label="Decrease"
            >
              <MinusIcon className="w-3.5 h-3.5" />
            </button>
            <span className="font-extrabold text-slate-900 font-mono text-sm px-2">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold shadow-sm active:scale-90"
              aria-label="Increase"
            >
              <PlusIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Tray Action Button */}
          <button
            onClick={handleConfirmAdd}
            className="flex-1 py-3 px-4 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-700/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Add to Tray &bull;</span>
            <span className="font-mono">₦{totalPrice.toLocaleString()}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
