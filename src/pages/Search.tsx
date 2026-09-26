import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MOCK_PRODUCTS, combineProducts } from '../lib/data';
import { useAppStore } from '../lib/store';
import { ProductCard } from '../components/ProductCard';

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { printifyProducts } = useAppStore();
  const allProducts = useMemo(() => combineProducts(printifyProducts), [printifyProducts]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allProducts.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }, [query, allProducts]);

  return (
    <div className="bg-light min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tighter text-dark mb-2">
          Search Results
        </h1>
        <p className="text-gray-500 mb-10 border-b border-gray-200 pb-6">
          Showing {results.length} result(s) for "{query}"
        </p>

        {results.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-2">No products found</h2>
            <p className="text-gray-500">Try checking your spelling or use more general terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {results.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
