export type SessionStatus = 'pending' | 'processing' | 'review' | 'approved' | 'rejected' | 'published' | 'archived';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type AgentName = 'seo_analyzer' | 'content_writer' | 'content_optimizer' | 'link_builder' | 'publisher';
export type LinkStatus = 'valid' | 'invalid' | 'redirected' | 'pending';

export interface Profile {
  id: string; full_name?: string; whatsapp_number: string; whatsapp_opt_in?: boolean;
  created_at: string; updated_at: string;
}
export interface ArticleSession {
  id: string; user_id?: string; topic: string; status: SessionStatus;
  cycle_number: number; created_at: string; updated_at: string;
}
export interface Draft {
  id: string; session_id: string; title?: string; content?: string;
  meta_description?: string; keywords?: string[]; word_count?: number;
  seo_score?: number; created_at: string; updated_at: string;
}
export interface AgentReport {
  id: string; approval_id: string; agent_name: AgentName;
  confidence_score: number; reasoning?: string; suggestions?: string[]; created_at: string;
}
export interface Approval {
  id: string; session_id: string; status: ApprovalStatus;
  approval_notes?: string; rejected_reason?: string; approved_at?: string;
  created_at: string; updated_at: string; agent_reports?: AgentReport[];
}
export interface LinkData {
  id: string; url: string; title?: string; anchor_text?: string;
  status: LinkStatus; da_score?: number; is_broken?: boolean;
}
export interface LinkValidation {
  id: string; approval_id: string; internal_links: LinkData[];
  external_links: LinkData[]; overall_status: string; created_at: string; updated_at: string;
}
export interface Revision {
  id: string; session_id: string; agents_to_revise: AgentName[];
  user_feedback: string; cycle_number: number; created_at: string;
}
export interface WorkflowProgress {
  current_step: string; completed_steps: string[]; total_steps: number;
  agents: { name: AgentName; status: 'pending' | 'running' | 'done' | 'failed'; progress: number; }[];
}
export interface CreateSessionRequest { topic: string; }
export interface UpdateDraftRequest { title?: string; content?: string; meta_description?: string; keywords?: string[]; }
export interface ApproveRequest { approval_notes?: string; }
export interface RejectRequest { rejected_reason: string; }
export interface RequestRevisionRequest { agents_to_revise: AgentName[]; user_feedback: string; }
