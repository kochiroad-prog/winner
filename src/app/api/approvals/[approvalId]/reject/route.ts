import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ approvalId: string }> }) {
  try {
    const { approvalId } = await params;
    const { rejected_reason } = await req.json();
    if (!rejected_reason?.trim()) return NextResponse.json({ error: 'Alasan wajib' }, { status: 400 });
    const { data, error } = await supabase.from('approvals').update({ status: 'rejected', rejected_reason }).eq('id', approvalId).select('*, session_id').single();
    if (error) throw error;
    await supabase.from('article_sessions').update({ status: 'rejected' }).eq('id', data.session_id);
    return NextResponse.json({ approval: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}