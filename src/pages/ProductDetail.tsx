import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Undo2, ChevronDown, Heart, Info, Minus, Plus } from 'lucide-react';
import { MOCK_PRODUCTS, combineProducts } from '../lib/data';
import { useAppStore } from '../lib/store';

export function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { printifyProducts, addToCart, toggleWishlist, isInWishlist } = useAppStore();
  const allProducts = useMemo(() => combineProducts(printifyProducts), [printifyProducts]);
  const product = allProducts.find(p => p.id === productId);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('details');
  const [showSizeModal, setShowSizeModal] = useState(false);

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }
    
    addToCart({
      product,
      quantity,
      selectedColor,
      selectedSize
    });
    
    navigate('/cart');
  };

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  }, [product, allProducts]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold uppercase tracking-tighter mb-4">Product Not Found</h2>
          <Link to="/" className="text-primary hover:underline font-semibold uppercase tracking-wider">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to={`/category/${product.category.toLowerCase().replace(' & ', '-')}`} className="hover:text-primary transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-dark truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          
          {/* Images */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible w-full md:w-24 flex-shrink-0 hide-scrollbar">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-[3/4] w-20 md:w-full overflow-hidden rounded-md border-2 transition-all flex-shrink-0 ${
                    selectedImage === idx ? 'border-primary' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            
            {/* Main Image with Zoom effect */}
            <div className="relative aspect-[3/4] w-full bg-gray-100 rounded-xl overflow-hidden group">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-zoom-in"
              />
              <button 
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-full text-dark hover:text-primary hover:bg-white transition-all shadow-md z-10"
              >
                <Heart size={20} className={isWishlisted ? 'fill-primary text-primary' : ''} />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">{product.category}</div>
            <h1 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tighter text-dark mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-dark">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i >= Math.floor(product.rating) ? "text-gray-300" : ""} />
                  ))}
                </div>
                <span className="text-sm text-gray-500 underline cursor-pointer">{product.reviews} reviews</span>
              </div>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Colors */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">
                Color: <span className="text-gray-500 normal-case">{selectedColor}</span>
              </h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-10 h-10 rounded-full border-2 transition-all shadow-sm flex items-center justify-center ${
                      selectedColor === color.name ? 'border-primary' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <span 
                      className="w-8 h-8 rounded-full border border-gray-200 block"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider">Size</h3>
                <button onClick={() => setShowSizeModal(true)} className="text-xs font-semibold text-gray-500 underline flex items-center gap-1 hover:text-primary transition-colors">
                  <Info size={14} /> Size Chart
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-sm font-bold uppercase tracking-wider rounded-md border transition-all ${
                      selectedSize === size 
                        ? 'bg-dark text-white border-dark' 
                        : 'bg-white text-dark border-gray-200 hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mb-10">
              <div className="flex gap-4">
                <div className="flex items-center border border-gray-300 rounded-md bg-white">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-4 text-gray-500 hover:text-dark transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-bold text-dark">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-4 text-gray-500 hover:text-dark transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-white hover:bg-gray-50 text-dark border-2 border-dark font-bold uppercase tracking-wider rounded-md transition-colors"
                >
                  Add To Cart
                </button>
              </div>
              <button 
                onClick={() => {
                  handleAddToCart();
                  if (selectedSize) navigate('/checkout');
                }}
                className="w-full bg-primary hover:bg-primary-dark text-white py-4 font-bold uppercase tracking-wider rounded-md transition-colors shadow-lg shadow-primary/20"
              >
                Buy It Now
              </button>
            </div>

            {/* Pincode Checker */}
            <div className="mb-10 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                Check Delivery Options
              </h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter Pincode / Zip Code" 
                  className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:border-primary focus:outline-none"
                  maxLength={6}
                />
                <button className="bg-dark text-white px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-md hover:bg-primary transition-colors">
                  Check
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mb-10 bg-white p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-primary flex-shrink-0" size={20} />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">100% Authentic</span>
              </div>
              <div className="flex items-center gap-3">
                <Undo2 className="text-primary flex-shrink-0" size={20} />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">14-Day Returns</span>
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-gray-200">
              {[
                { id: 'details', title: 'Product Details', content: (
                  <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
                    {product.details.fabric && <li><span className="font-semibold text-dark">Fabric:</span> {product.details.fabric}</li>}
                    {product.details.fit && <li><span className="font-semibold text-dark">Fit:</span> {product.details.fit}</li>}
                    {product.details.print && <li><span className="font-semibold text-dark">Print:</span> {product.details.print}</li>}
                  </ul>
                )},
                { id: 'shipping', title: 'Shipping & Returns', content: (
                  <p className="text-sm text-gray-600 leading-relaxed">Free standard shipping on orders over $75. Delivery takes 3-5 business days. Returns accepted within 14 days of receiving your order, items must be unworn and unwashed.</p>
                )},
                { id: 'care', title: 'Care Instructions', content: (
                  <p className="text-sm text-gray-600 leading-relaxed">Machine wash cold with like colors. Tumble dry low or hang dry. Do not iron directly on print. Do not bleach.</p>
                )}
              ].map((section) => (
                <div key={section.id} className="border-b border-gray-200">
                  <button 
                    onClick={() => setActiveAccordion(activeAccordion === section.id ? null : section.id)}
                    className="w-full flex justify-between items-center py-4 text-left font-bold uppercase tracking-wider text-sm hover:text-primary transition-colors"
                  >
                    {section.title}
                    <ChevronDown size={18} className={`transition-transform duration-300 ${activeAccordion === section.id ? 'rotate-180 text-primary' : 'text-gray-400'}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${activeAccordion === section.id ? 'max-h-96 pb-4' : 'max-h-0'}`}>
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* Size Chart Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 relative">
            <button 
              onClick={() => setShowSizeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-dark"
            >
              Close
            </button>
            <h3 className="text-2xl font-display font-bold uppercase tracking-tighter mb-6">Size Guide (Inches)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-100 uppercase tracking-wider text-xs">
                    <th className="p-3">Size</th>
                    <th className="p-3">Chest</th>
                    <th className="p-3">Length</th>
                    <th className="p-3">Sleeve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3 font-bold">S</td><td className="p-3">38-40</td><td className="p-3">28</td><td className="p-3">8.5</td></tr>
                  <tr><td className="p-3 font-bold">M</td><td className="p-3">40-42</td><td className="p-3">29</td><td className="p-3">9</td></tr>
                  <tr><td className="p-3 font-bold">L</td><td className="p-3">42-44</td><td className="p-3">30</td><td className="p-3">9.5</td></tr>
                  <tr><td className="p-3 font-bold">XL</td><td className="p-3">44-46</td><td className="p-3">31</td><td className="p-3">10</td></tr>
                  <tr><td className="p-3 font-bold">XXL</td><td className="p-3">46-48</td><td className="p-3">32</td><td className="p-3">10.5</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
