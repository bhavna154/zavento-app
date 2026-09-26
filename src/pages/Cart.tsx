import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAppStore } from '../lib/store';

export function Cart() {
  const { cart, updateCartQuantity, removeFromCart } = useAppStore();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 75 ? 0 : 10;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-light flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md w-full bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} />
          </div>
          <h2 className="text-2xl font-display font-bold uppercase tracking-tighter mb-4 text-dark">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 leading-relaxed text-sm">Looks like you haven't added anything to your cart yet.</p>
          <Link 
            to="/" 
            className="block w-full bg-dark text-white px-8 py-4 text-sm font-bold uppercase tracking-wider rounded-md hover:bg-primary transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tighter text-dark mb-10 border-b border-gray-200 pb-6">
          Your Cart <span className="text-gray-400">({cart.length})</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item, idx) => (
              <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${idx}`} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                
                <div className="w-24 h-32 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.id}`} className="block mb-1">
                    <h3 className="text-lg font-semibold text-dark hover:text-primary transition-colors truncate">{item.product.name}</h3>
                  </Link>
                  <div className="text-sm text-gray-500 mb-4 space-y-1">
                    <p>Color: <span className="font-medium text-dark">{item.selectedColor}</span></p>
                    <p>Size: <span className="font-medium text-dark">{item.selectedSize}</span></p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center border border-gray-200 rounded-md bg-gray-50 h-9">
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.selectedColor, item.selectedSize, Math.max(1, item.quantity - 1))}
                        className="px-3 text-gray-500 hover:text-dark transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-dark">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.selectedColor, item.selectedSize, item.quantity + 1)}
                        className="px-3 text-gray-500 hover:text-dark transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                      title="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="text-right sm:text-left self-end sm:self-center font-bold text-lg text-dark">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
                
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-display font-bold uppercase tracking-wider text-dark mb-6 border-b border-gray-100 pb-4">Order Summary</h2>
              
              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-dark">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="font-semibold text-green-600">Free</span>
                  ) : (
                    <span className="font-semibold text-dark">${shipping.toFixed(2)}</span>
                  )}
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-primary bg-primary/5 p-2 rounded">
                    Add ${(75 - subtotal).toFixed(2)} more to get free shipping!
                  </p>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-8">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-lg font-bold text-dark uppercase tracking-wider">Total</span>
                  <span className="text-2xl font-bold text-dark">${total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 text-right">Including taxes</p>
              </div>

              <div className="mb-6">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Promo Code" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                  <button className="bg-dark text-white px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-md hover:bg-gray-800 transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary hover:bg-primary-dark text-white py-4 font-bold uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
