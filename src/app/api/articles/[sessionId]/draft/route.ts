import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const { sessionId } = await params;
    const { data, error } = await supabase.from('drafts').select('*').eq('session_id', sessionId).order('created_at', { ascending: false }).limit(1).single();
    if (error && error.code !== 'PGRST116') throw error;
    return NextResponse.json(data || {});
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const { sessionId } = await params;
    const body = await req.json();
    const { data: existing } = await supabase.from('drafts').select('id').eq('session_id', sessionId).single();
    let result;
    if (existing) {
      result = await supabase.from('drafts').update({ ...body, updated_at: new Date().toISOString() }).eq('id', existing.id).select().single();
    } else {
      result = await supabase.from('drafts').insert({ session_id: sessionId, ...body }).select().single();
    }
    if (result.error) throw result.error;
    return NextResponse.json(result.data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}