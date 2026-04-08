import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const { sessionId } = await params;
    const { agents_to_revise, user_feedback } = await req.json();
    if (!agents_to_revise?.length) return NextResponse.json({ error: 'Pilih minimal 1 agent' }, { status: 400 });
    const { data: session } = await supabase.from('article_sessions').select('cycle_number').eq('id', sessionId).single();
    const cycle = (session?.cycle_number || 1) + 1;
    const { data, error } = await supabase.from('revisions').insert({ session_id: sessionId, agents_to_revise, user_feedback, cycle_number: cycle }).select().single();
    if (error) throw error;
    await supabase.from('article_sessions').update({ status: 'processing', cycle_number: cycle }).eq('id', sessionId);
    return NextResponse.json({ revision: data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const { sessionId } = await params;
    const { data, error } = await supabase.from('revisions').select('*').eq('session_id', sessionId).order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ revisions: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}