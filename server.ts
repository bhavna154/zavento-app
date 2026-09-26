import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  getPrintifyToken,
  fetchShops,
  fetchShopProducts,
  forwardOrderToPrintify,
  getActiveShopId,
  PrintifyNormalizedProduct,
} from './server/printify';

// In-memory cache for synced Printify products
let cachedPrintifyProducts: PrintifyNormalizedProduct[] = [];
let lastSyncTime: number | null = null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Printify connection status
  app.get('/api/printify/status', async (req, res) => {
    const token = getPrintifyToken();
    if (!token) {
      return res.json({
        configured: false,
        message: 'PRINTIFY_API_TOKEN is not set in environment variables.',
        cachedProductCount: cachedPrintifyProducts.length,
        lastSyncTime,
      });
    }

    try {
      const shops = await fetchShops();
      const activeShopId = await getActiveShopId();
      const activeShop = shops.find((s) => String(s.id) === activeShopId) || shops[0];

      return res.json({
        configured: true,
        activeShopId,
        shopTitle: activeShop?.title || 'Printify Shop',
        shopsCount: shops.length,
        cachedProductCount: cachedPrintifyProducts.length,
        lastSyncTime,
      });
    } catch (err: any) {
      return res.status(200).json({
        configured: true,
        connected: false,
        error: err.message,
        message: 'Token present, but could not authenticate with Printify. Please verify token permissions.',
        cachedProductCount: cachedPrintifyProducts.length,
        lastSyncTime,
      });
    }
  });

  // Get products synced from Printify
  app.get('/api/printify/products', async (req, res) => {
    try {
      const token = getPrintifyToken();
      if (!token) {
        return res.json({
          success: true,
          products: cachedPrintifyProducts,
          source: 'cache',
          synced: false,
          message: 'PRINTIFY_API_TOKEN is not set. Showing catalog.',
        });
      }

      // If cache is empty or older than 5 minutes, auto-sync
      const fiveMinutes = 5 * 60 * 1000;
      if (cachedPrintifyProducts.length === 0 || !lastSyncTime || (Date.now() - lastSyncTime > fiveMinutes)) {
        try {
          const result = await fetchShopProducts();
          cachedPrintifyProducts = result.products;
          lastSyncTime = Date.now();
        } catch (fetchErr: any) {
          console.warn('[Printify] Auto-fetch failed:', fetchErr.message);
        }
      }

      res.json({
        success: true,
        products: cachedPrintifyProducts,
        count: cachedPrintifyProducts.length,
        lastSyncTime,
        source: 'printify',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        products: cachedPrintifyProducts,
      });
    }
  });

  // Trigger manual sync of products from Printify
  app.post('/api/printify/sync', async (req, res) => {
    try {
      const token = getPrintifyToken();
      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'PRINTIFY_API_TOKEN is missing. Please add it to your environment variables to sync with Printify.',
        });
      }

      const result = await fetchShopProducts();
      cachedPrintifyProducts = result.products;
      lastSyncTime = Date.now();

      res.json({
        success: true,
        message: `Successfully synced ${result.products.length} products from Printify shop ${result.shopId}.`,
        products: result.products,
        count: result.products.length,
        lastSyncTime,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: `Failed to sync products from Printify: ${error.message}`,
      });
    }
  });

  // Forward an order to Printify
  app.post('/api/printify/orders', async (req, res) => {
    try {
      const { orderId, customer, items, total } = req.body;

      if (!customer || !items || !Array.isArray(items)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid order payload. Customer details and items array are required.',
        });
      }

      const result = await forwardOrderToPrintify({
        orderId: orderId || `ZVN-${Math.floor(10000 + Math.random() * 90000)}`,
        customer,
        items,
        total: Number(total) || 0,
      });

      res.json(result);
    } catch (error: any) {
      console.error('[Server] Order forward error:', error);
      res.status(500).json({
        success: false,
        message: `Internal server error while forwarding order to Printify: ${error.message}`,
      });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
