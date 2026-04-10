import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireUser } from '@/lib/require-user';

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
      .from('article_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ sessions: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { topic } = await req.json();
    if (!topic?.trim()) return NextResponse.json({ error: 'Topic wajib diisi' }, { status: 400 });
    const normalizedTopic = topic.trim();
    const { data, error } = await supabase.from('article_sessions').insert({
      topic: normalizedTopic,
      status: 'pending',
      cycle_number: 1,
      user_id: user.id,
    }).select().single();
    if (error) throw error;
    await supabase.from('drafts').insert({
      session_id: data.id,
      title: `Draft: ${normalizedTopic}`,
      content: '',
      keywords: []
    });

    // Workflow automation should be started by a Supabase trigger or Edge Function
    // so n8n only receives the session id.
    return NextResponse.json({ session: data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
