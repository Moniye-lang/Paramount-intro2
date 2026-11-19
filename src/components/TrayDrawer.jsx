import React, { useState } from "react";
import { CloseIcon, PlusIcon, MinusIcon, ShoppingBagIcon, WhatsAppIcon, CheckIcon } from "./Icons";

export default function TrayDrawer({
  isOpen,
  onClose,
  trayItems,
  onUpdateQty,
  onClearTray
}) {
  if (!isOpen) return null;

  const [orderType, setOrderType] = useState("table"); // 'table', 'room', 'pickup'
  const [tableOrRoom, setTableOrRoom] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [orderSent, setOrderSent] = useState(false);

  const subtotal = trayItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const totalItemsCount = trayItems.reduce((acc, it) => acc + it.quantity, 0);

  const handleSendWhatsAppOrder = () => {
    if (trayItems.length === 0) return;

    // Format WhatsApp message
    let message = `*PARAMOUNT PLACE - FOOD & DRINK ORDER*\n`;
    message += `--------------------------------------\n`;
    message += `*Customer:* ${customerName || "Guest"}\n`;
    message += `*Service:* ${
      orderType === "table"
        ? `Dine-In (Table: ${tableOrRoom || "Unspecified"})`
        : orderType === "room"
        ? `Room Service (Room: ${tableOrRoom || "Unspecified"})`
        : `Takeaway / Pickup`
    }\n`;
    message += `*Date/Time:* ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n\n`;
    message += `*ITEMS ORDERED:*\n`;

    trayItems.forEach((it, idx) => {
      message += `${idx + 1}. *${it.name}* (x${it.quantity}) - ₦${(it.price * it.quantity).toLocaleString()}\n`;
      if (it.customOptions?.choices && Object.keys(it.customOptions.choices).length > 0) {
        const choiceDetails = Object.values(it.customOptions.choices).join(", ");
        message += `   ↳ _Choice: ${choiceDetails}_\n`;
      }
      if (it.customOptions?.note) {
        message += `   ↳ _Note: ${it.customOptions.note}_\n`;
      }
    });

    message += `\n*TOTAL:* ₦${subtotal.toLocaleString()}\n`;
    message += `--------------------------------------\n`;
    message += `Please confirm my order. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    // WhatsApp URL (can default to Paramount's official line or prompt)
    const whatsappUrl = `https://wa.me/2348000000000?text=${encodedMessage}`;
    
    setOrderSent(true);
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <ShoppingBagIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
                Your Order Tray
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"} selected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {trayItems.length > 0 && (
              <button
                onClick={onClearTray}
                className="text-[11px] font-bold text-slate-400 hover:text-rose-600 transition-colors px-2 py-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tray Item List */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto no-scrollbar space-y-3">
          {trayItems.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-400 mx-auto flex items-center justify-center text-2xl">
                🍽️
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Your tray is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore our breakfast, Nigerian dishes, grills, and drinks, and add your favorites.
              </p>
            </div>
          ) : (
            trayItems.map((item) => (
              <div
                key={item.cartId || item.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 hover:border-blue-200 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs font-bold text-blue-700 font-mono mt-0.5">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>

                  {/* Selected Choices Details */}
                  {item.customOptions?.choices && (
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {Object.values(item.customOptions.choices).join(" • ")}
                    </p>
                  )}
                  {item.customOptions?.note && (
                    <p className="text-[10px] text-slate-400 italic truncate">
                      "{item.customOptions.note}"
                    </p>
                  )}
                </div>

                {/* Qty Stepper */}
                <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-sm shrink-0">
                  <button
                    onClick={() => onUpdateQty(item.cartId || item.id, item.quantity - 1)}
                    className="w-6 h-6 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-200 flex items-center justify-center"
                    aria-label="Decrease"
                  >
                    <MinusIcon className="w-3 h-3" />
                  </button>
                  <span className="font-bold text-xs font-mono px-1">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQty(item.cartId || item.id, item.quantity + 1)}
                    className="w-6 h-6 rounded-lg bg-blue-700 text-white hover:bg-blue-800 flex items-center justify-center"
                    aria-label="Increase"
                  >
                    <PlusIcon className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Dining Details Form */}
          {trayItems.length > 0 && (
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "table", label: "Dine In" },
                  { id: "room", label: "Room Service" },
                  { id: "pickup", label: "Takeout" }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setOrderType(t.id)}
                    className={`py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      orderType === t.id
                        ? "bg-blue-700 text-white border-blue-700 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {orderType === "table" ? "Table Number" : orderType === "room" ? "Room Number" : "Pickup Note"}
                  </label>
                  <input
                    type="text"
                    value={tableOrRoom}
                    onChange={(e) => setTableOrRoom(e.target.value)}
                    placeholder={orderType === "table" ? "e.g. Table 4" : orderType === "room" ? "e.g. Room 102" : "Pickup ASAP"}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Guest Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. David A."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with WhatsApp Trigger */}
        {trayItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-white space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Amount:
              </span>
              <span className="text-xl sm:text-2xl font-black text-blue-800 font-mono">
                ₦{subtotal.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleSendWhatsAppOrder}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-extrabold text-sm shadow-xl shadow-blue-700/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <WhatsAppIcon className="w-5 h-5 text-emerald-300" />
              <span>Send Order to Waiter via WhatsApp</span>
            </button>
            <p className="text-[11px] text-center text-slate-400">
              Paramount Place &bull; Elewuro, Akobo, Ibadan
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
