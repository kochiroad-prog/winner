import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireUser } from '@/lib/require-user';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const { sessionId } = await params;
    const { user } = await requireUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { error } = await supabase
      .from('article_sessions')
      .update({ status: 'ready', updated_at: new Date().toISOString() })
      .eq('id', sessionId)
      .eq('user_id', user.id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true, status: 'ready' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
