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
          set({ isPrintifySyncing: true });
          const res = await fetch('/api/printify/products');
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.products) && data.products.length > 0) {
              set({ printifyProducts: data.products });
            }
          }
        } catch (err) {
          console.warn('[Printify Store] Sync error:', err);
        } finally {
          set({ isPrintifySyncing: false });
        }
      },
    }),
    {
      name: 'zavento-storage',
    }
  )
);
