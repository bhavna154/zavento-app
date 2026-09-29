import { getPrintifyToken, fetchShops, getActiveShopId } from '../../server/printify';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = getPrintifyToken();
  if (!token) {
    return res.status(200).json({
      configured: false,
      message: 'PRINTIFY_API_TOKEN is not set in Vercel environment variables.',
      cachedProductCount: 0,
      lastSyncTime: null,
    });
  }

  try {
    const shops = await fetchShops();
    const activeShopId = await getActiveShopId();
    const activeShop = shops.find((s) => String(s.id) === activeShopId) || shops[0];

    return res.status(200).json({
      configured: true,
      connected: true,
      activeShopId,
      shopTitle: activeShop?.title || 'Printify Shop',
      shopsCount: shops.length,
    });
  } catch (err: any) {
    console.error('[Vercel API /printify/status] Authentication error:', err.message);
    return res.status(200).json({
      configured: true,
      connected: false,
      error: err.message,
      message: 'Token present in Vercel, but could not authenticate with Printify API. Please verify token permissions in Printify dashboard.',
    });
  }
}
