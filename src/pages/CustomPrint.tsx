import React, { useState } from 'react';
import { Upload, Paintbrush, FileImage, Image as ImageIcon, CheckCircle, Info } from 'lucide-react';

export function CustomPrint() {
  const [activeTab, setActiveTab] = useState<'upload' | 'request'>('upload');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Path A State
  const [mockupProduct, setMockupProduct] = useState('tshirt');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [placement, setPlacement] = useState<'front' | 'back' | 'both'>('front');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    window.scrollTo(0, 0);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-light py-20 px-4 flex items-center justify-center">
        <div className="bg-white max-w-lg w-full p-10 rounded-2xl shadow-xl text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-display font-bold uppercase tracking-tighter mb-4 text-dark">Request Received</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            {activeTab === 'upload' 
              ? "Your custom order has been submitted successfully. We'll send you an order confirmation shortly." 
              : "Our design team has received your brief. We will get back to you with initial concepts within 24-48 hours."}
          </p>
          <button 
            onClick={() => { setIsSubmitted(false); setUploadedImage(null); }}
            className="bg-dark text-white px-8 py-4 text-sm font-bold uppercase tracking-wider rounded-md hover:bg-primary transition-colors"
          >
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light pb-20">
      {/* Header */}
      <div className="bg-dark text-white pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter mb-6">
            Design Your <span className="text-primary">Merch</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Bring your ideas to life with our premium blanks and high-density printing. Choose your path below.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        {/* Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <button 
            onClick={() => setActiveTab('upload')}
            className={`p-6 md:p-10 rounded-2xl border-2 transition-all text-left flex items-start gap-6 ${
              activeTab === 'upload' 
                ? 'bg-white border-primary shadow-xl shadow-primary/10' 
                : 'bg-white/80 border-transparent hover:bg-white hover:border-gray-200 shadow-sm'
            }`}
          >
            <div className={`p-4 rounded-full ${activeTab === 'upload' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}>
              <Upload size={32} />
            </div>
            <div>
              <h3 className={`text-xl font-display font-bold uppercase tracking-wider mb-2 ${activeTab === 'upload' ? 'text-dark' : 'text-gray-500'}`}>
                I Have My Own Design
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">Upload your artwork, see a live mockup, and place your order instantly.</p>
            </div>
          </button>

          <button 
            onClick={() => setActiveTab('request')}
            className={`p-6 md:p-10 rounded-2xl border-2 transition-all text-left flex items-start gap-6 ${
              activeTab === 'request' 
                ? 'bg-white border-primary shadow-xl shadow-primary/10' 
                : 'bg-white/80 border-transparent hover:bg-white hover:border-gray-200 shadow-sm'
            }`}
          >
            <div className={`p-4 rounded-full ${activeTab === 'request' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}>
              <Paintbrush size={32} />
            </div>
            <div>
              <h3 className={`text-xl font-display font-bold uppercase tracking-wider mb-2 ${activeTab === 'request' ? 'text-dark' : 'text-gray-500'}`}>
                Design It For Me
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">Share your idea with our in-house artists and we'll create something unique for you.</p>
            </div>
          </button>
        </div>

        {/* Path A Content */}
        {activeTab === 'upload' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              
              {/* Mockup Preview Area */}
              <div className="bg-gray-50 p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-200 relative min-h-[500px]">
                <div className="w-full max-w-sm relative">
                  {mockupProduct === 'tshirt' && (
                    <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80" alt="Blank T-Shirt" className="w-full rounded-xl shadow-md opacity-80" />
                  )}
                  {mockupProduct === 'cap' && (
                    <img src="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80" alt="Blank Cap" className="w-full rounded-xl shadow-md opacity-80" />
                  )}
                  {mockupProduct === 'mug' && (
                    <img src="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80" alt="Blank Mug" className="w-full rounded-xl shadow-md opacity-80" />
                  )}
                  
                  {/* Uploaded Image Overlay */}
                  {uploadedImage ? (
                    <div className={`absolute border-2 border-dashed border-primary/50 flex items-center justify-center ${
                      mockupProduct === 'tshirt' ? 'top-[30%] left-[30%] w-[40%] h-[40%]' :
                      mockupProduct === 'cap' ? 'top-[40%] left-[35%] w-[30%] h-[30%]' :
                      'top-[35%] left-[25%] w-[50%] h-[40%]'
                    }`}>
                      <img src={uploadedImage} alt="Design Preview" className="max-w-full max-h-full object-contain drop-shadow-lg" />
                    </div>
                  ) : (
                    <div className={`absolute flex items-center justify-center ${
                      mockupProduct === 'tshirt' ? 'top-[30%] left-[30%] w-[40%] h-[40%]' :
                      mockupProduct === 'cap' ? 'top-[40%] left-[35%] w-[30%] h-[30%]' :
                      'top-[35%] left-[25%] w-[50%] h-[40%]'
                    }`}>
                      <div className="text-center text-gray-400">
                        <ImageIcon size={40} className="mx-auto mb-2 opacity-50" />
                        <span className="text-xs uppercase font-bold tracking-wider opacity-70">Print Area</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="absolute top-4 left-4 flex bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden text-sm font-semibold uppercase tracking-wider">
                  <button onClick={() => setPlacement('front')} className={`px-4 py-2 ${placement === 'front' ? 'bg-dark text-white' : 'text-gray-500 hover:bg-gray-50'}`}>Front</button>
                  {mockupProduct === 'tshirt' && (
                    <button onClick={() => setPlacement('back')} className={`px-4 py-2 ${placement === 'back' ? 'bg-dark text-white' : 'text-gray-500 hover:bg-gray-50'}`}>Back</button>
                  )}
                </div>
              </div>

              {/* Form Area */}
              <div className="p-8 lg:p-10">
                <form onSubmit={handleFormSubmit}>
                  
                  <div className="mb-8">
                    <label className="block text-sm font-bold uppercase tracking-wider text-dark mb-4">1. Choose Product</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['tshirt', 'cap', 'mug'].map((prod) => (
                        <button
                          key={prod}
                          type="button"
                          onClick={() => { setMockupProduct(prod); setPlacement('front'); }}
                          className={`py-3 text-sm font-bold uppercase tracking-wider rounded-md border transition-all ${
                            mockupProduct === prod ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          {prod}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-bold uppercase tracking-wider text-dark mb-4">2. Upload Artwork</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors bg-gray-50 cursor-pointer relative group">
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg, application/pdf" 
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        required={!uploadedImage}
                      />
                      <FileImage size={32} className="mx-auto text-gray-400 mb-4 group-hover:text-primary transition-colors" />
                      <p className="text-sm font-semibold text-dark mb-1">Click to upload or drag & drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF (High Resolution recommended)</p>
                      {uploadedImage && (
                        <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full uppercase tracking-wider">
                          <CheckCircle size={14} /> Artwork Attached
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-bold uppercase tracking-wider text-dark mb-4">3. Order Details</label>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <select className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-primary focus:outline-none" required>
                          <option value="">Select Color</option>
                          <option value="black">Black</option>
                          <option value="white">White</option>
                          <option value="gray">Heather Gray</option>
                        </select>
                      </div>
                      <div>
                        <select className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-primary focus:outline-none" required>
                          <option value="">Select Size</option>
                          {mockupProduct === 'tshirt' ? (
                            <>
                              <option value="S">Small (S)</option>
                              <option value="M">Medium (M)</option>
                              <option value="L">Large (L)</option>
                              <option value="XL">X-Large (XL)</option>
                            </>
                          ) : (
                            <option value="OS">One Size</option>
                          )}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="number" min="1" placeholder="Quantity" className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-primary focus:outline-none" required />
                      <input type="email" placeholder="Contact Email" className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-primary focus:outline-none" required />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-dark hover:bg-primary text-white py-4 font-bold uppercase tracking-wider rounded-md transition-colors text-sm">
                    Submit Custom Order
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                    <Info size={14} /> We will review your artwork before printing.
                  </p>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* Path B Content */}
        {activeTab === 'request' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
            <h2 className="text-2xl font-display font-bold uppercase tracking-tighter mb-8 text-dark text-center border-b border-gray-100 pb-6">
              Tell us what you're looking for
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Full Name</label>
                  <input type="text" className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-primary focus:outline-none bg-gray-50" required />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Email Address</label>
                  <input type="email" className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-primary focus:outline-none bg-gray-50" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Target Product</label>
                <select className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-primary focus:outline-none bg-gray-50" required>
                  <option value="">Select a product...</option>
                  <option value="tshirt">T-Shirt Collection</option>
                  <option value="caps">Headwear / Caps</option>
                  <option value="mugs">Mugs & Drinkware</option>
                  <option value="other">Other / Not sure yet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Style Preference</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Minimalist', 'Typography', 'Illustration', 'Abstract'].map(style => (
                    <label key={style} className="cursor-pointer">
                      <input type="radio" name="style" className="peer sr-only" required />
                      <div className="border border-gray-200 rounded-md p-3 text-center text-sm font-semibold text-gray-500 peer-checked:border-primary peer-checked:text-primary peer-checked:bg-primary/5 hover:bg-gray-50 transition-colors">
                        {style}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Describe Your Idea</label>
                <textarea 
                  rows={4} 
                  placeholder="Tell us about the vibe, the message, colors, or any specific elements you want included..."
                  className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-primary focus:outline-none bg-gray-50 resize-none"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Reference Images (Optional)</label>
                <div className="border border-dashed border-gray-300 rounded-md p-4 text-center hover:border-primary transition-colors bg-gray-50 cursor-pointer">
                  <input type="file" className="hidden" id="ref-upload" multiple />
                  <label htmlFor="ref-upload" className="cursor-pointer text-sm text-gray-500 font-semibold flex items-center justify-center gap-2">
                    <Upload size={16} /> Click to attach inspiration images
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white py-4 font-bold uppercase tracking-wider rounded-md transition-colors text-sm shadow-lg shadow-primary/20">
                  Submit Design Request
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
