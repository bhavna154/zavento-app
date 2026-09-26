import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Undo2, Truck, Droplets, UploadCloud, Printer, Package } from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_PRODUCTS, CATEGORIES, combineProducts } from '../lib/data';
import { useAppStore } from '../lib/store';
import { ProductCard } from '../components/ProductCard';

export function Home() {
  const { printifyProducts } = useAppStore();
  const allProducts = useMemo(() => combineProducts(printifyProducts), [printifyProducts]);
  const trendingProducts = allProducts.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1">
        <div className="h-[85vh] flex flex-col md:flex-row border-b border-zinc-200">
          
          {/* Left Column: Hero Typography & CTA */}
          <div className="w-full md:w-[50%] flex flex-col justify-center px-8 md:px-16 py-12 md:py-0 border-b md:border-b-0 md:border-r border-zinc-200 bg-white">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-[52px] md:text-[64px] lg:text-[72px] leading-[1] font-black tracking-tighter uppercase text-[#1A1A1A] mb-6">
                Design It.<br/>
                <span className="text-[#E8821C]">Print It.</span><br/>
                Wear It.
              </h1>
              <p className="text-sm font-medium leading-relaxed text-zinc-600 mb-8 max-w-md">
                High-definition custom printing on premium blank t-shirts, caps, mugs, and bags. Bring your ideas to life or shop our curated streetwear collections.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/category/t-shirts" 
                  className="bg-[#1A1A1A] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#E8821C] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-center whitespace-nowrap"
                >
                  Shop Collection
                </Link>
                <Link 
                  to="/custom-print" 
                  className="bg-white text-[#1A1A1A] border border-[#1A1A1A] px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-zinc-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-center whitespace-nowrap"
                >
                  Create Your Own
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Hero Imagery Grid */}
          <div className="w-full md:w-[50%] h-[400px] md:h-full relative bg-zinc-50 p-4 md:p-8 flex items-center justify-center">
            <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full h-full max-h-[800px]">
              <div className="bg-zinc-200 overflow-hidden relative group">
                <img src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800" alt="Printed T-Shirt" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
              </div>
              <div className="bg-zinc-200 overflow-hidden relative group">
                <img src="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800" alt="Custom Mug" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
              </div>
              <div className="bg-zinc-200 overflow-hidden relative group">
                <img src="https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&q=80&w=800" alt="Printed Bag" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
              </div>
              <div className="bg-zinc-200 overflow-hidden relative group">
                <img src="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800" alt="Custom Cap" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-white border-y border-zinc-200 py-8">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center gap-3 text-zinc-600">
              <Droplets className="text-[#1A1A1A]" size={24} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]">Premium Cotton</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-zinc-600">
              <ShieldCheck className="text-[#1A1A1A]" size={24} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]">100% Authentic</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-zinc-600">
              <Undo2 className="text-[#1A1A1A]" size={24} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]">Easy Returns</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-zinc-600">
              <Truck className="text-[#1A1A1A]" size={24} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]">Fast Shipping</span>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="py-20 bg-zinc-50 border-b border-zinc-200"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10 border-b border-zinc-200 pb-4">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-[#1A1A1A] uppercase tracking-tighter">Collections</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((category, idx) => (
              <Link key={idx} to={category.link} className="group relative block h-[450px] overflow-hidden border border-zinc-200">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-[#1A1A1A]/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{category.name}</h3>
                  <div className="w-10 h-10 bg-[#E8821C] flex items-center justify-center opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRight size={20} className="text-white" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Promo Banner */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-[#E8821C] py-16 relative overflow-hidden border-b border-zinc-200"
      >
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-[#1A1A1A] uppercase tracking-tighter mb-4">
            Mid-Season Sale
          </h2>
          <p className="text-[#1A1A1A]/90 text-sm font-bold uppercase tracking-widest mb-8 max-w-2xl mx-auto">
            Up to 40% off on selected streetwear essentials.
          </p>
          <Link 
            to="/category/t-shirts?sale=true" 
            className="inline-block bg-[#1A1A1A] hover:bg-white text-white hover:text-[#1A1A1A] border border-[#1A1A1A] px-10 py-4 text-xs font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            Shop The Sale
          </Link>
        </div>
      </motion.section>

      {/* Trending Now */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="py-20 bg-white border-b border-zinc-200"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10 border-b border-zinc-200 pb-4">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-[#1A1A1A] uppercase tracking-tighter mb-2">Trending Now</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Our most popular custom prints.</p>
            </div>
            <Link to="/category/t-shirts" className="hidden sm:inline-flex items-center gap-2 text-[10px] font-bold text-[#1A1A1A] hover:text-[#E8821C] uppercase tracking-widest transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {trendingProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* How Custom Printing Works */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="py-24 bg-zinc-50 border-b border-zinc-200"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-[#1A1A1A] uppercase tracking-tighter mb-4">
              How It Works
            </h2>
            <p className="text-[#1A1A1A]/70 text-sm font-bold uppercase tracking-widest max-w-2xl mx-auto">
              Your custom merch in three simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-[60px] left-1/6 right-1/6 h-[2px] bg-zinc-200 z-0" />
            
            <div className="relative z-10 flex flex-col items-center text-center bg-white p-8 border border-zinc-200 shadow-sm">
              <div className="w-20 h-20 bg-[#1A1A1A] text-white flex items-center justify-center rounded-full mb-6 border-4 border-zinc-50">
                <UploadCloud size={32} />
              </div>
              <h3 className="text-xl font-black text-[#1A1A1A] uppercase tracking-tighter mb-3">1. Upload Design</h3>
              <p className="text-sm font-medium leading-relaxed text-zinc-600">
                Choose your product and upload your artwork. Or use our free design templates to create something new.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center bg-white p-8 border border-zinc-200 shadow-sm">
              <div className="w-20 h-20 bg-[#E8821C] text-white flex items-center justify-center rounded-full mb-6 border-4 border-zinc-50">
                <Printer size={32} />
              </div>
              <h3 className="text-xl font-black text-[#1A1A1A] uppercase tracking-tighter mb-3">2. We Print It</h3>
              <p className="text-sm font-medium leading-relaxed text-zinc-600">
                Our experts use high-density DTG printing on premium heavyweight fabrics for vibrant, lasting colors.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center bg-white p-8 border border-zinc-200 shadow-sm">
              <div className="w-20 h-20 bg-[#1A1A1A] text-white flex items-center justify-center rounded-full mb-6 border-4 border-zinc-50">
                <Package size={32} />
              </div>
              <h3 className="text-xl font-black text-[#1A1A1A] uppercase tracking-tighter mb-3">3. Delivered</h3>
              <p className="text-sm font-medium leading-relaxed text-zinc-600">
                Your custom merch is carefully packaged and shipped fast. Track it straight to your doorstep.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              to="/custom-print" 
              className="bg-[#1A1A1A] hover:bg-[#E8821C] text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 inline-block"
            >
              Start Designing
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-black text-[#1A1A1A] text-center uppercase tracking-tighter mb-16">
            Community
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Rahul D.", quote: "The oversized fit is perfect. The fabric feels super premium and the print hasn't faded after 10 washes. Best streetwear brand right now.", rating: 5 },
              { name: "Sarah M.", quote: "Used their custom print service for my agency merch. Quality is insane. Will definitely order again.", rating: 5 },
              { name: "Vikram S.", quote: "Delivery was super fast. The acid wash tee looks exactly like the pictures. Very happy with the purchase.", rating: 4 }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-8 border border-zinc-200 shadow-sm">
                <div className="flex gap-1 text-[#E8821C] mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < testimonial.rating ? "currentColor" : "none"} className={i >= testimonial.rating ? "text-zinc-200" : ""} />
                  ))}
                </div>
                <p className="text-sm font-medium leading-relaxed text-zinc-600 mb-8">"{testimonial.quote}"</p>
                <div className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest border-t border-zinc-200 pt-4">{testimonial.name}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

    </div>
  );
}
