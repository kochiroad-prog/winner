import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase.from('article_sessions').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ sessions: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();
    if (!topic?.trim()) return NextResponse.json({ error: 'Topic wajib diisi' }, { status: 400 });
    const { data, error } = await supabase.from('article_sessions').insert({ topic: topic.trim(), status: 'pending', cycle_number: 1 }).select().single();
    if (error) throw error;
    // Create empty draft
    await supabase.from('drafts').insert({ session_id: data.id, title: `Draft: ${topic.trim()}`, content: '', keywords: [] });
    return NextResponse.json({ session: data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
