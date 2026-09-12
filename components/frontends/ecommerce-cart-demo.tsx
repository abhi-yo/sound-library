'use client';

import React, { useState } from 'react';
import { playSound } from '@/lib/lazy-sounds';
import { ShoppingBag, Plus, Minus, Trash2, Tag, Check, ArrowRight, RotateCcw } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  specs: string;
  price: number;
  quantity: number;
  badge: string;
}

const INITIAL_ITEMS: CartItem[] = [
  {
    id: '1',
    name: 'Tactile Mechanical Keypad',
    specs: 'Haptic Audio Enclosure · Matte Black',
    price: 89,
    quantity: 1,
    badge: 'Hardware',
  },
  {
    id: '2',
    name: 'Braided Audio Patch Cable',
    specs: '3.5mm Gold Plated · 1.5m Neon',
    price: 24,
    quantity: 2,
    badge: 'Accessory',
  },
];

export function EcommerceCartDemo() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);

  const updateQuantity = (id: string, delta: number) => {
    playSound('select');
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        })
    );
  };

  const removeItem = (id: string) => {
    playSound('delete');
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const applyCoupon = () => {
    if (couponApplied) return;
    playSound('magic-sparkle');
    setCouponApplied(true);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    playSound('coin');
    setTimeout(() => {
      playSound('success');
      setIsCheckingOut(false);
      setIsOrdered(true);
    }, 600);
  };

  const resetCart = () => {
    playSound('snap');
    setItems(INITIAL_ITEMS);
    setCouponApplied(false);
    setIsOrdered(false);
    setCouponCode('');
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = couponApplied ? subtotal * 0.2 : 0;
  const total = Math.max(0, subtotal - discount);

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl border border-white/[0.08] bg-[#111114] p-5 sm:p-7 shadow-2xl text-neutral-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#ff3700]/10 border border-[#ff3700]/20 flex items-center justify-center text-[#ff3700]">
            <ShoppingBag size={16} />
          </div>
          <div>
            <h4 className="font-helvetica-neue text-sm font-semibold text-white">Interactive Checkout Flow</h4>
            <p className="text-[11px] font-mono text-neutral-400">Cart steppers, delete confirms & short success</p>
          </div>
        </div>

        {(items.length !== INITIAL_ITEMS.length || couponApplied || isOrdered) && (
          <button
            type="button"
            onClick={resetCart}
            title="Reset Cart"
            className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {isOrdered ? (
        /* Order Confirmed Success Screen */
        <div className="py-10 text-center flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-full bg-[#ff3700]/15 border border-[#ff3700]/40 flex items-center justify-center text-[#ff3700] mb-3 shadow-[0_0_24px_rgba(255,55,0,0.3)]">
            <Check size={26} strokeWidth={2.5} />
          </div>
          <h5 className="font-helvetica-neue text-lg font-semibold text-white">Payment Completed!</h5>
          <p className="text-xs text-neutral-400 max-w-xs mt-1 leading-relaxed">
            Order <span className="font-mono text-white">#SB-84920</span> placed. Audible fanfare and celebration tone confirmed.
          </p>
          <button
            type="button"
            onClick={resetCart}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-mono text-white border border-white/10 transition-colors cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Simulate Another Order</span>
          </button>
        </div>
      ) : (
        /* Cart List */
        <div className="mt-4 space-y-3">
          {items.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-neutral-500">
              Cart is empty. Click reset to reload sample items.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#16161a] border border-white/[0.04] transition-all hover:border-white/[0.08]"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-white truncate">{item.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-neutral-400 border border-white/[0.04]">
                      {item.badge}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 truncate mt-0.5">{item.specs}</div>
                  <div className="text-xs font-mono font-medium text-white mt-1.5">
                    ${item.price} <span className="text-[10px] text-neutral-500 font-normal">each</span>
                  </div>
                </div>

                {/* Stepper + Delete */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="inline-flex items-center rounded-lg border border-white/[0.08] bg-[#202024] p-0.5">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      title="Decrease quantity (tap)"
                      className="w-6 h-6 rounded flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer active:scale-90"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="w-7 text-center font-mono text-xs text-white select-none">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      title="Increase quantity (tap)"
                      className="w-6 h-6 rounded flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer active:scale-90"
                    >
                      <Plus size={11} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    title="Remove item (thud)"
                    className="w-7 h-7 rounded-lg border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-neutral-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-colors cursor-pointer active:scale-90"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Promo Code Input */}
          <div className="pt-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Promo: SOUNDBITS"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full h-9 pl-8 pr-3 rounded-lg border border-white/[0.08] bg-[#16161a] text-xs font-mono text-white placeholder:text-neutral-500 outline-none focus:border-[#ff3700]/50 transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={applyCoupon}
                disabled={couponApplied || items.length === 0}
                className={`h-9 px-3.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  couponApplied
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                    : 'bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/10 active:scale-95'
                }`}
              >
                {couponApplied ? 'Applied (-20%)' : 'Apply Promo'}
              </button>
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="pt-3 space-y-1.5 border-t border-white/[0.06] text-xs font-mono">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {couponApplied && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount (20% OFF)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-semibold text-white pt-1">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout CTA Button */}
          <button
            type="button"
            onClick={handleCheckout}
            disabled={items.length === 0 || isCheckingOut}
            className="w-full mt-3 h-10 rounded-xl bg-[#ff3700] hover:bg-[#ff4500] active:scale-[0.98] text-white font-medium text-xs font-mono flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,55,0,0.25)] cursor-pointer disabled:opacity-50"
          >
            <span>{isCheckingOut ? 'Processing Order...' : `Pay $${total.toFixed(2)}`}</span>
            <ArrowRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
