
type Props = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
};

export function SideNav({ activeTab, onTabChange, onLogout }: Props) {
  return (
    <aside
      className="fixed left-0 top-0 bottom-0 h-screen w-64 bg-[#F4F5F2] border-r border-[#DDE0DA] flex flex-col py-6 px-4 gap-4 z-40 hidden md:flex"
      style={{ boxSizing: "border-box" }}
    >
      {/* Title / Indicator Header */}
      <div className="px-4 py-2 mb-4 text-left border-b border-[#DDE0DA]">
        <h3 className="font-display-lg text-[#14171A] text-[18px] m-0 tracking-tight font-bold" style={{ fontFamily: "'Space Mono', monospace" }}>
          CASE RECORDS
        </h3>
        <p
          className="font-mono text-[#767B82] flex items-center gap-1.5 m-0 text-[10px] mt-1 uppercase"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          <span className="w-1.5 h-1.5 bg-[#3F5B44]"></span>
          PRECISION CORE ACTIVE
        </p>
      </div>

      {/* Main Navigation Links: Stacked Folder Tabs */}
      <div className="flex flex-col gap-0.5 flex-grow text-left">
        <button
          onClick={() => onTabChange("workspace")}
          className={`flex items-center gap-3 px-4 py-3 text-left cursor-pointer sidenav-tab-settle w-full bg-transparent ${
            activeTab === "workspace"
              ? "bg-white text-[#3F5B44] border-l-2 border-[#3F5B44] border-t border-r border-b border-[#DDE0DA]"
              : "text-[#767B82] border-l-2 border-transparent border-t border-r border-b border-transparent hover:text-[#14171A]"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">folder_open</span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            AI Workspace
          </span>
        </button>

        <button
          onClick={() => onTabChange("companies_jobs")}
          className={`flex items-center gap-3 px-4 py-3 text-left cursor-pointer sidenav-tab-settle w-full bg-transparent ${
            activeTab === "companies_jobs"
              ? "bg-white text-[#3F5B44] border-l-2 border-[#3F5B44] border-t border-r border-b border-[#DDE0DA]"
              : "text-[#767B82] border-l-2 border-transparent border-t border-r border-b border-transparent hover:text-[#14171A]"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">folder</span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Companies & Jobs
          </span>
        </button>
      </div>

      {/* Footer SideNav Actions */}
      <div className="mt-auto flex flex-col gap-1 border-t border-[#DDE0DA] pt-4">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2 text-left border-none bg-transparent text-[#767B82] hover:text-[#14171A] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span className="font-mono text-xs font-bold uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Close Session
          </span>
        </button>
      </div>
    </aside>
  );
}
