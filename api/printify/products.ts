import { getPrintifyToken, fetchShopProducts } from '../../server/printify';

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const token = getPrintifyToken();
    if (!token) {
      console.warn('[Vercel API /printify/products] PRINTIFY_API_TOKEN is not configured in Vercel environment variables.');
      return res.status(200).json({
        success: false,
        configured: false,
        products: [],
        count: 0,
        message: 'PRINTIFY_API_TOKEN is not set in Vercel environment variables. Please add PRINTIFY_API_TOKEN in Vercel Project Settings > Environment Variables.',
      });
    }

    console.log('[Vercel API /printify/products] Token detected. Syncing live products from Printify...');
    const result = await fetchShopProducts();
    console.log(`[Vercel API /printify/products] Successfully fetched ${result.products.length} products from Printify shop ${result.shopId}.`);

    return res.status(200).json({
      success: true,
      configured: true,
      products: result.products,
      count: result.products.length,
      shopId: result.shopId,
      source: 'printify',
    });
  } catch (error: any) {
    console.error('[Vercel API /printify/products] Error fetching from Printify:', error.message);
    return res.status(200).json({
      success: false,
      configured: true,
      error: error.message,
      products: [],
      count: 0,
      message: `Failed to fetch products from Printify: ${error.message}`,
    });
  }
}
