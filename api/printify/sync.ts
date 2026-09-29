import { getPrintifyToken, fetchShopProducts } from '../../server/printify';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const token = getPrintifyToken();
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'PRINTIFY_API_TOKEN is missing. Please add it to your Vercel Environment Variables.',
      });
    }

    const result = await fetchShopProducts();
    return res.status(200).json({
      success: true,
      message: `Successfully synced ${result.products.length} products from Printify shop ${result.shopId}.`,
      products: result.products,
      count: result.products.length,
      lastSyncTime: Date.now(),
    });
  } catch (error: any) {
    console.error('[Vercel API /printify/sync] Sync error:', error.message);
    return res.status(500).json({
      success: false,
      message: `Failed to sync products from Printify: ${error.message}`,
    });
  }
}
