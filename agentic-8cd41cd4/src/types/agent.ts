export type AgentStage = "news" | "script" | "video" | "social";

export type AgentLogStatus = "pending" | "success" | "error" | "skipped";

export interface AgentLog {
  stage: AgentStage;
  status: AgentLogStatus;
  message: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

export interface NewsStory {
  title: string;
  link: string;
  snippet: string;
  published: string;
  source?: string;
}

export interface VideoArtifact {
  url: string;
  previewImage?: string;
  provider: string;
  status: "generated" | "placeholder";
  prompt: string;
}

export interface SocialPostResult {
  status: "posted" | "scheduled" | "skipped" | "failed";
  platform: string;
  externalPostId?: string;
  externalUrl?: string;
  message?: string;
}

export interface AgentResult {
  topic: string;
  summary: string;
  narrationScript: string;
  socialCaption: string;
  news: NewsStory[];
  video: VideoArtifact;
  social: SocialPostResult;
  logs: AgentLog[];
}

export interface AgentInput {
  topic: string;
  platform: "buffer" | "x" | "none";
}

export interface AgentSuccessResponse {
  success: true;
  result: AgentResult;
}

export interface AgentErrorResponse {
  success: false;
  error: string;
  logs: AgentLog[];
}

export type AgentResponse = AgentSuccessResponse | AgentErrorResponse;
