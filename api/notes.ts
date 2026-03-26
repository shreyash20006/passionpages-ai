import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateUser } from './_utils/auth';
import { supabase } from './_utils/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = await authenticateUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('saved_notes').select('*')
        .eq('user_email', user.email)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, data: noteData } = req.body;
      const { data, error } = await supabase.from('saved_notes')
        .insert([{ user_email: user.email, title, data: noteData, created_at: new Date().toISOString() }])
        .select().single();
      if (error) throw error;
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing ID' });
      const { error } = await supabase.from('saved_notes').delete()
        .eq('id', id).eq('user_email', user.email);
      if (error) throw error;
      return res.status(200).json({ status: 'success' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
