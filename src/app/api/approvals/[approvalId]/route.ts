import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ approvalId: string }> }) {
  try {
    const { approvalId } = await params;
    // Try as approval ID first, then as session_id
    let { data, error } = await supabase.from('approvals').select('*, agent_reports(*)').eq('id', approvalId).single();
    if (error || !data) {
      const res = await supabase.from('approvals').select('*, agent_reports(*)').eq('session_id', approvalId).order('created_at', {ascending: false}).limit(1).single();
      data = res.data; error = res.error;
    }
    if (error) return NextResponse.json({ approval: null });
    return NextResponse.json({ approval: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}