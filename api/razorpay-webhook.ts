import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_utils/supabase';
import * as crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (webhookSecret) {
    const signature = req.headers['x-razorpay-signature'] as string;
    const rawBody = JSON.stringify(req.body);
    const expectedSig = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
    if (signature !== expectedSig) return res.status(400).json({ error: 'Invalid signature' });
  }

  try {
    const payload = req.body;
    const eventName = payload.event;

    if (eventName === 'payment.captured' || eventName === 'order.paid') {
      const entity = payload.payload.payment?.entity || payload.payload.order?.entity;
      const notes = entity?.notes || {};
      const { userId, tierId, isYearly } = notes;

      if (!userId) return res.status(200).json({ message: 'Ignored - no userId' });

      const { error } = await supabase.from('subscriptions').upsert({
        id: userId,
        user_id: userId,
        tier_id: tierId,
        is_yearly: isYearly === 'true',
        status: 'active',
        updated_at: new Date().toISOString(),
      });

      if (error) console.error('DB error:', error);
    }

    return res.status(200).json({ status: 'ok' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
