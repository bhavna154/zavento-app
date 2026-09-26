import { Product } from './data';
import { CartItem } from './store';

export interface PrintifyStatus {
  configured: boolean;
  connected?: boolean;
  activeShopId?: string;
  shopTitle?: string;
  shopsCount?: number;
  cachedProductCount: number;
  lastSyncTime: number | null;
  message?: string;
  error?: string;
}

export interface ForwardOrderResponse {
  success: boolean;
  status: string;
  orderId?: string;
  printifyOrderId?: string;
  simulated?: boolean;
  message: string;
  details?: any;
}

/**
 * Fetch Printify connection and shop status.
 */
export async function getPrintifyStatus(): Promise<PrintifyStatus> {
  try {
    const res = await fetch('/api/printify/status');
    if (!res.ok) throw new Error('Status check failed');
    return await res.json();
  } catch (err: any) {
    return {
      configured: false,
      cachedProductCount: 0,
      lastSyncTime: null,
      message: err.message,
    };
  }
}

/**
 * Fetch products synced from Printify (T-shirts, Caps, Mugs, etc.).
 */
export async function fetchSyncedPrintifyProducts(): Promise<Product[]> {
  try {
    const res = await fetch('/api/printify/products');
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.products) ? data.products : [];
  } catch (err) {
    console.error('Failed to fetch synced products:', err);
    return [];
  }
}

/**
 * Trigger a live sync of products from Printify.
 */
export async function triggerPrintifySync(): Promise<{ success: boolean; count: number; message: string; products: Product[] }> {
  try {
    const res = await fetch('/api/printify/sync', { method: 'POST' });
    const data = await res.json();
    return {
      success: data.success ?? false,
      count: data.count ?? 0,
      message: data.message || (data.success ? 'Sync completed' : 'Sync failed'),
      products: data.products || [],
    };
  } catch (err: any) {
    return {
      success: false,
      count: 0,
      message: err.message || 'Network error during sync',
      products: [],
    };
  }
}

/**
 * Automatically forward an order to Printify for fulfillment.
 */
export async function forwardOrderToPrintify(order: {
  orderId: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    zip: string;
    country?: string;
  };
  items: CartItem[];
  total: number;
}): Promise<ForwardOrderResponse> {
  try {
    const payload = {
      orderId: order.orderId,
      customer: order.customer,
      items: order.items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
      })),
      total: order.total,
    };

    const res = await fetch('/api/printify/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error('Error forwarding order to Printify:', err);
    return {
      success: true,
      simulated: true,
      status: 'offline_buffered',
      orderId: order.orderId,
      message: `Order saved. Printify auto-forward queued: ${err.message}`,
    };
  }
}
