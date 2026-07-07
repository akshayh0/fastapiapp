import { useState, useEffect } from "react";
import {
  embedJobs,
  semanticSearch,
  analyseResume,
  jobMatch,
} from "../Services/ragService";
import type {
  SemanticSearchResult,
  JobMatchResult,
} from "../types/rag";

type Props = {
  initialTab?: "search" | "resume" | "matcher" | "admin";
};

export default function RagHub({ initialTab }: Props) {
  const [activeSubTab, setActiveSubTab] = useState<"search" | "resume" | "matcher" | "admin">(
    initialTab || "search"
  );

  useEffect(() => {
    if (initialTab) {
      setActiveSubTab(initialTab);
    }
  }, [initialTab]);
  
  // Semantic Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SemanticSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Resume Analyzer State
  const [resumeText, setResumeText] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [resumeLoading, setResumeLoading] = useState(false);

  // Job Matcher State
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [matchResults, setMatchResults] = useState<JobMatchResult[]>([]);
  const [matchLoading, setMatchLoading] = useState(false);

  // Admin Embedder State
  const [embedLoading, setEmbedLoading] = useState(false);
  const [embedMessage, setEmbedMessage] = useState("");

  // Handlers
  const handleSemanticSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const res = await semanticSearch(searchQuery);
      setSearchResults(res.results);
    } catch (err) {
      console.error(err);
      alert("Semantic search failed to retrieve results.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAnalyseResume = async () => {
    if (!resumeText.trim()) return;
    setResumeLoading(true);
    setAnalysisResult("");
    try {
      const res = await analyseResume(resumeText);
      setAnalysisResult(res.analysis);
    } catch (err) {
      console.error(err);
      alert("Resume analysis failed.");
    } finally {
      setResumeLoading(false);
    }
  };

  const handleJobMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skills.trim() || !experience.trim()) return;
    setMatchLoading(true);
    try {
      const res = await jobMatch(skills, experience);
      setMatchResults(res.matches);
    } catch (err) {
      console.error(err);
      alert("Profile job matching failed.");
    } finally {
      setMatchLoading(false);
    }
  };

  const handleEmbedJobs = async () => {
    setEmbedLoading(true);
    setEmbedMessage("");
    try {
      const res = await embedJobs();
      setEmbedMessage(`${res.message} (Total: ${res.count} jobs)`);
    } catch (err) {
      console.error(err);
      setEmbedMessage("Failed to embed jobs. Please verify backend logs.");
    } finally {
      setEmbedLoading(false);
    }
  };

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-2xl animate-pulse space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-white/10 rounded w-1/4"></div>
            <div className="h-4 bg-white/10 rounded w-1/6"></div>
          </div>
          <div className="h-6 bg-white/10 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-white/10 rounded w-full"></div>
            <div className="h-3 bg-white/10 rounded w-5/6"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 text-left animate-fade-in-up">
      {/* Page Header */}
      {!initialTab && (
        <div className="flex flex-col gap-2">
          <h2 className="font-display-lg text-white text-2xl font-bold m-0" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            RAG Intelligence Center
          </h2>
          <p className="text-on-surface-variant text-sm">
            Execute cognitive job search pipelines, align resume matrices, and manage vector indices.
          </p>
        </div>
      )}

      {/* Navigation Pills */}
      {!initialTab && (
        <div className="flex flex-wrap gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5 w-fit">
          <button
            onClick={() => setActiveSubTab("search")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none flex items-center gap-2 ${
              activeSubTab === "search"
                ? "bg-primary text-on-primary shadow-md shadow-primary/20"
                : "text-on-surface-variant hover:text-white bg-transparent hover:bg-white/5"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">travel_explore</span>
            Semantic Search
          </button>
          <button
            onClick={() => setActiveSubTab("resume")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none flex items-center gap-2 ${
              activeSubTab === "resume"
                ? "bg-primary text-on-primary shadow-md shadow-primary/20"
                : "text-on-surface-variant hover:text-white bg-transparent hover:bg-white/5"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">description</span>
            Resume Analyzer
          </button>
          <button
            onClick={() => setActiveSubTab("matcher")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none flex items-center gap-2 ${
              activeSubTab === "matcher"
                ? "bg-primary text-on-primary shadow-md shadow-primary/20"
                : "text-on-surface-variant hover:text-white bg-transparent hover:bg-white/5"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">radar</span>
            Job Matcher
          </button>
          <button
            onClick={() => setActiveSubTab("admin")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none flex items-center gap-2 ${
              activeSubTab === "admin"
                ? "bg-primary text-on-primary shadow-md shadow-primary/20"
                : "text-on-surface-variant hover:text-white bg-transparent hover:bg-white/5"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">settings_input_component</span>
            Qdrant Sync
          </button>
        </div>
      )}

      {/* Content Panels */}
      <div className={initialTab ? "" : "antigravity-card p-6 min-h-[300px]"}>
        {/* SEMANTIC SEARCH PANEL */}
        {activeSubTab === "search" && (
          <div key="search" className="space-y-6 animate-fade-in-up">
            <form onSubmit={handleSemanticSearch} className="flex gap-3">
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="Describe your perfect job in plain English (e.g. Remote Python developer with FastAPI expertise)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={searchLoading}
                  className="modern-input w-full px-4 py-3 text-xs text-[#14171A] placeholder:text-[#767B82]/40"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#767B82] hover:text-[#14171A] bg-transparent border-none cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={searchLoading || !searchQuery.trim()}
                className="bg-[#3F5B44] text-white px-5 rounded font-bold text-sm flex items-center gap-2 border-none cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none"
              >
                {searchLoading ? (
                  <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">search</span>
                )}
                Search
              </button>
            </form>

            {/* Results */}
            {searchLoading ? (
              renderSkeleton()
            ) : searchResults.length > 0 ? (
              <div className="space-y-4 animate-fade-in-up">
                <div className="text-xs font-bold text-[#14171A] font-mono uppercase tracking-wider mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
                  Query Findings
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((job: any, idx: number) => {
                    const numStr = String(idx + 1).padStart(3, "0");
                    const staggerClass = `docket-stagger-${Math.min(5, idx + 1)}`;
                    return (
                      <div
                        key={job.id}
                        className={`bg-white border border-[#DDE0DA] rounded p-5 flex flex-col justify-between relative pt-8 ${staggerClass}`}
                      >
                        <div className="folder-tab">RECORD {numStr}</div>
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <h4 className="text-[#14171A] text-sm font-bold m-0 leading-tight">
                              {job.title}
                            </h4>
                            {job.salary && (
                              <span className="stamp-badge shrink-0">
                                ${Number(job.salary).toLocaleString()}
                              </span>
                            )}
                          </div>
                          <p className="text-[#767B82] text-xs mb-3 line-clamp-3 leading-relaxed">
                            {job.description}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 text-[10px] text-[#767B82] font-mono pt-2 border-t border-[#DDE0DA]">
                          <span className="bg-[#F4F5F2] px-2 py-0.5 rounded flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">location_on</span>
                            {job.location || "Remote"}
                          </span>
                          <span className="bg-[#F4F5F2] px-2 py-0.5 rounded flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">domain</span>
                            {job.company_name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : searchQuery && !searchLoading ? (
              <div className="text-center py-12 text-[#767B82] text-sm font-mono">
                [ NO DATA MATCHES LOCATED ]
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-[#767B82] text-xs bg-white border border-[#DDE0DA] rounded">
                <span className="material-symbols-outlined text-[36px] mb-2 opacity-60 text-[#3F5B44]">drafts</span>
                <p className="font-mono uppercase tracking-wider">[ Submit Query parameters to search indices ]</p>
              </div>
            )}
          </div>
        )}

        {/* RESUME ANALYZER PANEL */}
        {activeSubTab === "resume" && (
          <div key="resume" className="space-y-4 animate-fade-in-up">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[#14171A] font-mono uppercase tracking-wider">Paste Resume Plaintext</label>
              <textarea
                rows={8}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                disabled={resumeLoading}
                placeholder="Paste raw resume string..."
                className="modern-input w-full p-4 text-[#14171A] text-xs placeholder:text-[#767B82]/40 resize-none h-44"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleAnalyseResume}
                disabled={resumeLoading || !resumeText.trim()}
                className="bg-[#3F5B44] text-white px-5 py-2 rounded font-bold text-sm flex items-center gap-2 border-none cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none"
              >
                {resumeLoading ? (
                  <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                )}
                Analyze Resume
              </button>
            </div>

            {/* Analysis Output */}
            {resumeLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 border border-[#DDE0DA] bg-white rounded">
                <span className="material-symbols-outlined animate-spin text-[32px] text-[#3F5B44]">sync</span>
                <p className="text-[#767B82] text-xs font-mono animate-pulse uppercase tracking-wider">
                  [ Extracting matrix indices ... ]
                </p>
              </div>
            ) : analysisResult ? (
              <div className="border-t border-[#DDE0DA] pt-6 space-y-4 animate-fade-in-up">
                <div className="flex items-center gap-2 text-[#3F5B44] font-bold">
                  <span className="stamp-badge">REVIEW REPORT</span>
                </div>
                <div className="bg-white border border-[#DDE0DA] rounded p-5 text-[#14171A] text-xs leading-relaxed whitespace-pre-wrap text-left font-mono">
                  {analysisResult}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* JOB MATCHER PANEL */}
        {activeSubTab === "matcher" && (
          <div key="matcher" className="space-y-6 animate-fade-in-up">
            <form onSubmit={handleJobMatch} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#14171A] font-mono uppercase tracking-wider">
                  Skills Matrix
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Python, Docker, SQL"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  disabled={matchLoading}
                  className="modern-input w-full px-4 py-2.5 text-xs text-[#14171A] placeholder:text-[#767B82]/40"
                />
              </div>

              <div className="flex gap-3 items-end">
                <div className="flex flex-col gap-2 flex-grow">
                  <label className="text-xs font-bold text-[#14171A] font-mono uppercase tracking-wider">
                    Experience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3 years"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    disabled={matchLoading}
                    className="modern-input w-full px-4 py-2.5 text-xs text-[#14171A] placeholder:text-[#767B82]/40"
                  />
                </div>

                <button
                  type="submit"
                  disabled={matchLoading || !skills.trim() || !experience.trim()}
                  className="bg-[#3F5B44] text-white px-5 h-9 rounded font-bold text-sm flex items-center gap-2 border-none cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {matchLoading ? (
                    <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">radar</span>
                  )}
                  Match
                </button>
              </div>
            </form>

            {/* Match Results */}
            {matchLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white border border-[#DDE0DA] p-4 rounded animate-pulse flex justify-between items-center gap-6">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-[#F4F5F2] rounded w-1/3"></div>
                      <div className="h-3 bg-[#F4F5F2] rounded w-3/4"></div>
                    </div>
                    <div className="w-32 h-3 bg-[#F4F5F2] rounded"></div>
                  </div>
                ))}
              </div>
            ) : matchResults.length > 0 ? (
              <div className="space-y-4 animate-fade-in-up">
                <div className="text-xs font-bold text-[#14171A] font-mono uppercase tracking-wider mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
                  Matched Positions
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {matchResults.map((match, idx) => {
                    const matchPercent = Math.round(match.match_score * 100);
                    const numStr = String(idx + 1).padStart(3, "0");
                    const staggerClass = `docket-stagger-${Math.min(5, idx + 1)}`;
                    return (
                      <div
                        key={match.job_id || idx}
                        className={`bg-white border border-[#DDE0DA] rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 relative pt-8 ${staggerClass}`}
                      >
                        <div className="folder-tab">MATCH {numStr}</div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-[#14171A] text-sm font-bold m-0 truncate">
                              {match.title}
                            </h4>
                            {match.salary && (
                              <span className="stamp-badge shrink-0">
                                ${Number(match.salary).toLocaleString()}
                              </span>
                            )}
                          </div>
                          <p className="text-[#767B82] text-xs line-clamp-2 leading-relaxed m-0">
                            {match.description}
                          </p>
                        </div>

                        {/* Match Meter */}
                        <div className="flex items-center gap-3 md:w-44 flex-shrink-0">
                          <div className="w-full bg-[#DDE0DA] h-1.5 overflow-hidden">
                            <div
                              className="bg-[#3F5B44] h-full"
                              style={{ width: `${Math.min(100, Math.max(0, matchPercent))}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-bold text-[#14171A] font-mono w-12 text-right">
                            {matchPercent}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : skills && experience && !matchLoading ? (
              <div className="text-center py-12 text-[#767B82] text-sm font-mono">
                [ NO COMPATIBLE DOSSIERS FOUND ]
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-[#767B82] text-xs bg-white border border-[#DDE0DA] rounded">
                <span className="material-symbols-outlined text-[36px] mb-2 opacity-60 text-[#3F5B44]">radar</span>
                <p className="font-mono uppercase tracking-wider">[ Enter dossier parameters to trigger alignment scan ]</p>
              </div>
            )}
          </div>
        )}

        {/* INDEXER PANEL */}
        {activeSubTab === "admin" && (
          <div key="admin" className="max-w-md mx-auto text-center py-8 space-y-6 animate-fade-in-up">
            <div className="mx-auto w-fit">
              <span className="stamp-badge">QDRANT CLUSTER SYSTEM</span>
            </div>
            <div className="space-y-2">
              <h4 className="text-[#14171A] text-sm font-bold m-0 font-mono uppercase tracking-wider" style={{ fontFamily: "'Space Mono', monospace" }}>
                Vector Database Indexer
              </h4>
              <p className="text-[#767B82] text-xs leading-relaxed max-w-sm mx-auto font-mono uppercase">
                Embed job database rows from PostgreSQL to Qdrant vector cloud cluster.
              </p>
            </div>

            <button
              onClick={handleEmbedJobs}
              disabled={embedLoading}
              className="bg-[#3F5B44] text-white px-6 py-2 rounded font-bold text-xs inline-flex items-center gap-2 border-none cursor-pointer hover:opacity-90"
            >
              {embedLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                  Embedding Jobs...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                  Index & Sync Jobs
                </>
              )}
            </button>

            {embedMessage && (
              <div className={`p-4 rounded text-xs font-bold text-left border animate-fade-in-up font-mono ${
                embedMessage.includes("Failed") 
                  ? "bg-red-50 text-red-700 border-red-200" 
                  : "bg-green-50 text-[#3F5B44] border-green-200"
              }`}>
                {embedMessage}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

