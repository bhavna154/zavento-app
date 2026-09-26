import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { MOCK_PRODUCTS, combineProducts } from '../lib/data';
import { ProductCard } from '../components/ProductCard';

export function Wishlist() {
  const { wishlist: wishlistIds, printifyProducts } = useAppStore();
  const allProducts = useMemo(() => combineProducts(printifyProducts), [printifyProducts]);
  const wishlistedProducts = useMemo(() => allProducts.filter(p => wishlistIds.includes(p.id)), [allProducts, wishlistIds]);

  return (
    <div className="bg-light min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tighter text-dark mb-10 border-b border-gray-200 pb-6 flex items-center gap-3">
          Your Wishlist <Heart className="text-primary fill-primary" size={28} />
        </h1>

        {wishlistedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <Heart size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold mb-2">It's empty here!</h2>
            <p className="text-gray-500 mb-8">Save items you love to your wishlist to easily find them later.</p>
            <Link 
              to="/" 
              className="inline-block bg-dark text-white px-8 py-4 text-sm font-bold uppercase tracking-wider rounded-md hover:bg-primary transition-colors"
            >
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {wishlistedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
