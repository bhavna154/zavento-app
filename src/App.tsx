/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useAppStore } from './lib/store';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Category } from './pages/Category';
import { ProductDetail } from './pages/ProductDetail';
import { CustomPrint } from './pages/CustomPrint';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Wishlist } from './pages/Wishlist';
import { Search } from './pages/Search';
import { PageTransition } from './components/PageTransition';

const InfoPage = ({ title }: { title: string }) => (
  <PageTransition>
    <div className="bg-light min-h-[60vh] py-20 px-4">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-display font-bold uppercase tracking-tighter mb-8 border-b border-gray-100 pb-4">{title}</h1>
        <p className="text-gray-600 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim.
        </p>
      </div>
    </div>
  </PageTransition>
);

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/category/:categoryName" element={<PageTransition><Category /></PageTransition>} />
        <Route path="/product/:productId" element={<PageTransition><ProductDetail /></PageTransition>} />
        <Route path="/custom-print" element={<PageTransition><CustomPrint /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
        <Route path="/wishlist" element={<PageTransition><Wishlist /></PageTransition>} />
        <Route path="/search" element={<PageTransition><Search /></PageTransition>} />
        <Route path="/about" element={<InfoPage title="About Us" />} />
        <Route path="/contact" element={<InfoPage title="Contact Us" />} />
        <Route path="/faq" element={<InfoPage title="FAQ" />} />
        <Route path="/shipping" element={<InfoPage title="Shipping & Returns" />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const fetchPrintifyProducts = useAppStore((state) => state.fetchPrintifyProducts);

  useEffect(() => {
    fetchPrintifyProducts();
  }, [fetchPrintifyProducts]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex flex-col">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}
