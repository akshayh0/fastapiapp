import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import { SideNav } from "./components/SideNav";
import Chat from "./pages/chat";
import CompanyCard from "./components/CompanyCard";
import JobCard from "./components/JobCard";
import { DashboardBackground } from "./components/DashboardBackground";
import { ThreeJsNeuralNetwork } from "./components/ThreeJsNeuralNetwork";

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
import Register from "./pages/Register";

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
  const [page, setPage] = useState<"login" | "register">("login");
  const [activeTab, setActiveTab] = useState<string>("assistant");
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
    setCompanies([]);
    setJobs([]);
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

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  if (!token) {
    return (
      <>
        {page === "login" ? (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={() => setPage("register")}
          />
        ) : (
          <Register
            onSwitchToLogin={() => setPage("login")}
          />
        )}
      </>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0b1326] flex items-center justify-center text-white z-50">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined animate-spin text-[36px] text-primary">
            sync
          </span>
          <span className="font-label-sm text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Synchronizing Engine Core...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-[#0b1326] flex items-center justify-center text-white z-50 px-6">
        <div className="glass-panel p-8 rounded-2xl max-w-md text-left flex flex-col gap-4 border-error/20">
          <div className="flex items-center gap-3 text-error">
            <span className="material-symbols-outlined text-[32px]">error</span>
            <h3 className="text-xl font-bold font-display-lg m-0">Connection Interrupted</h3>
          </div>
          <p className="text-on-surface-variant text-sm leading-relaxed m-0">
            {error.message || "Failed to establish secure communications with the AI backend."}
          </p>
          <div className="flex gap-3 justify-end pt-2 border-t border-white/5">
            <button
              onClick={() => {
                setError(null);
                fetchData();
              }}
              className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none"
            >
              Retry Connection
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-transparent text-on-surface-variant hover:text-white rounded-xl text-xs font-bold active:scale-95 transition-all cursor-pointer border border-white/10"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b1326] text-on-background font-body-md min-h-screen selection:bg-primary-container selection:text-white overflow-x-hidden relative">
      {/* Full Screen Plasma Shader Background */}
      <DashboardBackground />

      {/* Top Navigation */}
      <NavBar onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />

      {/* Side Navigation */}
      <SideNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          logActivity(`Switched tab to: ${tab.toUpperCase()}`, "navigation");
        }}
        onLogout={handleLogout}
      />

      {/* Main Content Layout */}
      <main className="md:pl-64 pt-16 min-h-screen relative z-10 flex flex-col">
        <div className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-12 flex-grow">
          {/* AI Center Hub (Hero Section) */}
          <div className="flex flex-col items-center mb-16 relative py-8 overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
            {/* 3D Neural Network background simulation inside Hero container */}
            <ThreeJsNeuralNetwork />

            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary p-1 mb-6 shadow-[0_0_30px_rgba(124,58,237,0.4)] relative z-10">
              <div className="w-full h-full rounded-full bg-[#0b1326] flex items-center justify-center overflow-hidden">
                <img
                  alt="CareerAI Core"
                  className="w-full h-full object-cover opacity-85"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqeep1WzvQIO1bdFKOrUmOffVafhYO_4X9zEJZTstCbQt3MOuvid9t2WVx0uJKu56eb2STUDSstI7JFUeY_Deicnww9cYVzU0xq6AYM55XlPFmqu4MpKyuCbfYK8GmdK3J2HP6VWAXUqCt6_zChGpI1VnIVBxIbbvlkiY89yUKHJ1_3aRHIIYPS-fsJAEsPCYIrU72ORzoSCtOHVuyonnvn_8QR_slrF3mbKJmS5v-yVVz_CbGTi0G77zgkfv4CvY-og"
                />
              </div>
            </div>
            <h1
              className="font-display-lg text-3xl md:text-5xl text-white text-center mb-2 relative z-10 tracking-tight font-bold"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
            >
              AI Career Assistant
            </h1>
            <p className="text-on-surface-variant text-center max-w-lg text-sm md:text-base relative z-10 px-4 m-0 leading-relaxed">
              Strategizing your professional trajectory with high-precision market analysis and skill-gap synthesis.
            </p>
          </div>

          {/* Grid Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            {/* Main Interactive Controls (Left) */}
            <div className="lg:col-span-8 space-y-6">
              {activeTab === "assistant" && (
                <>
                  {/* Chat interface sits at the top */}
                  <Chat />
                  {/* Under Assistant tab, display both widgets below */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                    <CompanyCard
                      companies={companies}
                      jobs={jobs}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onAdd={handleAdd}
                    />
                    <JobCard
                      jobs={jobs}
                      companies={companies}
                      onEdit={handleJobEdit}
                      onDelete={handleJobDelete}
                      onAdd={handleJobAdd}
                    />
                  </div>
                </>
              )}

              {activeTab === "companies" && (
                <CompanyCard
                  companies={companies}
                  jobs={jobs}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAdd={handleAdd}
                />
              )}

              {activeTab === "jobs" && (
                <JobCard
                  jobs={jobs}
                  companies={companies}
                  onEdit={handleJobEdit}
                  onDelete={handleJobDelete}
                  onAdd={handleJobAdd}
                />
              )}
            </div>

            {/* Sidebar Feed (Right) */}
            <div className="lg:col-span-4">
              <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6 text-left relative overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg">
                    history
                  </span>
                  <div>
                    <h3 className="font-display-lg text-white text-[18px] font-bold m-0" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                      Recent Activity
                    </h3>
                    <p className="text-on-surface-variant font-body-md text-xs m-0 mt-0.5">
                      Real-time events in your career core.
                    </p>
                  </div>
                </div>

                {/* Activity List */}
                <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-1">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 text-sm text-on-surface border-b border-white/5 pb-3 last:border-b-0 last:pb-0"
                    >
                      <span className="material-symbols-outlined text-secondary bg-white/5 p-1.5 rounded-lg text-[16px] flex items-center justify-center">
                        {activity.icon}
                      </span>
                      <div className="flex-1 space-y-0.5">
                        <p className="m-0 text-on-surface leading-relaxed text-xs">
                          {activity.text}
                        </p>
                        <span
                          className="text-[9px] text-on-surface-variant font-medium tracking-wide"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  ))}
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