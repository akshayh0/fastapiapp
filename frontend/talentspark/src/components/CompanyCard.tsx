import type { Company } from "../types/company";
import type { Job } from "../types/job";
import { useState } from "react";

type Props = {
  companies: Company[];
  jobs: Job[];
  onEdit: (company: Company) => void;
  onDelete: (id: number) => void;
  onAdd: (company: Company) => void;
};

function CompanyCard({ companies, jobs, onAdd, onEdit, onDelete }: Props) {
  const [editCompanyId, setEditCompanyId] = useState<number | null>(null);
  const [addform, setAddform] = useState<Company>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    location: "",
    jobs: [],
  });
  const [editform, setEditform] = useState<Company>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    location: "",
    jobs: [],
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addform.name.trim()) return;
    onAdd(addform);
    setAddform({
      id: 0,
      name: "",
      email: "",
      phone: "",
      location: "",
      jobs: [],
    });
  };

  const handleSave = () => {
    if (!editform.name.trim()) return;
    onEdit(editform);
    setEditCompanyId(null);
  };

  const handleCancel = () => {
    setEditCompanyId(null);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6 text-left relative overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg">
          corporate_fare
        </span>
        <div>
          <h3 className="font-display-lg text-white text-[18px] font-bold m-0" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            Target Companies
          </h3>
          <p className="text-on-surface-variant font-body-md text-xs m-0 mt-0.5">
            Add and manage firms on your career watchlist.
          </p>
        </div>
      </div>

      {/* List of Companies */}
      <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1">
        {companies.length === 0 ? (
          <p className="text-on-surface-variant/40 font-body-md text-sm text-center py-6">
            No target companies added yet.
          </p>
        ) : (
          companies.map((company) => {
            const companyJobs = jobs.filter((j) => j.company_id === company.id);
            const isEditing = editCompanyId === company.id;

            return (
              <div
                key={company.id}
                className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col gap-3 transition-all hover:bg-white/10 hover:border-primary/20"
              >
                {isEditing ? (
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      className="w-full bg-[#131b2e] border border-white/10 rounded-lg p-2 text-on-surface text-sm focus:border-primary focus:ring-0 outline-none"
                      placeholder="Name"
                      value={editform.name}
                      onChange={(e) => setEditform({ ...editform, name: e.target.value })}
                    />
                    <input
                      type="text"
                      className="w-full bg-[#131b2e] border border-white/10 rounded-lg p-2 text-on-surface text-sm focus:border-primary focus:ring-0 outline-none"
                      placeholder="Email"
                      value={editform.email}
                      onChange={(e) => setEditform({ ...editform, email: e.target.value })}
                    />
                    <input
                      type="text"
                      className="w-full bg-[#131b2e] border border-white/10 rounded-lg p-2 text-on-surface text-sm focus:border-primary focus:ring-0 outline-none"
                      placeholder="Phone"
                      value={editform.phone}
                      onChange={(e) => setEditform({ ...editform, phone: e.target.value })}
                    />
                    <input
                      type="text"
                      className="w-full bg-[#131b2e] border border-white/10 rounded-lg p-2 text-on-surface text-sm focus:border-primary focus:ring-0 outline-none"
                      placeholder="Location"
                      value={editform.location}
                      onChange={(e) => setEditform({ ...editform, location: e.target.value })}
                    />
                    <div className="flex justify-end gap-2 mt-1">
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1.5 rounded-lg border border-white/10 bg-transparent text-xs text-on-surface-variant hover:text-white transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:opacity-90 transition-all cursor-pointer border-none"
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
                          {company.name}
                        </h4>
                        <span
                          className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[10px] font-semibold"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {companyJobs.length} opening{companyJobs.length === 1 ? "" : "s"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-on-surface-variant">
                        {company.location && (
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                            <span>{company.location}</span>
                          </div>
                        )}
                        {company.email && (
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">mail</span>
                            <span className="truncate">{company.email}</span>
                          </div>
                        )}
                        {company.phone && (
                          <div className="flex items-center gap-1 col-span-2 mt-0.5">
                            <span className="material-symbols-outlined text-[14px]">call</span>
                            <span>{company.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditCompanyId(company.id);
                          setEditform(company);
                        }}
                        className="p-1 rounded hover:bg-white/5 text-on-surface-variant hover:text-primary transition-colors border-none bg-transparent cursor-pointer flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => onDelete(company.id)}
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

      {/* Add Company Form */}
      <form onSubmit={handleAddSubmit} className="flex flex-col gap-3 border-t border-white/5 pt-4">
        <h4 className="font-display-lg text-white text-sm font-semibold m-0" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
          Add Watchlist Company
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-on-surface text-sm focus:border-primary focus:ring-0 outline-none"
            placeholder="Company Name (e.g. Anthropic)"
            value={addform.name}
            onChange={(e) => setAddform({ ...addform, name: e.target.value })}
            required
          />
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-on-surface text-sm focus:border-primary focus:ring-0 outline-none"
            placeholder="Location (e.g. San Francisco)"
            value={addform.location}
            onChange={(e) => setAddform({ ...addform, location: e.target.value })}
          />
          <input
            type="email"
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-on-surface text-sm focus:border-primary focus:ring-0 outline-none"
            placeholder="Email (e.g. info@firm.com)"
            value={addform.email}
            onChange={(e) => setAddform({ ...addform, email: e.target.value })}
          />
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-on-surface text-sm focus:border-primary focus:ring-0 outline-none"
            placeholder="Phone (e.g. +1 555-0199)"
            value={addform.phone}
            onChange={(e) => setAddform({ ...addform, phone: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="mt-2 py-3 px-4 bg-gradient-to-r from-primary-container to-inverse-primary text-white font-semibold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer border-none"
        >
          <span>Add Company</span>
          <span className="material-symbols-outlined group-hover:translate-x-0.5 transition-transform text-[18px]">
            add
          </span>
        </button>
      </form>
    </div>
  );
}

export default CompanyCard;