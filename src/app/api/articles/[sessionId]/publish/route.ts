import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireUser } from '@/lib/require-user';

export async function POST(req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const { sessionId } = await params;
    const { user } = await requireUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Fetch the draft and session details
    const { data: sessionData, error: sessionError } = await supabase
      .from('article_sessions')
      .select('topic, status')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (sessionError) throw sessionError;
    if (sessionData.status !== 'ready') {
      return NextResponse.json({ error: 'Artikel belum dalam status Ready' }, { status: 400 });
    }

    const { data: draftData, error: draftError } = await supabase
      .from('drafts')
      .select('*')
      .eq('session_id', sessionId)
      .single();
    
    if (draftError) throw draftError;

    // Simulate WordPress Webhook
    const webhookUrl = process.env.WP_WEBHOOK_URL || 'https://example.com/wp-json/webhook';
    console.log(`[PUBLISH] Triggering WordPress webhook to ${webhookUrl} for session ${sessionId}...`);
    // Example payload
    const payload = {
      title: draftData.title,
      content: draftData.content,
      meta_description: draftData.meta_description,
      keywords: draftData.keywords,
      recommended_links: draftData.recommended_links, // Sent to WP
    };

    try {
      if (process.env.WP_WEBHOOK_URL) {
        const wpRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!wpRes.ok) throw new Error('WordPress Webhook failed: ' + wpRes.statusText);
      } else {
        // Mock delay if no webhook is provided
        await new Promise(res => setTimeout(res, 1000));
        console.log('[PUBLISH] Mock webhook success');
      }
    } catch (err: any) {
      console.error('[PUBLISH ERROR]', err.message);
      return NextResponse.json({ error: 'Gagal mengirim ke WordPress webhook' }, { status: 502 });
    }

    // Update status to published
    const { error: updateError } = await supabase
      .from('article_sessions')
      .update({ status: 'published', updated_at: new Date().toISOString() })
      .eq('id', sessionId);
    
    if (updateError) throw updateError;
    
    return NextResponse.json({ success: true, status: 'published' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
