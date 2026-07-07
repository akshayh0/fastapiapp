import api from "./api";
import type {
  ResumeRequest,
  ResumeResponse,
  JobSearchRequest,
  SemanticSearchResponse,
  JobMatchRequest,
  JobMatchResponse,
  RagSearchRequest,
  RagSearchResponse,
  EmbedResponse,
} from "../types/rag";

export const embedJobs = async (): Promise<EmbedResponse> => {
  const response = await api.post<EmbedResponse>("/rag/embed-jobs");
  return response.data;
};

export const semanticSearch = async (
  query: string
): Promise<SemanticSearchResponse> => {
  const requestData: JobSearchRequest = { query };
  const response = await api.post<SemanticSearchResponse>("/rag/search", requestData);
  return response.data;
};

export const ragAsk = async (
  question: string
): Promise<RagSearchResponse> => {
  const requestData: RagSearchRequest = { question };
  const response = await api.post<RagSearchResponse>("/rag/ask", requestData);
  return response.data;
};

export const analyseResume = async (
  resumeText: string
): Promise<ResumeResponse> => {
  const requestData: ResumeRequest = { resume_text: resumeText };
  const response = await api.post<ResumeResponse>("/rag/analyse-resume", requestData);
  return response.data;
};

export const jobMatch = async (
  skills: string,
  experience: string
): Promise<JobMatchResponse> => {
  const requestData: JobMatchRequest = { skills, experience };
  const response = await api.post<JobMatchResponse>("/rag/job-match", requestData);
  return response.data;
};
