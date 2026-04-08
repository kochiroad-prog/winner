import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const { sessionId } = await params;
    const { data: session } = await supabase.from('article_sessions').select('status, cycle_number').eq('id', sessionId).single();
    const { data: approval } = await supabase.from('approvals').select('status').eq('session_id', sessionId).order('created_at', { ascending: false }).limit(1).single();
    const statusMap: Record<string, number> = { pending:0, processing:1, review:2, approved:4, published:5 };
    const currentStep = session?.status || 'pending';
    const stepNum = statusMap[currentStep] || 0;
    const allSteps = ['create','process','review','approve','publish'];
    const completedSteps = allSteps.slice(0, stepNum + 1);
    return NextResponse.json({ current_step: currentStep, completed_steps: completedSteps, total_steps: 5, approval });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}