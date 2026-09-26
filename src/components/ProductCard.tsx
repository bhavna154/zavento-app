import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Product } from '../lib/data';
import { useAppStore } from '../lib/store';

interface ProductCardProps {
  product: Product;
  key?: React.Key;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useAppStore();
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="group relative flex flex-col h-full bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-zinc-100 overflow-hidden border-b border-zinc-200">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          {product.images[1] && (
            <img 
              src={product.images[1]} 
              alt={`${product.name} alternate view`}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-[#1A1A1A] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
              New
            </span>
          )}
          {product.isSale && (
            <span className="bg-[#E8821C] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
              Sale
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm border border-zinc-200 text-[#1A1A1A] hover:text-[#E8821C] transition-all shadow-sm z-10"
        >
          <Heart size={16} className={isWishlisted ? 'fill-[#E8821C] text-[#E8821C]' : ''} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-[10px] font-bold text-zinc-500 mb-1 uppercase tracking-widest">{product.category}</div>
        <Link to={`/product/${product.id}`} className="block mb-2">
          <h3 className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#E8821C] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto flex items-end justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#1A1A1A]">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-zinc-400 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              {product.colors.slice(0, 3).map((color, idx) => (
                <span 
                  key={idx} 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
            {product.colors.length > 3 && (
              <span className="text-[10px] text-zinc-500 font-bold">+{product.colors.length - 3}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
