import axios from 'axios';
const api = axios.create({ baseURL: '', headers: { 'Content-Type': 'application/json' } });
export const articleAPI = {
  create: (topic: string) => api.post('/api/articles', { topic }).then(r => r.data),
  list: () => api.get('/api/articles').then(r => r.data),
  get: (id: string) => api.get(`/api/articles/${id}`).then(r => r.data),
  archive: (id: string) => api.delete(`/api/articles/${id}`).then(r => r.data),
  getDraft: (id: string) => api.get(`/api/articles/${id}/draft`).then(r => r.data),
  updateDraft: (id: string, data: any) => api.put(`/api/articles/${id}/draft`, data).then(r => r.data),
  getProgress: (id: string) => api.get(`/api/articles/${id}/progress`).then(r => r.data),
};
export const approvalAPI = {
  submit: (sessionId: string) => api.post('/api/approvals', { session_id: sessionId }).then(r => r.data),
  get: (approvalId: string) => api.get(`/api/approvals/${approvalId}`).then(r => r.data),
  approve: (approvalId: string, notes?: string) => api.put(`/api/approvals/${approvalId}/approve`, { approval_notes: notes }).then(r => r.data),
  reject: (approvalId: string, reason: string) => api.put(`/api/approvals/${approvalId}/reject`, { rejected_reason: reason }).then(r => r.data),
};
export const revisionAPI = {
  request: (sessionId: string, data: { agents_to_revise: string[]; user_feedback: string }) => api.post(`/api/revisions/${sessionId}`, data).then(r => r.data),
  getHistory: (sessionId: string) => api.get(`/api/revisions/${sessionId}`).then(r => r.data),
};
export const linkAPI = {
  get: (approvalId: string) => api.get(`/api/links/${approvalId}`).then(r => r.data),
  save: (approvalId: string, data: any) => api.put(`/api/links/${approvalId}`, data).then(r => r.data),
};
