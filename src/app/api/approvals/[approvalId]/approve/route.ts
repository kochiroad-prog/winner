import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ approvalId: string }> }) {
  try {
    const { approvalId } = await params;
    const { approval_notes } = await req.json();
    const { data, error } = await supabase.from('approvals').update({ status: 'approved', approval_notes, approved_at: new Date().toISOString() }).eq('id', approvalId).select('*, session_id').single();
    if (error) throw error;
    await supabase.from('article_sessions').update({ status: 'approved' }).eq('id', data.session_id);
    return NextResponse.json({ approval: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}