'use client';
import useSWR from 'swr';
const fetcher = (url: string) => fetch(url).then(r => r.json());
export function useArticleSession(sessionId?: string) {
  const { data: session, mutate: mutateSession, isLoading: sessionLoading } = useSWR(
    sessionId ? `/api/articles/${sessionId}` : null, fetcher, { refreshInterval: 5000 });
  const { data: draft } = useSWR(
    sessionId ? `/api/articles/${sessionId}/draft` : null,
    fetcher,
    { refreshInterval: 5000 }
  );
  const { data: progress } = useSWR(sessionId ? `/api/articles/${sessionId}/progress` : null, fetcher, { refreshInterval: 3000 });
  return { session, draft, progress, mutateSession, loading: sessionLoading };
}
export function useArticleSessions() {
  const { data, mutate, isLoading } = useSWR('/api/articles', fetcher, { refreshInterval: 30000 });
  return { sessions: data?.sessions || [], mutate, isLoading };
}
