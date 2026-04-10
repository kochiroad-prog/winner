import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function requireUser(req: NextRequest) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : '';
  if (!token) return { user: null, error: 'Unauthorized' };

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return { user: null, error: 'Unauthorized' };
  return { user: data.user, error: null };
}
