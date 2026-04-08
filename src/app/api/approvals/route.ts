import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { session_id } = await req.json();
    if (!session_id) return NextResponse.json({ error: 'session_id wajib' }, { status: 400 });
    const { data, error } = await supabase.from('approvals').insert({ session_id, status: 'pending' }).select().single();
    if (error) throw error;
    // Simulate agent reports
    const agents = ['seo_analyzer','content_writer','content_optimizer','link_builder','publisher'];
    for (const agent of agents) {
      await supabase.from('agent_reports').insert({ approval_id: data.id, agent_name: agent, confidence_score: Math.floor(Math.random()*25+70), reasoning: `${agent} analysis complete`, suggestions: [] });
    }
    await supabase.from('article_sessions').update({ status: 'review' }).eq('id', session_id);
    const { data: withReports } = await supabase.from('approvals').select('*, agent_reports(*)').eq('id', data.id).single();
    return NextResponse.json({ approval: withReports }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('session_id');
    const query = supabase.from('approvals').select('*, agent_reports(*)').order('created_at', { ascending: false });
    if (sessionId) query.eq('session_id', sessionId);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ approvals: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}