import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import { SideNav } from "./components/SideNav";
import Chat from "./pages/chat";
import CompaniesJobs from "./pages/CompaniesJobs";
import RagHub from "./pages/RagHub";

import {
  getCompanies,
  updateCompany,
  deleteCompany,
  createCompany,
} from "./Services/CompanyService";

import {
  getJobs,
  updateJob,
  deleteJob,
  createJob,
} from "./Services/JobService";

import type { Company } from "./types/company";
import type { Job } from "./types/job";

import Login from "./pages/Login";
import ApproveUsers from "./pages/ApproveUsers";
import { getCurrentUser } from "./Services/AuthService";
import { getJobApplications, applyForJob, approveJobApplication } from "./Services/JobService";

interface Activity {
  id: string;
  text: string;
  time: string;
  icon: string;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [page, setPage] = useState<"login" | "register">("login");
  const [activeTab, setActiveTab] = useState<string>("workspace");
  const [workspaceMode, setWorkspaceMode] = useState<"chat" | "search" | "resume" | "matcher" | "admin">("chat");
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("theme");
    return saved === "light" ? "light" : "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      text: "AI Engine Online - Core initialized",
      time: "Just now",
      icon: "bolt",
    },
  ]);

  const logActivity = (text: string, icon: string) => {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setActivities((prev) => [
      { id: Date.now().toString(), text, time, icon },
      ...prev,
    ]);
  };

  const handleLogin = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    logActivity("User authenticated successfully", "verified_user");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setCurrentUser(null);
    setCompanies([]);
    setJobs([]);
    setApplications([]);
    logActivity("User signed out", "logout");
  };

  async function fetchData() {
    setLoading(true);
    try {
      const [companiesData, jobsData] = await Promise.all([
        getCompanies(),
        getJobs(),
      ]);
      setCompanies(companiesData);
      setJobs(jobsData);
      logActivity("Synchronized remote portfolio data", "sync");
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      getCurrentUser()
        .then((user) => {
          setCurrentUser(user);
          logActivity(`Logged in as ${user.name} (${user.role})`, "verified_user");
        })
        .catch((err) => {
          console.error("Failed to load user profile:", err);
          handleLogout();
        });
    } else {
      setCurrentUser(null);
    }
  }, [token]);

  useEffect(() => {
    if (token && currentUser) {
      fetchData();
      getJobApplications()
        .then((apps) => {
          setApplications(apps);
        })
        .catch((err) => console.error("Error fetching applications:", err));
    }
  }, [token, currentUser]);

  async function handleEdit(company: Company) {
    try {
      const updatedCompany = await updateCompany(company.id, company);
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === updatedCompany.id ? updatedCompany : c
        )
      );
      logActivity(`Updated company: ${company.name}`, "edit");
    } catch (error) {
      setError(error as Error);
    }
  }

  async function handleDelete(id: number) {
    try {
      const company = companies.find((c) => c.id === id);
      await deleteCompany(id);
      setCompanies((prev) => prev.filter((c) => c.id !== id));
      logActivity(`Deleted company: ${company?.name || id}`, "delete");
    } catch (error) {
      setError(error as Error);
    }
  }

  async function handleAdd(company: Company) {
    try {
      const newCompany = await createCompany(company);
      setCompanies((prev) => [...prev, newCompany]);
      logActivity(`Added company: ${company.name}`, "corporate_fare");
    } catch (error) {
      setError(error as Error);
    }
  }

  async function handleJobEdit(job: Job) {
    try {
      const updatedJob = await updateJob(job.id, job);
      setJobs((prev) =>
        prev.map((j) => (j.id === updatedJob.id ? updatedJob : j))
      );
      logActivity(`Updated job opening: ${job.title}`, "edit");
    } catch (error) {
      setError(error as Error);
    }
  }

  async function handleJobDelete(id: number) {
    try {
      const job = jobs.find((j) => j.id === id);
      await deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      logActivity(`Removed job opening: ${job?.title || id}`, "delete");
    } catch (error) {
      setError(error as Error);
    }
  }

  async function handleJobAdd(job: Job) {
    try {
      const newJob = await createJob(job);
      setJobs((prev) => [...prev, newJob]);
      logActivity(`Tracked job opening: ${job.title}`, "work");
    } catch (error) {
      setError(error as Error);
    }
  }

  async function handleApplyJob(jobId: number) {
    try {
      const newApp = await applyForJob(jobId);
      setApplications((prev) => [...prev, newApp]);
      logActivity(`Applied for job ID: ${jobId}`, "assignment_turned_in");
      alert("Successfully applied for the job!");
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Failed to apply.";
      alert(msg);
    }
  }

  async function handleApproveApplication(appId: number) {
    try {
      await approveJobApplication(appId);
      // Refresh applications list
      const apps = await getJobApplications();
      setApplications(apps);
      logActivity(`Approved job application ID: ${appId}`, "verified_user");
      alert("Application approved successfully!");
    } catch (error: any) {
      console.error("Approve application failed:", error);
      const msg = error.response?.data?.detail || "Failed to approve application.";
      alert(msg);
    }
  }


  if (!token) {
    return (
      <Login
        onLogin={handleLogin}
        initialRegister={page === "register"}
        onModeChange={(mode) => setPage(mode)}
      />
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#F4F5F2] flex items-center justify-center text-[#14171A] z-50">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined animate-spin text-[36px] text-[#3F5B44]">
            sync
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Synchronizing Case Records...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-[#F4F5F2] flex items-center justify-center text-[#14171A] z-50 px-6">
        <div className="antigravity-card p-8 rounded max-w-md text-left flex flex-col gap-4 border-[#DDE0DA] bg-white pt-10">
          <div className="folder-tab">CONNECTION INTERRUPTED</div>
          <div className="flex items-center gap-3 text-red-700">
            <span className="material-symbols-outlined text-[32px]">error</span>
            <h3 className="text-lg font-bold font-mono m-0 uppercase tracking-tight" style={{ fontFamily: "'Space Mono', monospace" }}>Secure Link Interrupted</h3>
          </div>
          <p className="text-[#767B82] text-xs leading-relaxed m-0 font-mono">
            {error.message || "Failed to establish secure communications with the AI backend."}
          </p>
          <div className="flex gap-3 justify-end pt-2 border-t border-[#DDE0DA]">
            <button
              onClick={() => {
                setError(null);
                fetchData();
              }}
              className="px-4 py-2 bg-[#3F5B44] text-white rounded text-xs font-mono font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none"
            >
              Retry Connection
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-transparent text-[#767B82] hover:text-[#14171A] rounded text-xs font-mono font-bold active:scale-95 transition-all cursor-pointer border border-[#DDE0DA]"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F5F2] text-[#14171A] font-body-md min-h-screen overflow-x-hidden relative animate-workspace-reveal">
      {/* Top Navigation */}
      <NavBar onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />

      {/* Side Navigation */}
      <SideNav
        currentUser={currentUser}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          logActivity(`Switched tab to: ${tab.toUpperCase()}`, "navigation");
        }}
        onLogout={handleLogout}
      />

      {/* Main Content Layout */}
      <main className="md:pl-64 pt-16 min-h-screen relative z-10 flex flex-col transition-all duration-300">
        <div className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-12 flex-grow">
          {/* AI Center Hub (Hero Section) */}
          <div className="flex flex-col items-center mb-10 relative py-4 bg-transparent border-none">
            <div className="mb-3 stamp-badge">
              CASE RECORD DIRECTORY
            </div>
            <h1
              className="text-3xl md:text-4xl text-[#14171A] text-center mb-2 tracking-tight font-bold"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              WORKSPACE DOCKET
            </h1>
            <p className="text-[#767B82] text-center max-w-lg text-xs md:text-sm px-4 m-0 leading-relaxed">
              Strategic career planning indices, target companies, and tracked opening records.
            </p>
          </div>

          {/* Grid Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            {/* Main Interactive Controls (Left) */}
            <div className="lg:col-span-8 space-y-6">
              {activeTab === "workspace" && (
                <div key="workspace" className="space-y-6">
                  {/* Segmented Control Mode Switcher */}
                  <div className="flex flex-wrap gap-1 p-1 bg-white/5 rounded-xl border border-white/5 w-fit">
                    <button
                      onClick={() => setWorkspaceMode("chat")}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer border-none flex items-center gap-2 ${
                        workspaceMode === "chat"
                          ? "bg-primary text-white shadow-md"
                          : "text-on-surface-variant hover:text-white bg-transparent"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">forum</span>
                      Chat
                    </button>
                    <button
                      onClick={() => setWorkspaceMode("search")}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer border-none flex items-center gap-2 ${
                        workspaceMode === "search"
                          ? "bg-primary text-white shadow-md"
                          : "text-on-surface-variant hover:text-white bg-transparent"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">travel_explore</span>
                      Semantic Search
                    </button>
                    <button
                      onClick={() => setWorkspaceMode("resume")}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer border-none flex items-center gap-2 ${
                        workspaceMode === "resume"
                          ? "bg-primary text-white shadow-md"
                          : "text-on-surface-variant hover:text-white bg-transparent"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">description</span>
                      Resume Analyzer
                    </button>
                    <button
                      onClick={() => setWorkspaceMode("matcher")}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer border-none flex items-center gap-2 ${
                        workspaceMode === "matcher"
                          ? "bg-primary text-white shadow-md"
                          : "text-on-surface-variant hover:text-white bg-transparent"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">radar</span>
                      Job Matcher
                    </button>
                    <button
                      onClick={() => setWorkspaceMode("admin")}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer border-none flex items-center gap-2 ${
                        workspaceMode === "admin"
                          ? "bg-primary text-white shadow-md"
                          : "text-on-surface-variant hover:text-white bg-transparent"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">settings_input_component</span>
                      Qdrant Sync
                    </button>
                  </div>

                  {/* Mode Panel Wrapper */}
                  <div key={workspaceMode} className="animate-crossfade">
                    {workspaceMode === "chat" && <Chat />}
                    {workspaceMode === "search" && <RagHub initialTab="search" />}
                    {workspaceMode === "resume" && <RagHub initialTab="resume" />}
                    {workspaceMode === "matcher" && <RagHub initialTab="matcher" />}
                    {workspaceMode === "admin" && <RagHub initialTab="admin" />}
                  </div>
                </div>
              )}

              {activeTab === "companies_jobs" && (
                <div key="companies_jobs" className="animate-fade-in-up">
                  <CompaniesJobs
                    currentUser={currentUser}
                    applications={applications}
                    onApplyJob={handleApplyJob}
                    onApproveApplication={handleApproveApplication}
                    companies={companies}
                    jobs={jobs}
                    onAddCompany={handleAdd}
                    onEditCompany={handleEdit}
                    onDeleteCompany={handleDelete}
                    onAddJob={handleJobAdd}
                    onEditJob={handleJobEdit}
                    onDeleteJob={handleJobDelete}
                  />
                </div>
              )}

              {activeTab === "approve_users" && (
                <div key="approve_users" className="animate-fade-in-up">
                  <ApproveUsers />
                </div>
              )}
            </div>


            {/* Sidebar Feed (Right) */}
            <div className="lg:col-span-4 mt-6 lg:mt-0">
              <div className="antigravity-card p-6 pt-8 flex flex-col gap-4 text-left relative">
                {/* Manila Folder Tab */}
                <div className="folder-tab">ACTIVITY LOG</div>

                {/* Activity List - Docket style */}
                <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1 py-1">
                  {activities.map((activity, index) => {
                    const numberStr = String(index + 1).padStart(3, "0");
                    const staggerClass = `docket-stagger-${Math.min(5, index + 1)}`;
                    return (
                      <div
                        key={activity.id}
                        className={`flex gap-4 items-start text-xs border-b border-dashed border-[#DDE0DA] pb-2 font-mono ${staggerClass}`}
                      >
                        <span className="docket-index shrink-0 text-[#767B82]">{numberStr}</span>
                        <div className="flex-grow">
                          <p className="m-0 text-[#14171A] leading-relaxed">
                            {activity.text}
                          </p>
                          <span className="text-[10px] text-[#767B82] font-medium block mt-0.5">
                            {activity.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;