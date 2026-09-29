import { forwardOrderToPrintify } from '../../server/printify';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { orderId, customer, items, total } = req.body || {};
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

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('[Vercel API /printify/orders] Order forward error:', error.message);
    return res.status(500).json({
      success: false,
      message: `Internal server error while forwarding order to Printify: ${error.message}`,
    });
  }
}
