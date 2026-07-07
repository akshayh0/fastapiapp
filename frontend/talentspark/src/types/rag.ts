export interface ResumeRequest {
  resume_text: string;
}

export interface ResumeResponse {
  analysis: string;
}

export interface JobSearchRequest {
  query: string;
}

export interface SemanticSearchResult {
  job_id?: number;
  title: string;
  description: string;
  salary?: number | string | null;
  score: number;
}

export interface SemanticSearchResponse {
  results: SemanticSearchResult[];
}

export interface JobMatchRequest {
  skills: string;
  experience: string;
}

export interface JobMatchResult {
  job_id?: number;
  title: string;
  description: string;
  salary?: number | string | null;
  match_score: number;
}

export interface JobMatchResponse {
  matches: JobMatchResult[];
}

export interface RagSearchRequest {
  question: string;
}

export interface RagSearchResponse {
  answer: string;
}

export interface EmbedResponse {
  message: string;
  count: number;
}
