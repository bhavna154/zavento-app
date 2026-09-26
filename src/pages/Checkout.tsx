import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { openRazorpayCheckout, RAZORPAY_KEY_ID } from '../lib/razorpay';
import { forwardOrderToPrintify } from '../lib/printify';

export function Checkout() {
  const { cart, clearCart } = useAppStore();
  const navigate = useNavigate();
  const [isPlaced, setIsPlaced] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'card' | 'paypal'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<{ type: 'error' | 'info'; text: string } | null>(null);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string>('');
  const [printifyOrderInfo, setPrintifyOrderInfo] = useState<{
    status: string;
    message: string;
    printifyOrderId?: string;
  } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 75 ? 0 : 10;
  const total = subtotal + shipping;

  const processAndForwardOrder = async (payId?: string) => {
    const orderNum = `ZVN-${Math.floor(10000 + Math.random() * 90000)}`;
    setCreatedOrderNumber(orderNum);
    if (payId) setPaymentId(payId);
    setIsPlaced(true);

    try {
      const printifyRes = await forwardOrderToPrintify({
        orderId: orderNum,
        customer: {
          firstName: formData.firstName || 'Valued',
          lastName: formData.lastName || 'Customer',
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zip: formData.zip,
        },
        items: [...cart],
        total,
      });

      if (printifyRes) {
        setPrintifyOrderInfo({
          status: printifyRes.status,
          message: printifyRes.message,
          printifyOrderId: printifyRes.printifyOrderId,
        });
      }
    } catch (err) {
      console.warn('[Printify Forward] Handled gracefully:', err);
    } finally {
      clearCart();
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentMessage(null);

    if (paymentMethod === 'razorpay') {
      setIsProcessing(true);

      openRazorpayCheckout({
        amount: total,
        customer: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          contact: formData.phone,
          address: formData.address,
          city: formData.city,
          zip: formData.zip,
        },
        onSuccess: (response) => {
          setIsProcessing(false);
          processAndForwardOrder(response.razorpay_payment_id);
        },
        onDismiss: () => {
          setIsProcessing(false);
          setPaymentMessage({
            type: 'info',
            text: 'Payment was cancelled. You can try again whenever you are ready.',
          });
        },
        onError: (errMsg) => {
          setIsProcessing(false);
          setPaymentMessage({
            type: 'error',
            text: errMsg || 'Payment failed. Please try again or choose another payment method.',
          });
        },
      });
    } else {
      // Standard flow for existing non-Razorpay options
      processAndForwardOrder();
    }
  };

  if (isPlaced) {
    return (
      <div className="min-h-screen bg-light py-20 px-4 flex items-center justify-center">
        <div className="bg-white max-w-lg w-full p-10 rounded-2xl shadow-xl text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-display font-bold uppercase tracking-tighter mb-4 text-dark">Order Confirmed</h2>
          <p className="text-gray-500 mb-6 leading-relaxed">
            Thank you for your purchase! Your order #{createdOrderNumber || `ZVN-${Math.floor(10000 + Math.random() * 90000)}`} has been placed successfully. We'll email you a tracking link once it ships.
          </p>
          {paymentId && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-left text-xs space-y-1">
              <p className="font-semibold text-gray-700">Razorpay Payment Details:</p>
              <p className="text-gray-600">Payment ID: <span className="font-mono font-medium text-dark">{paymentId}</span></p>
              <p className="text-green-600 font-medium">Status: Paid successfully (UPI / Cards / NetBanking)</p>
            </div>
          )}
          {printifyOrderInfo && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200 text-left text-xs space-y-1">
              <p className="font-semibold text-gray-700">Printify Fulfillment:</p>
              <p className="text-gray-600">
                Status: <span className="font-medium text-green-600">
                  {printifyOrderInfo.status === 'submitted_to_printify' ? 'Forwarded to Printify Production' : 'Auto-Forwarded to Printify Fulfillment Queue'}
                </span>
              </p>
              {printifyOrderInfo.printifyOrderId && (
                <p className="text-gray-600">Printify Order ID: <span className="font-mono font-medium text-dark">{printifyOrderInfo.printifyOrderId}</span></p>
              )}
              <p className="text-gray-500 text-[11px]">{printifyOrderInfo.message}</p>
            </div>
          )}
          <Link 
            to="/" 
            className="inline-block bg-dark text-white px-8 py-4 text-sm font-bold uppercase tracking-wider rounded-md hover:bg-primary transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-light py-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <button onClick={() => navigate('/')} className="text-primary hover:underline font-semibold">Return Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tighter text-dark mb-10 border-b border-gray-200 pb-6">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Form */}
          <div>
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
              
              {/* Payment Alert / Message */}
              {paymentMessage && (
                <div
                  className={`p-4 rounded-lg flex items-start gap-3 border text-sm ${
                    paymentMessage.type === 'error'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p>{paymentMessage.text}</p>
                    {RAZORPAY_KEY_ID === 'rzp_test_placeholder_key_id' && (
                      <button
                        type="button"
                        onClick={() => {
                          processAndForwardOrder(`rzp_demo_${Date.now()}`);
                        }}
                        className="mt-2 text-xs underline font-semibold text-dark hover:text-primary block"
                      >
                        Click here to simulate successful payment in Demo mode
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Shipping Address */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-display font-bold uppercase tracking-wider text-dark mb-6 border-b border-gray-100 pb-4">Shipping Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">First Name</label>
                      <input 
                        type="text" 
                        name="firstName" 
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-primary focus:outline-none bg-gray-50" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Last Name</label>
                      <input 
                        type="text" 
                        name="lastName" 
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-primary focus:outline-none bg-gray-50" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Email</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-primary focus:outline-none bg-gray-50" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-primary focus:outline-none bg-gray-50" 
                        required 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Address</label>
                    <input 
                      type="text" 
                      name="address" 
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-primary focus:outline-none bg-gray-50" 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">City</label>
                      <input 
                        type="text" 
                        name="city" 
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-primary focus:outline-none bg-gray-50" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">ZIP Code</label>
                      <input 
                        type="text" 
                        name="zip" 
                        value={formData.zip}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-primary focus:outline-none bg-gray-50" 
                        required 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-display font-bold uppercase tracking-wider text-dark mb-6 border-b border-gray-100 pb-4">Payment Method</h2>
                
                <div className="space-y-3 mb-6">
                  {/* Razorpay Option */}
                  <label 
                    className={`flex items-center justify-between p-4 border rounded-md cursor-pointer transition-colors ${
                      paymentMethod === 'razorpay' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="payment" 
                        value="razorpay"
                        checked={paymentMethod === 'razorpay'} 
                        onChange={() => setPaymentMethod('razorpay')}
                        className="text-primary focus:ring-primary h-4 w-4" 
                      />
                      <div>
                        <span className="font-semibold text-sm text-dark block">Razorpay (UPI, Cards, NetBanking, International)</span>
                        <span className="text-xs text-gray-500 block">Instant checkout via UPI (GPay/PhonePe/Paytm), RuPay, Visa, Mastercard</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded">Fast</span>
                  </label>

                  {/* Manual Credit / Debit Card Option */}
                  <label 
                    className={`flex items-center gap-3 p-4 border rounded-md cursor-pointer transition-colors ${
                      paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      value="card"
                      checked={paymentMethod === 'card'} 
                      onChange={() => setPaymentMethod('card')}
                      className="text-primary focus:ring-primary h-4 w-4" 
                    />
                    <span className="font-semibold text-sm text-gray-700">Credit / Debit Card</span>
                  </label>

                  {/* PayPal Option */}
                  <label 
                    className={`flex items-center gap-3 p-4 border rounded-md cursor-pointer transition-colors ${
                      paymentMethod === 'paypal' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      value="paypal"
                      checked={paymentMethod === 'paypal'} 
                      onChange={() => setPaymentMethod('paypal')}
                      className="text-primary focus:ring-primary h-4 w-4" 
                    />
                    <span className="font-semibold text-sm text-gray-700">PayPal</span>
                  </label>
                </div>
                
                {/* Razorpay Information Box */}
                {paymentMethod === 'razorpay' && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600 space-y-1">
                    <p className="font-semibold text-dark">Secure Razorpay Gateway</p>
                    <p>When you click "Place Order", Razorpay's official checkout window will open. You can pay using Indian UPI apps (Google Pay, PhonePe, Paytm), Netbanking, Indian Cards, or International Visa & Mastercard.</p>
                  </div>
                )}

                {/* Card Fields (Only when manual Card option is chosen) */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Card Number</label>
                      <input type="text" placeholder="0000 0000 0000 0000" className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-primary focus:outline-none bg-gray-50" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Expiry Date</label>
                        <input type="text" placeholder="MM/YY" className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-primary focus:outline-none bg-gray-50" required />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">CVC</label>
                        <input type="text" placeholder="123" className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-primary focus:outline-none bg-gray-50" required />
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-display font-bold uppercase tracking-wider text-dark mb-6 border-b border-gray-100 pb-4">In Your Bag</h2>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-16 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 text-sm">
                      <h4 className="font-semibold text-dark line-clamp-1">{item.product.name}</h4>
                      <p className="text-gray-500 text-xs mt-1">{item.selectedColor} / {item.selectedSize}</p>
                      <p className="text-gray-500 text-xs mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-bold text-dark text-sm">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm mb-6 border-t border-gray-100 pt-6">
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
              </div>

              <div className="border-t border-gray-100 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-display font-bold text-dark uppercase tracking-wider">Total</span>
                  <span className="text-3xl font-display font-bold text-dark">${total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                type="submit" 
                form="checkout-form"
                disabled={isProcessing}
                className="w-full bg-primary hover:bg-primary-dark text-white py-4 font-bold uppercase tracking-wider rounded-md transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mb-4 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>Processing <Loader2 size={18} className="animate-spin" /></>
                ) : (
                  <>Place Order <ShieldCheck size={18} /></>
                )}
              </button>
              <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1">
                <ShieldCheck size={14} /> Secure Checkout
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
