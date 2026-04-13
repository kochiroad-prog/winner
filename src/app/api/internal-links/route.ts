import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireUser } from '@/lib/require-user';

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
      .from('internal_links')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return NextResponse.json({ links: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { url } = await req.json();
    if (!url?.trim()) return NextResponse.json({ error: 'URL wajib diisi' }, { status: 400 });

    const { data, error } = await supabase.from('internal_links').insert({
      url: url.trim(),
      user_id: user.id,
    }).select().single();
    
    if (error) throw error;
    
    return NextResponse.json({ link: data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
