'use client';

import { Product } from '@/lib/products';
import { X, Minus, Plus } from 'lucide-react';
import { useState } from 'react';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout?: () => void;
}

export function Cart({ isOpen, onClose, onCheckout }: CartProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [expanded, setExpanded] = useState(true);

  const addItem = (product: Product) => {
    const existingItem = items.find((i) => i.product.id === product.id);
    if (existingItem) {
      setItems(
        items.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setItems([...items, { product, quantity: 1 }]);
    }
  };

  const removeItem = (productId: string) => {
    setItems(items.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
    } else {
      setItems(
        items.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i
        )
      );
    }
  };

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div
      className={`fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border transform transition-transform duration-300 flex flex-col z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-bold">Shopping Cart</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center p-4">
            <div className="space-y-2">
              <p className="text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">
                Use the command bar to find and add items
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="p-3 border border-border rounded-lg space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.product.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      ₹{(item.product.price / 100).toFixed(0)} each
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-1 hover:bg-secondary rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity - 1)
                    }
                    className="p-1 hover:bg-secondary rounded transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                    className="p-1 hover:bg-secondary rounded transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-sm font-semibold text-right">
                  ₹{(item.product.price * item.quantity / 100).toFixed(0)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="border-t border-border p-4 space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{(total / 100).toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>Free</span>
            </div>
          </div>
          <div className="border-t border-border pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span>₹{(total / 100).toFixed(0)}</span>
          </div>
          <button
            onClick={onCheckout}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-all"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
