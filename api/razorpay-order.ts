import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateUser } from './_utils/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { tierId, isYearly } = req.body;

    let userId = 'guest';
    try {
      const user = await authenticateUser(req);
      if (user?.uid) userId = user.uid;
    } catch (_) {}

    let price = 0;
    if (tierId === 'pro') price = isYearly ? 799 : 99;
    if (tierId === 'college') price = isYearly ? 49 * 12 : 49;
    if (price === 0) return res.status(400).json({ error: 'Invalid plan selected' });

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) return res.status(500).json({ error: 'Razorpay keys not configured' });

    const base64Auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${base64Auth}` },
      body: JSON.stringify({
        amount: price * 100,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
        notes: { userId, tierId, isYearly: isYearly ? 'true' : 'false' },
      }),
    });

    if (!razorpayResponse.ok) {
      const err = await razorpayResponse.text();
      return res.status(razorpayResponse.status).json({ error: `Razorpay Error: ${err}` });
    }

    const orderData = await razorpayResponse.json();
    return res.status(200).json({ id: orderData.id, amount: orderData.amount, currency: orderData.currency, keyId });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
