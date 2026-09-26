import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-6 text-white">Zavento</h3>
            <p className="text-zinc-400 mb-6 text-xs font-medium leading-relaxed max-w-xs">
              Premium print-on-demand streetwear. Express yourself with high-quality merch designed to stand out.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-zinc-400 hover:text-[#E8821C] transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-zinc-400 hover:text-[#E8821C] transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-zinc-400 hover:text-[#E8821C] transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-zinc-400 hover:text-[#E8821C] transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-zinc-500">Shop</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-zinc-300">
              <li><Link to="/category/t-shirts" className="hover:text-[#E8821C] transition-colors">T-Shirts</Link></li>
              <li><Link to="/category/caps" className="hover:text-[#E8821C] transition-colors">Caps</Link></li>
              <li><Link to="/category/mugs-cups" className="hover:text-[#E8821C] transition-colors">Mugs & Cups</Link></li>
              <li><Link to="/category/bags" className="hover:text-[#E8821C] transition-colors">Bags</Link></li>
              <li><Link to="/custom-print" className="hover:text-[#E8821C] transition-colors">Custom Print</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-zinc-500">Help</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-zinc-300">
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/tracking" className="hover:text-white transition-colors">Order Tracking</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-zinc-500">Join The Club</h4>
            <p className="text-zinc-400 text-xs font-medium leading-relaxed mb-6">Subscribe for exclusive drops, early access to sales, and 10% off your first order.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-zinc-900 border border-zinc-800 text-white px-4 py-3 w-full focus:outline-none focus:border-[#E8821C] text-xs font-medium placeholder:text-zinc-600"
              />
              <button 
                type="submit" 
                className="bg-[#E8821C] hover:bg-white hover:text-[#1A1A1A] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Join
              </button>
            </form>
          </div>

        </div>
        
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Zavento. All rights reserved.
          </p>
          <div className="flex space-x-6 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
