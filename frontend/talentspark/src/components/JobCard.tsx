import type { Job } from "../types/job";
import type { Company } from "../types/company";
import { useState } from "react";

type Props = {
  jobs: Job[];
  companies: Company[];
  onEdit: (job: Job) => void;
  onDelete: (id: number) => void;
  onAdd: (job: Job) => void;
};

function JobCard({ jobs, companies, onEdit, onDelete, onAdd }: Props) {
  const [editJobId, setEditJobId] = useState<number | null>(null);
  const [addform, setAddform] = useState<Job>({
    id: 0,
    title: "",
    description: "",
    salary: "",
    company_id: companies.length > 0 ? companies[0].id : 0,
  });
  const [editform, setEditform] = useState<Job>({
    id: 0,
    title: "",
    description: "",
    salary: "",
    company_id: 0,
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addform.title.trim()) return;
    onAdd(addform);
    setAddform({
      id: 0,
      title: "",
      description: "",
      salary: "",
      company_id: companies.length > 0 ? companies[0].id : 0,
    });
  };

  const handleSave = () => {
    if (!editform.title.trim()) return;
    onEdit(editform);
    setEditJobId(null);
  };

  const handleCancel = () => {
    setEditJobId(null);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6 text-left relative overflow-hidden h-full">
      <style>{`
        .glass-panel {
          background: rgba(30, 41, 59, 0.4);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <span className="material-symbols-outlined text-secondary p-2 bg-secondary/10 rounded-lg">
          work
        </span>
        <div>
          <h3 className="font-display-lg text-white text-[18px] font-bold m-0" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            Specific Openings
          </h3>
          <p className="text-on-surface-variant font-body-md text-xs m-0 mt-0.5">
            Track and synthesize specific roles at target firms.
          </p>
        </div>
      </div>

      {/* List of Jobs */}
      <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1">
        {jobs.length === 0 ? (
          <p className="text-on-surface-variant/40 font-body-md text-sm text-center py-6">
            No job openings tracked yet.
          </p>
        ) : (
          jobs.map((job) => {
            const linkedCompany = companies.find((c) => c.id === job.company_id);
            const isEditing = editJobId === job.id;

            return (
              <div
                key={job.id}
                className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col gap-3 transition-all hover:bg-white/10 hover:border-secondary/20"
              >
                {isEditing ? (
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      className="w-full bg-[#131b2e] border border-white/10 rounded-lg p-2 text-on-surface text-sm focus:border-secondary focus:ring-0 outline-none"
                      placeholder="Job Title"
                      value={editform.title}
                      onChange={(e) => setEditform({ ...editform, title: e.target.value })}
                    />
                    <input
                      type="text"
                      className="w-full bg-[#131b2e] border border-white/10 rounded-lg p-2 text-on-surface text-sm focus:border-secondary focus:ring-0 outline-none"
                      placeholder="Salary (e.g. $140,000)"
                      value={editform.salary}
                      onChange={(e) => setEditform({ ...editform, salary: e.target.value })}
                    />
                    <textarea
                      className="w-full bg-[#131b2e] border border-white/10 rounded-lg p-2 text-on-surface text-sm focus:border-secondary focus:ring-0 outline-none h-16 resize-none"
                      placeholder="Job Description"
                      value={editform.description}
                      onChange={(e) => setEditform({ ...editform, description: e.target.value })}
                    />
                    <select
                      className="w-full bg-[#131b2e] border border-white/10 rounded-lg p-2 text-on-surface text-sm focus:border-secondary focus:ring-0 outline-none"
                      value={editform.company_id}
                      onChange={(e) => setEditform({ ...editform, company_id: Number(e.target.value) })}
                    >
                      <option value={0}>Select Company...</option>
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <div className="flex justify-end gap-2 mt-1">
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1.5 rounded-lg border border-white/10 bg-transparent text-xs text-on-surface-variant hover:text-white transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-3 py-1.5 rounded-lg bg-secondary text-[#00344d] text-xs font-bold hover:opacity-90 transition-all cursor-pointer border-none"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-grow space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-on-surface font-bold text-base m-0">
                          {job.title}
                        </h4>
                        {job.salary && (
                          <span
                            className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            {job.salary}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-secondary font-semibold m-0 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">corporate_fare</span>
                        {linkedCompany ? linkedCompany.name : `Company ID: ${job.company_id}`}
                      </p>
                      {job.description && (
                        <p className="text-xs text-on-surface-variant line-clamp-2 m-0 pt-1 leading-relaxed">
                          {job.description}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditJobId(job.id);
                          setEditform(job);
                        }}
                        className="p-1 rounded hover:bg-white/5 text-on-surface-variant hover:text-secondary transition-colors border-none bg-transparent cursor-pointer flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => onDelete(job.id)}
                        className="p-1 rounded hover:bg-white/5 text-on-surface-variant hover:text-error transition-colors border-none bg-transparent cursor-pointer flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Job Form */}
      <form onSubmit={handleAddSubmit} className="flex flex-col gap-3 border-t border-white/5 pt-4">
        <h4 className="font-display-lg text-white text-sm font-semibold m-0" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
          Track New Opening
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-on-surface text-sm focus:border-secondary focus:ring-0 outline-none"
            placeholder="Job Title (e.g. Frontend Engineer)"
            value={addform.title}
            onChange={(e) => setAddform({ ...addform, title: e.target.value })}
            required
          />
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-on-surface text-sm focus:border-secondary focus:ring-0 outline-none"
            placeholder="Salary (e.g. $150,000 / yr)"
            value={addform.salary}
            onChange={(e) => setAddform({ ...addform, salary: e.target.value })}
          />
          <select
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-on-surface text-sm focus:border-secondary focus:ring-0 outline-none md:col-span-2"
            value={addform.company_id}
            onChange={(e) => setAddform({ ...addform, company_id: Number(e.target.value) })}
            required
          >
            {companies.length === 0 ? (
              <option value={0}>Add a company first...</option>
            ) : (
              companies.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#131b2e]">
                  {c.name}
                </option>
              ))
            )}
          </select>
          <textarea
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-on-surface text-sm focus:border-secondary focus:ring-0 outline-none md:col-span-2 h-16 resize-none"
            placeholder="Job Description and requirements..."
            value={addform.description}
            onChange={(e) => setAddform({ ...addform, description: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="mt-2 py-3 px-4 bg-gradient-to-r from-secondary-container to-[#004c6e] text-white font-semibold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer border-none"
        >
          <span>Track Opening</span>
          <span className="material-symbols-outlined group-hover:translate-x-0.5 transition-transform text-[18px]">
            add
          </span>
        </button>
      </form>
    </div>
  );
}

export default JobCard;