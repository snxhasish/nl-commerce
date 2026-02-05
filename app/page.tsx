'use client';

import { useState, useEffect, useRef } from 'react';
import { products, Product } from '@/lib/products';
import { parseNaturalLanguage, filterProducts, ParsedIntent } from '@/lib/nlParser';
import { CommandBar } from '@/components/CommandBar';
import { ProductCard } from '@/components/ProductCard';
import { Cart } from '@/components/Cart';
import { ShoppingCart, X, RotateCcw } from 'lucide-react';

export default function Home() {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentFilters, setCurrentFilters] = useState<ParsedIntent | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [lastQuery, setLastQuery] = useState('');
  const cartRef = useRef<any>(null);

  const handleSearch = (query: string) => {
    setLastQuery(query);
    const intent = parseNaturalLanguage(query);
    const results = filterProducts(products, intent);
    setFilteredProducts(results);
    setCurrentFilters(intent);
    setSelectedProducts([]);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems([...cartItems, product]);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProducts((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  const handleCompare = () => {
    if (selectedProducts.length < 2) {
      alert('Please select at least 2 products to compare');
      return;
    }
    // Implement comparison view
    alert(`Comparing ${selectedProducts.length} products`);
  };

  const handleClearFilters = () => {
    setFilteredProducts(products);
    setCurrentFilters(null);
    setSelectedProducts([]);
    setLastQuery('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (currentFilters?.category) count++;
    if (currentFilters?.gender) count++;
    if (currentFilters?.colors?.length) count += currentFilters.colors.length;
    if (currentFilters?.maxPrice) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">NLCommerce</h1>
              <p className="text-sm text-muted-foreground">
                Natural language shopping
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 hover:bg-secondary rounded-lg transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>

          {/* Command Bar */}
          <CommandBar onSearch={handleSearch} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Active Filters */}
        {currentFilters && getActiveFilterCount() > 0 && (
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Active Filters ({getActiveFilterCount()})
                </p>
                <p className="font-semibold">
                  {filteredProducts.length} results
                  {lastQuery && ` for "${lastQuery}"`}
                </p>
              </div>
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Clear All
              </button>
            </div>

            <div className="flex gap-2 flex-wrap">
              {currentFilters.category && (
                <span className="px-3 py-1 bg-secondary text-foreground rounded-full text-sm flex items-center gap-2">
                  {currentFilters.category}
                  <X className="w-3 h-3 cursor-pointer hover:opacity-70" />
                </span>
              )}
              {currentFilters.gender && (
                <span className="px-3 py-1 bg-secondary text-foreground rounded-full text-sm flex items-center gap-2">
                  {currentFilters.gender}
                  <X className="w-3 h-3 cursor-pointer hover:opacity-70" />
                </span>
              )}
              {currentFilters.colors?.map((color) => (
                <span
                  key={color}
                  className="px-3 py-1 bg-secondary text-foreground rounded-full text-sm flex items-center gap-2"
                >
                  {color}
                  <X className="w-3 h-3 cursor-pointer hover:opacity-70" />
                </span>
              ))}
              {currentFilters.maxPrice && (
                <span className="px-3 py-1 bg-secondary text-foreground rounded-full text-sm flex items-center gap-2">
                  ₹{currentFilters.maxPrice}
                  <X className="w-3 h-3 cursor-pointer hover:opacity-70" />
                </span>
              )}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-center">
            <p className="text-lg font-semibold mb-2">No products found</p>
            <p className="text-muted-foreground mb-4">
              Try a different search or clear your filters
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  isSelected={selectedProducts.includes(product.id)}
                  onSelect={handleSelectProduct}
                />
              ))}
            </div>

            {/* Compare Button */}
            {selectedProducts.length > 0 && (
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
                <button
                  onClick={handleCompare}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-all shadow-lg"
                >
                  Compare ({selectedProducts.length} selected)
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Cart Sidebar */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => alert('Proceeding to checkout with ' + cartItems.length + ' items')}
      />

      {/* Help Section */}
      <section className="border-t border-border bg-secondary/30 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-lg font-bold mb-4">Try these commands:</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'show me black oversized hoodies under 2000',
              'white sneakers for women',
              'find casual jeans',
              'mens leather jacket',
              'cheaper tees',
              'premium shirts',
            ].map((example) => (
              <button
                key={example}
                onClick={() => handleSearch(example)}
                className="text-left p-3 bg-background border border-border rounded-lg hover:border-primary hover:shadow-md transition-all text-sm"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-muted-foreground text-sm">
        <p>ShopCommand • Natural Language First Shopping Experience</p>
      </footer>
    </div>
  );
}
