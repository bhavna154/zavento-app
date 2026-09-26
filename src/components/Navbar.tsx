import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Search, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../lib/store';

export function Navbar() {
  const cart = useAppStore(state => state.cart);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <div className="bg-[#1A1A1A] text-white text-center py-1.5 text-[10px] uppercase tracking-[0.2em] font-bold">
        Free shipping on all orders over $75
      </div>
      
      <header className="w-full border-b border-zinc-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -ml-2 text-dark hover:text-primary transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center justify-center lg:justify-start flex-1 lg:flex-none">
              <Link to="/" className="text-2xl font-black tracking-tighter uppercase text-dark">
                Zavento
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-6">
              <div className="relative group">
                <button className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] hover:text-[#E8821C] pb-1 border-b-2 border-transparent hover:border-[#E8821C] transition-colors inline-flex items-center">
                  Shop
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left -translate-y-2 group-hover:translate-y-0">
                  <div className="py-2">
                    <Link to="/category/t-shirts" className="block px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-700 hover:bg-gray-50 hover:text-primary">T-Shirts</Link>
                    <Link to="/category/caps" className="block px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-700 hover:bg-gray-50 hover:text-primary">Caps</Link>
                    <Link to="/category/mugs-cups" className="block px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-700 hover:bg-gray-50 hover:text-primary">Mugs & Cups</Link>
                    <Link to="/category/bags" className="block px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-700 hover:bg-gray-50 hover:text-primary">Bags</Link>
                  </div>
                </div>
              </div>
              <Link to="/custom-print" className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A] hover:text-[#E8821C] pb-1 border-b-2 border-transparent hover:border-[#E8821C] transition-colors">
                Custom Print
              </Link>
              <Link to="/category/t-shirts?sale=true" className="text-xs font-bold uppercase tracking-widest text-[#E8821C] hover:text-[#E8821C] pb-1 border-b-2 border-transparent hover:border-[#E8821C] transition-colors">
                Sale
              </Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center justify-end space-x-4 lg:space-x-6 flex-1 lg:flex-none">
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 -mr-2 lg:mr-0 text-dark hover:text-primary transition-colors">
                <Search size={20} />
              </button>
              <Link to="/wishlist" className="p-2 -mr-2 lg:mr-0 text-dark hover:text-primary transition-colors hidden sm:block">
                <Heart size={20} />
              </Link>
              <button className="p-2 -mr-2 lg:mr-0 text-dark hover:text-primary transition-colors hidden sm:block">
                <User size={20} />
              </button>
              <Link to="/cart" className="p-2 -mr-2 lg:mr-0 text-dark hover:text-primary transition-colors relative">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full bg-white border-b border-zinc-200 p-4 shadow-sm"
            >
              <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex gap-2">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="flex-1 border border-zinc-300 p-3 rounded-none focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="bg-[#1A1A1A] hover:bg-[#E8821C] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest">
                  Search
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: '-100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-zinc-200 shadow-xl h-screen"
            >
              <div className="px-4 pt-4 pb-6 space-y-1">
                <Link to="/category/t-shirts" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-4 text-xs font-bold text-[#1A1A1A] border-b border-zinc-100 uppercase tracking-widest">T-Shirts</Link>
                <Link to="/category/caps" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-4 text-xs font-bold text-[#1A1A1A] border-b border-zinc-100 uppercase tracking-widest">Caps</Link>
                <Link to="/category/mugs-cups" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-4 text-xs font-bold text-[#1A1A1A] border-b border-zinc-100 uppercase tracking-widest">Mugs & Cups</Link>
                <Link to="/category/bags" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-4 text-xs font-bold text-[#1A1A1A] border-b border-zinc-100 uppercase tracking-widest">Bags</Link>
                <Link to="/custom-print" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-4 text-xs font-bold text-[#1A1A1A] border-b border-zinc-100 uppercase tracking-widest">Custom Print</Link>
                <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-4 text-xs font-bold text-[#1A1A1A] border-b border-zinc-100 uppercase tracking-widest">Wishlist</Link>
                <Link to="/category/t-shirts?sale=true" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-4 text-xs font-bold text-[#E8821C] uppercase tracking-widest">Sale</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
