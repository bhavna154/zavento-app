import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { MOCK_PRODUCTS, Product, Category as CategoryType, combineProducts } from '../lib/data';
import { useAppStore } from '../lib/store';
import { ProductCard } from '../components/ProductCard';

export function Category() {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const isSale = searchParams.get('sale') === 'true';
  const { printifyProducts } = useAppStore();
  const allProducts = useMemo(() => combineProducts(printifyProducts), [printifyProducts]);
  
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // Map URL param to category name
  const getCategoryFromParam = (param: string | undefined): CategoryType | null => {
    switch (param) {
      case 't-shirts': return 'T-Shirts';
      case 'caps': return 'Caps';
      case 'mugs-cups': return 'Mugs & Cups';
      case 'bags': return 'Bags';
      default: return null;
    }
  };

  const currentCategory = getCategoryFromParam(categoryName);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (currentCategory) {
      result = result.filter(p => p.category === currentCategory);
    }
    
    if (isSale) {
      result = result.filter(p => p.isSale);
    }

    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'new') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return result;
  }, [allProducts, currentCategory, isSale, sortBy, selectedSizes]);

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const allSizes = useMemo(() => {
    const sizes = new Set<string>();
    allProducts.forEach(p => p.sizes.forEach(s => sizes.add(s)));
    return Array.from(sizes);
  }, [allProducts]);

  const pageTitle = isSale ? 'Sale' : (currentCategory || 'All Products');
  const pageDescription = isSale 
    ? 'Grab them before they are gone. Up to 40% off.'
    : `Explore our collection of premium ${pageTitle.toLowerCase()}.`;

  return (
    <div className="bg-light min-h-screen pb-20">
      {/* Category Header */}
      <div className="bg-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter mb-4">
            {pageTitle}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {pageDescription}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <div className="md:hidden flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 font-semibold uppercase tracking-wider text-sm"
            >
              <Filter size={18} /> Filters
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-sm font-semibold focus:outline-none uppercase tracking-wider"
              >
                <option value="popular">Popular</option>
                <option value="new">Newest</option>
                <option value="price-low">Price: Low-High</option>
                <option value="price-high">Price: High-Low</option>
              </select>
            </div>
          </div>

          {/* Sidebar Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 font-display font-bold text-xl uppercase tracking-wider mb-6 border-b border-gray-100 pb-4">
                <SlidersHorizontal size={20} className="text-primary" /> Filters
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold uppercase tracking-wider text-sm mb-3">Sort By</h3>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-200 p-2 text-sm focus:outline-none focus:border-primary rounded-md"
                >
                  <option value="popular">Popularity</option>
                  <option value="new">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold uppercase tracking-wider text-sm mb-3">Size</h3>
                <div className="grid grid-cols-3 gap-2">
                  {allSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`py-2 text-xs font-semibold uppercase tracking-wider border rounded-md transition-colors ${
                        selectedSizes.includes(size)
                          ? 'bg-dark text-white border-dark'
                          : 'bg-white text-dark border-gray-200 hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-4 text-sm text-gray-500 font-medium">
              Showing {filteredProducts.length} products
            </div>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-display font-bold uppercase tracking-wider mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters.</p>
                <button 
                  onClick={() => { setSelectedSizes([]); setSortBy('popular'); }}
                  className="bg-dark text-white px-6 py-2 text-sm font-semibold uppercase tracking-wider hover:bg-primary transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
