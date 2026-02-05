'use client';

import { Product } from '@/lib/products';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isSelected?: boolean;
  onSelect?: (product: Product) => void;
}

export function ProductCard({
  product,
  onAddToCart,
  isSelected,
  onSelect,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [showAdded, setShowAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product);
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
  };

  return (
    <div
      className={`group rounded-lg border transition-all cursor-pointer ${
        isSelected
          ? 'border-primary bg-accent'
          : 'border-border hover:border-primary hover:shadow-lg'
      }`}
      onClick={() => onSelect?.(product)}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-square bg-white rounded-t-lg overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform bg-white"
        />
        {product.stock < 10 && (
          <div className="absolute top-2 right-2 px-3 py-1 bg-destructive text-destructive-foreground text-xs rounded-full">
            Low Stock
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground capitalize">
            {product.category}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-foreground">
            ${(product.price / 100).toFixed(0)}
          </span>
          <span className="text-sm text-muted-foreground">
            {product.gender !== 'unisex' && `• ${product.gender}`}
          </span>
        </div>

        {/* Colors */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Colors
          </p>
          <div className="flex gap-2 flex-wrap">
            {product.colors.map((color) => (
              <div
                key={color}
                className="w-6 h-6 rounded-full border border-border hover:border-primary transition-all cursor-pointer"
                style={{
                  backgroundColor: getColorHex(color),
                }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Sizes
          </p>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.slice(0, 4).map((size) => (
              <span
                key={size}
                className="px-2 py-1 text-xs border border-border rounded hover:bg-accent transition-all"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="px-2 py-1 text-xs text-muted-foreground">
                +{product.sizes.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          disabled={product.stock === 0}
          className={`w-full py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            showAdded
              ? 'bg-green-600 text-white'
              : product.stock === 0
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:opacity-90'
          }`}
        >
          {showAdded ? (
            <>
              <Check className="w-4 h-4" />
              Added!
            </>
          ) : product.stock === 0 ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </>
          )}
        </button>

        {/* Stock Info */}
        <p className="text-xs text-muted-foreground text-center">
          {product.stock > 10
            ? `${product.stock} available`
            : `Only ${product.stock} left`}
        </p>
      </div>
    </div>
  );
}

function getColorHex(colorName: string): string {
  const colorMap: Record<string, string> = {
    Black: '#000000',
    White: '#ffffff',
    Gray: '#808080',
    Grey: '#808080',
    Navy: '#000080',
    Blue: '#0000ff',
    Red: '#ff0000',
    Pink: '#ff69b4',
    Brown: '#8b4513',
    Green: '#008000',
    Purple: '#800080',
    Beige: '#f5f5dc',
    Cream: '#fffdd0',
    Blush: '#de5d83',
    Maroon: '#800000',
    'Light Blue': '#add8e6',
    Khaki: '#f0e68c',
    Striped: '#cccccc',
  };
  return colorMap[colorName] || '#e5e7eb';
}
