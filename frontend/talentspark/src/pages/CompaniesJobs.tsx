import type { Company } from "../types/company";
import type { Job } from "../types/job";
import { useState, useEffect } from "react";

type Props = {
  companies: Company[];
  jobs: Job[];
  onAddCompany: (company: Company) => void;
  onEditCompany: (company: Company) => void;
  onDeleteCompany: (id: number) => void;
  onAddJob: (job: Job) => void;
  onEditJob: (job: Job) => void;
  onDeleteJob: (id: number) => void;
};

export default function CompaniesJobs({
  companies,
  jobs,
  onAddCompany,
  onEditCompany,
  onDeleteCompany,
  onAddJob,
  onEditJob,
  onDeleteJob,
}: Props) {
  // Company Edit State
  const [editCompanyId, setEditCompanyId] = useState<number | null>(null);
  const [editCompanyForm, setEditCompanyForm] = useState<Company | null>(null);
  const [deleteConfirmCompanyId, setDeleteConfirmCompanyId] = useState<number | null>(null);

  // Job Edit State
  const [editJobId, setEditJobId] = useState<number | null>(null);
  const [editJobForm, setEditJobForm] = useState<Job | null>(null);

  // Highlighted Row State (when clicked from tag)
  const [highlightedCompanyId, setHighlightedCompanyId] = useState<number | null>(null);

  // Add Forms State
  const [addCompanyForm, setAddCompanyForm] = useState<Company>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    location: "",
    jobs: [],
  });

  const [addJobForm, setAddJobForm] = useState<Job>({
    id: 0,
    title: "",
    description: "",
    salary: "",
    company_id: companies.length > 0 ? companies[0].id : 0,
  });

  // Sync default company_id in Add Job form
  useEffect(() => {
    if (companies.length > 0 && addJobForm.company_id === 0) {
      setAddJobForm((prev) => ({
        ...prev,
        company_id: companies[0].id,
      }));
    }
  }, [companies, addJobForm.company_id]);

  // Handlers for Company
  const handleAddCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addCompanyForm.name.trim()) return;
    onAddCompany(addCompanyForm);
    setAddCompanyForm({
      id: 0,
      name: "",
      email: "",
      phone: "",
      location: "",
      jobs: [],
    });
  };

  const handleStartEditCompany = (company: Company) => {
    setEditCompanyId(company.id);
    setEditCompanyForm({ ...company });
  };

  const handleSaveCompany = () => {
    if (editCompanyForm && editCompanyForm.name.trim()) {
      onEditCompany(editCompanyForm);
      setEditCompanyId(null);
      setEditCompanyForm(null);
    }
  };

  const handleDeleteCompanyClick = (id: number) => {
    const attachedJobs = jobs.filter((j) => j.company_id === id);
    if (attachedJobs.length > 0) {
      setDeleteConfirmCompanyId(id);
    } else {
      onDeleteCompany(id);
    }
  };

  const handleConfirmDeleteCompany = (id: number) => {
    onDeleteCompany(id);
    setDeleteConfirmCompanyId(null);
  };

  // Handlers for Job
  const handleAddJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addJobForm.title.trim()) return;

    let parsedSalary: number | null = null;
    if (typeof addJobForm.salary === "string" && addJobForm.salary.trim() !== "") {
      const digits = addJobForm.salary.replace(/[^0-9]/g, "");
      if (digits !== "") {
        parsedSalary = parseInt(digits, 10);
      }
    } else if (typeof addJobForm.salary === "number") {
      parsedSalary = addJobForm.salary;
    }

    onAddJob({
      ...addJobForm,
      salary: parsedSalary,
    });

    setAddJobForm({
      id: 0,
      title: "",
      description: "",
      salary: "",
      company_id: companies.length > 0 ? companies[0].id : 0,
    });
  };

  const handleStartEditJob = (job: Job) => {
    setEditJobId(job.id);
    setEditJobForm({ ...job });
  };

  const handleSaveJob = () => {
    if (editJobForm && editJobForm.title.trim()) {
      let parsedSalary: number | null = null;
      if (typeof editJobForm.salary === "string" && editJobForm.salary.trim() !== "") {
        const digits = editJobForm.salary.replace(/[^0-9]/g, "");
        if (digits !== "") {
          parsedSalary = parseInt(digits, 10);
        }
      } else if (typeof editJobForm.salary === "number") {
        parsedSalary = editJobForm.salary;
      }

      onEditJob({
        ...editJobForm,
        salary: parsedSalary,
      });
      setEditJobId(null);
      setEditJobForm(null);
    }
  };

  const handleCompanyTagClick = (companyId: number) => {
    const el = document.getElementById(`company-row-${companyId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedCompanyId(companyId);
      setTimeout(() => {
        setHighlightedCompanyId(null);
      }, 1500);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter text-left items-start">
      {/* LEFT COLUMN: TARGET COMPANIES */}
      <div className="antigravity-card p-6 pt-8 flex flex-col gap-6 relative">
        {/* Manila Folder Tab */}
        <div className="folder-tab">TARGET COMPANIES</div>

        {/* Company List */}
        <div className="flex flex-col overflow-y-auto max-h-[450px] pr-1">
          {companies.length === 0 ? (
            <p className="text-[#767B82] text-xs text-center py-6 font-mono">
              [ WATCHLIST EMPTY ]
            </p>
          ) : (
            companies.map((company, index) => {
              const isEditing = editCompanyId === company.id;
              const isConfirmingDelete = deleteConfirmCompanyId === company.id;
              const isHighlighted = highlightedCompanyId === company.id;
              const numStr = String(index + 1).padStart(3, "0");
              const openingsCount = jobs.filter((j) => j.company_id === company.id).length;
              const staggerClass = `docket-stagger-${Math.min(5, index + 1)}`;

              return (
                <div
                  key={company.id}
                  id={`company-row-${company.id}`}
                  className={`group relative flex flex-col py-4 border-b border-[#DDE0DA] ${staggerClass} ${
                    isHighlighted ? "bg-[#3F5B44]/5 border-l-2 border-[#3F5B44] pl-2" : ""
                  }`}
                >
                  {isEditing ? (
                    /* Inline Edit View */
                    <div className="space-y-3 pl-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          className="modern-input px-3 py-1.5 text-xs text-[#14171A]"
                          placeholder="Company Name"
                          value={editCompanyForm?.name || ""}
                          onChange={(e) =>
                            setEditCompanyForm((prev) => prev && { ...prev, name: e.target.value })
                          }
                        />
                        <input
                          type="text"
                          className="modern-input px-3 py-1.5 text-xs text-[#14171A]"
                          placeholder="Location"
                          value={editCompanyForm?.location || ""}
                          onChange={(e) =>
                            setEditCompanyForm((prev) => prev && { ...prev, location: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="email"
                          className="modern-input px-3 py-1.5 text-xs text-[#14171A]"
                          placeholder="Email"
                          value={editCompanyForm?.email || ""}
                          onChange={(e) =>
                            setEditCompanyForm((prev) => prev && { ...prev, email: e.target.value })
                          }
                        />
                        <input
                          type="text"
                          className="modern-input px-3 py-1.5 text-xs text-[#14171A]"
                          placeholder="Phone"
                          value={editCompanyForm?.phone || ""}
                          onChange={(e) =>
                            setEditCompanyForm((prev) => prev && { ...prev, phone: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => {
                            setEditCompanyId(null);
                            setEditCompanyForm(null);
                          }}
                          className="px-3 py-1 rounded bg-[#F4F5F2] hover:bg-[#DDE0DA] text-[#14171A] text-xs font-mono border border-[#DDE0DA] cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveCompany}
                          className="px-3 py-1 rounded bg-[#3F5B44] hover:opacity-90 text-white text-xs font-mono border-none cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : isConfirmingDelete ? (
                    /* Inline Deletion Confirmation */
                    <div className="flex flex-col gap-2 p-1 pl-8">
                      <p className="text-[#14171A] text-xs font-mono m-0 uppercase font-bold">
                        This will also remove {openingsCount} tracked openings. Confirm removal?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConfirmDeleteCompany(company.id)}
                          className="px-3 py-1 rounded bg-red-700 text-white text-xs font-mono border-none cursor-pointer"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => setDeleteConfirmCompanyId(null)}
                          className="px-3 py-1 rounded bg-[#F4F5F2] text-[#14171A] text-xs font-mono border border-[#DDE0DA] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Default Info View (The Docket list format) */
                    <div className="flex gap-4 items-start">
                      <span className="docket-index shrink-0 pt-0.5">{numStr}</span>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-center gap-4">
                          <div className="flex items-center gap-3">
                            <span className="text-[#14171A] text-sm font-bold tracking-tight">{company.name}</span>
                            <span className="stamp-badge">
                              {openingsCount} {openingsCount === 1 ? "OPENING" : "OPENINGS"}
                            </span>
                          </div>

                          {/* Hover action buttons */}
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0 bg-white pl-2">
                            <button
                              onClick={() => handleStartEditCompany(company)}
                              className="p-1 hover:bg-[#F4F5F2] text-[#767B82] hover:text-[#14171A] border-none bg-transparent cursor-pointer flex"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteCompanyClick(company.id)}
                              className="p-1 hover:bg-[#F4F5F2] text-[#767B82] hover:text-red-700 border-none bg-transparent cursor-pointer flex"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        </div>

                        {/* Metadata row */}
                        <div className="flex flex-wrap gap-x-3 text-[11px] text-[#767B82] mt-1 font-mono">
                          {company.location && (
                            <span>{company.location}</span>
                          )}
                          {company.location && (company.email || company.phone) && <span>·</span>}
                          {company.email && (
                            <span>{company.email}</span>
                          )}
                          {company.email && company.phone && <span>·</span>}
                          {company.phone && (
                            <span>{company.phone}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Add Company Form */}
        <form onSubmit={handleAddCompanySubmit} className="border-t border-[#DDE0DA] pt-5 space-y-3">
          <h4 className="text-[#14171A] text-xs font-bold font-mono uppercase tracking-wider mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
            Add Company Docket
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Company Name"
              className="modern-input w-full px-3 py-2 text-xs"
              value={addCompanyForm.name}
              onChange={(e) => setAddCompanyForm((prev) => ({ ...prev, name: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Location"
              className="modern-input w-full px-3 py-2 text-xs"
              value={addCompanyForm.location || ""}
              onChange={(e) => setAddCompanyForm((prev) => ({ ...prev, location: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="email"
              placeholder="Email"
              className="modern-input w-full px-3 py-2 text-xs"
              value={addCompanyForm.email || ""}
              onChange={(e) => setAddCompanyForm((prev) => ({ ...prev, email: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Phone"
              className="modern-input w-full px-3 py-2 text-xs"
              value={addCompanyForm.phone || ""}
              onChange={(e) => setAddCompanyForm((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={!addCompanyForm.name.trim()}
              className="bg-[#3F5B44] text-white px-4 py-2 rounded font-mono font-bold text-xs shadow-none hover:opacity-90 transition-all border-none cursor-pointer disabled:opacity-50"
            >
              Add Company
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT COLUMN: JOB OPENINGS */}
      <div className="antigravity-card p-6 pt-8 flex flex-col gap-6 relative">
        {/* Manila Folder Tab */}
        <div className="folder-tab">SPECIFIC OPENINGS</div>

        {/* Jobs List */}
        <div className="flex flex-col overflow-y-auto max-h-[450px] pr-1">
          {jobs.length === 0 ? (
            <p className="text-[#767B82] text-xs text-center py-6 font-mono">
              [ NO TRACKED OPENINGS ]
            </p>
          ) : (
            jobs.map((job, index) => {
              const isEditing = editJobId === job.id;
              const parentCompany = companies.find((c) => c.id === job.company_id);
              const numStr = String(index + 1).padStart(3, "0");
              const staggerClass = `docket-stagger-${Math.min(5, index + 1)}`;

              return (
                <div
                  key={job.id}
                  className={`group relative flex flex-col py-4 border-b border-[#DDE0DA] ${staggerClass}`}
                >
                  {isEditing ? (
                    /* Inline Edit View */
                    <div className="space-y-3 pl-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          className="modern-input px-3 py-1.5 text-xs text-[#14171A]"
                          placeholder="Job Title"
                          value={editJobForm?.title || ""}
                          onChange={(e) =>
                            setEditJobForm((prev) => prev && { ...prev, title: e.target.value })
                          }
                        />
                        <input
                          type="text"
                          className="modern-input px-3 py-1.5 text-xs text-[#14171A]"
                          placeholder="Salary (e.g. 95000)"
                          value={editJobForm?.salary || ""}
                          onChange={(e) =>
                            setEditJobForm((prev) => prev && { ...prev, salary: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <select
                          className="modern-input px-3 py-1.5 text-xs text-[#14171A] bg-white border border-[#DDE0DA]"
                          value={editJobForm?.company_id || 0}
                          onChange={(e) =>
                            setEditJobForm((prev) => prev && { ...prev, company_id: Number(e.target.value) })
                          }
                        >
                          {companies.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          className="modern-input px-3 py-1.5 text-xs text-[#14171A]"
                          placeholder="Description"
                          value={editJobForm?.description || ""}
                          onChange={(e) =>
                            setEditJobForm((prev) => prev && { ...prev, description: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => {
                            setEditJobId(null);
                            setEditJobForm(null);
                          }}
                          className="px-3 py-1 rounded bg-[#F4F5F2] hover:bg-[#DDE0DA] text-[#14171A] text-xs font-mono border border-[#DDE0DA] cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveJob}
                          className="px-3 py-1 rounded bg-[#3F5B44] hover:opacity-90 text-white text-xs font-mono border-none cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Default Info View */
                    <div className="flex gap-4 items-start">
                      <span className="docket-index shrink-0 pt-0.5">{numStr}</span>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-center gap-4">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="text-[#14171A] text-sm font-bold tracking-tight">{job.title}</span>
                            {parentCompany && (
                              <button
                                onClick={() => handleCompanyTagClick(parentCompany.id)}
                                className="text-[10px] text-[#3F5B44] hover:bg-[#3F5B44] hover:text-white font-semibold border border-[#3F5B44] px-1.5 py-0.5 rounded cursor-pointer transition-colors uppercase tracking-wider font-mono bg-transparent"
                                title="Scroll to Company"
                              >
                                {parentCompany.name.toLowerCase()}
                              </button>
                            )}
                            {job.salary && (
                              <span className="text-[11px] text-[#767B82] font-mono font-semibold">
                                ${Number(job.salary).toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Hover action buttons */}
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0 bg-white pl-2">
                            <button
                              onClick={() => handleStartEditJob(job)}
                              className="p-1 hover:bg-[#F4F5F2] text-[#767B82] hover:text-[#14171A] border-none bg-transparent cursor-pointer flex"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                            </button>
                            <button
                              onClick={() => onDeleteJob(job.id)}
                              className="p-1 hover:bg-[#F4F5F2] text-[#767B82] hover:text-red-700 border-none bg-transparent cursor-pointer flex"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        </div>

                        {job.description && (
                          <p className="text-[#767B82] text-xs leading-relaxed mt-1 m-0">
                            {job.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Track Opening Form */}
        <form onSubmit={handleAddJobSubmit} className="border-t border-[#DDE0DA] pt-5 space-y-3">
          <h4 className="text-[#14171A] text-xs font-bold font-mono uppercase tracking-wider mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
            Track Opening Entry
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Job Title"
              className="modern-input w-full px-3 py-2 text-xs"
              value={addJobForm.title}
              onChange={(e) => setAddJobForm((prev) => ({ ...prev, title: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Salary (e.g. 95000)"
              className="modern-input w-full px-3 py-2 text-xs"
              value={addJobForm.salary || ""}
              onChange={(e) => setAddJobForm((prev) => ({ ...prev, salary: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              className="modern-input w-full px-3 py-2 text-xs text-[#14171A] bg-white border border-[#DDE0DA]"
              value={addJobForm.company_id}
              onChange={(e) => setAddJobForm((prev) => ({ ...prev, company_id: Number(e.target.value) }))}
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Job Description"
              className="modern-input w-full px-3 py-2 text-xs"
              value={addJobForm.description || ""}
              onChange={(e) => setAddJobForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={!addJobForm.title.trim() || companies.length === 0}
              className="bg-[#3F5B44] text-white px-4 py-2 rounded font-mono font-bold text-xs shadow-none hover:opacity-90 transition-all border-none cursor-pointer disabled:opacity-50"
            >
              Track Opening
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
