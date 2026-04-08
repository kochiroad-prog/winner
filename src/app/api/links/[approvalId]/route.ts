import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ approvalId: string }> }) {
  try {
    const { approvalId } = await params;
    const { data, error } = await supabase.from('link_validations').select('*').eq('approval_id', approvalId).single();
    if (error && error.code !== 'PGRST116') throw error;
    return NextResponse.json(data || { internal_links: [], external_links: [], overall_status: 'pending' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ approvalId: string }> }) {
  try {
    const { approvalId } = await params;
    const { internal_links, external_links } = await req.json();
    const { data: existing } = await supabase.from('link_validations').select('id').eq('approval_id', approvalId).single();
    let result;
    if (existing) {
      result = await supabase.from('link_validations').update({ internal_links, external_links, updated_at: new Date().toISOString() }).eq('id', existing.id).select().single();
    } else {
      result = await supabase.from('link_validations').insert({ approval_id: approvalId, internal_links, external_links }).select().single();
    }
    if (result.error) throw result.error;
    return NextResponse.json(result.data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}