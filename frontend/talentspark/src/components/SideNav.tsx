
type Props = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
};

export function SideNav({ activeTab, onTabChange, onLogout }: Props) {
  return (
    <aside
      className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-[#131b2e]/50 backdrop-blur-2xl border-r border-white/5 shadow-2xl flex flex-col py-6 px-4 gap-4 z-40 hidden md:flex"
      style={{ boxSizing: "border-box" }}
    >
      {/* Title / Indicator Header */}
      <div className="px-4 py-2 mb-4 text-left">
        <h3 className="font-display-lg text-primary text-[20px] mb-1 m-0" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
          Assistant Core
        </h3>
        <p
          className="font-label-sm text-label-sm text-secondary opacity-80 flex items-center gap-2 m-0 text-xs mt-1"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_#89ceff]"></span>
          Precision Mode Active
        </p>
      </div>

      {/* Main Navigation Links */}
      <div className="flex flex-col gap-1 flex-grow">
        <button
          onClick={() => onTabChange("assistant")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left border-none transition-all duration-300 w-full cursor-pointer ${
            activeTab === "assistant"
              ? "bg-[#7c3aed]/20 text-primary border-r-4 border-[#7c3aed]"
              : "text-on-surface-variant hover:bg-white/5 hover:translate-x-1"
          }`}
        >
          <span className="material-symbols-outlined">smart_toy</span>
          <span className="font-label-sm text-label-sm text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Assistant
          </span>
        </button>

        <button
          onClick={() => onTabChange("companies")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left border-none transition-all duration-300 w-full cursor-pointer ${
            activeTab === "companies"
              ? "bg-[#7c3aed]/20 text-primary border-r-4 border-[#7c3aed]"
              : "text-on-surface-variant hover:bg-white/5 hover:translate-x-1"
          }`}
        >
          <span className="material-symbols-outlined">corporate_fare</span>
          <span className="font-label-sm text-label-sm text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Companies
          </span>
        </button>

        <button
          onClick={() => onTabChange("jobs")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left border-none transition-all duration-300 w-full cursor-pointer ${
            activeTab === "jobs"
              ? "bg-[#7c3aed]/20 text-primary border-r-4 border-[#7c3aed]"
              : "text-on-surface-variant hover:bg-white/5 hover:translate-x-1"
          }`}
        >
          <span className="material-symbols-outlined">work</span>
          <span className="font-label-sm text-label-sm text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Jobs Opening
          </span>
        </button>
      </div>

      {/* Footer SideNav Actions */}
      <div className="mt-auto flex flex-col gap-1 border-t border-white/5 pt-4">
        <button
          className="w-full mb-4 py-3 px-4 rounded-xl bg-gradient-to-r from-primary-container to-secondary-container text-white font-semibold text-sm shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:scale-[1.02] active:scale-95 transition-all border-none cursor-pointer"
          onClick={() => alert("Upgrade to Pro initiated.")}
        >
          Upgrade Pro
        </button>

        <button
          onClick={() => alert("Help documentation is available on the support portal.")}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-left border-none bg-transparent text-on-surface-variant hover:bg-white/5 hover:translate-x-1 transition-all duration-300 w-full cursor-pointer"
        >
          <span className="material-symbols-outlined">help</span>
          <span className="font-label-sm text-label-sm text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Help
          </span>
        </button>

        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-left border-none bg-transparent text-on-surface-variant hover:bg-white/5 hover:translate-x-1 transition-all duration-300 w-full cursor-pointer"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-label-sm text-label-sm text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}
