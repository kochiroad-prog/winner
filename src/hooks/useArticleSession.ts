'use client';
import useSWR from 'swr';
import { getAccessToken } from '@/lib/auth-token';

const fetcher = (url: string) => {
  const token = getAccessToken();
  return fetch(url, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined).then(r => r.json());
};
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
