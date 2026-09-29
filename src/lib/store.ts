import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './data';

export type CartItem = {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
};

interface AppState {
  cart: CartItem[];
  wishlist: string[];
  printifyProducts: Product[];
  isPrintifySyncing: boolean;
  isPrintifyConfigured: boolean;
  printifyError: string | null;
  printifyShopTitle: string | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, color: string, size: string) => void;
  updateCartQuantity: (productId: string, color: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  setPrintifyProducts: (products: Product[]) => void;
  fetchPrintifyProducts: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      printifyProducts: [],
      isPrintifySyncing: false,
      isPrintifyConfigured: false,
      printifyError: null,
      printifyShopTitle: null,
      addToCart: (item) => set((state) => {
        const existingIndex = state.cart.findIndex(
          (c) => c.product.id === item.product.id &&
                 c.selectedColor === item.selectedColor &&
                 c.selectedSize === item.selectedSize
        );
        if (existingIndex > -1) {
          const newCart = [...state.cart];
          newCart[existingIndex].quantity += item.quantity;
          return { cart: newCart };
        }
        return { cart: [...state.cart, item] };
      }),
      removeFromCart: (productId, color, size) => set((state) => ({
        cart: state.cart.filter(
          (c) => !(c.product.id === productId && c.selectedColor === color && c.selectedSize === size)
        )
      })),
      updateCartQuantity: (productId, color, size, quantity) => set((state) => ({
        cart: state.cart.map((c) => {
          if (c.product.id === productId && c.selectedColor === color && c.selectedSize === size) {
            return { ...c, quantity };
          }
          return c;
        })
      })),
      clearCart: () => set({ cart: [] }),
      toggleWishlist: (productId) => set((state) => {
        if (state.wishlist.includes(productId)) {
          return { wishlist: state.wishlist.filter(id => id !== productId) };
        }
        return { wishlist: [...state.wishlist, productId] };
      }),
      isInWishlist: (productId) => get().wishlist.includes(productId),
      setPrintifyProducts: (products) => set({ printifyProducts: products }),
      fetchPrintifyProducts: async () => {
        try {
          set({ isPrintifySyncing: true, printifyError: null });
          console.group('[Printify Integration] Fetching live products...');
          console.log('[Printify] Initiating live sync from /api/printify/products...');

          // Also check status in parallel for shop details & token verification
          fetch('/api/printify/status')
            .then(async (statusRes) => {
              if (statusRes.ok) {
                const statusData = await statusRes.json();
                console.log('[Printify Status Check]', statusData);
                if (statusData.configured) {
                  set({
                    isPrintifyConfigured: true,
                    printifyShopTitle: statusData.shopTitle || null,
                  });
                }
                if (statusData.error) {
                  console.error('[Printify Status Error]:', statusData.error, statusData.message);
                }
              } else {
                console.warn('[Printify Status] HTTP', statusRes.status, statusRes.statusText);
              }
            })
            .catch((err) => {
              console.warn('[Printify Status] Could not reach /api/printify/status:', err.message);
            });

          const res = await fetch('/api/printify/products');
          console.log(`[Printify API] Response HTTP status: ${res.status} ${res.statusText}`);

          const contentType = res.headers.get('content-type') || '';
          if (!contentType.includes('application/json')) {
            const rawBody = await res.text();
            const preview = rawBody.slice(0, 300);
            console.error('[Printify API Error] Expected JSON but received HTML/text. Endpoint returned:', preview);
            console.error('[Printify API Hint] If on Vercel, ensure api/ serverless functions and vercel.json rewrites are deployed.');
            set({
              printifyError: `Non-JSON response from server (${res.status}). Serverless function routing may be missing.`,
            });
            return;
          }

          const data = await res.json();
          console.log('[Printify API Data]:', data);

          if (data.configured !== undefined) {
            set({ isPrintifyConfigured: Boolean(data.configured) });
          }

          if (data.success && Array.isArray(data.products)) {
            console.log(`[Printify Success] Loaded ${data.products.length} live Printify products!`);
            set({
              printifyProducts: data.products,
              isPrintifyConfigured: true,
              printifyError: null,
            });
            if (data.products.length === 0) {
              console.warn('[Printify Warning] Shop connected successfully, but 0 products found. Ensure you have published products in your Printify store.');
            }
          } else {
            const errorMsg = data.message || data.error || 'Failed to sync products from Printify';
            console.error('[Printify Sync Failure]:', errorMsg, data);
            set({
              printifyError: errorMsg,
              isPrintifyConfigured: Boolean(data.configured),
            });
          }
        } catch (err: any) {
          console.error('[Printify Network Error]:', err.message);
          set({ printifyError: err.message });
        } finally {
          set({ isPrintifySyncing: false });
          console.groupEnd();
        }
      },
    }),
    {
      name: 'zavento-storage',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
      }),
    }
  )
);
