import { useState } from "react";

type Props = {
  onLogout?: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
};

const MALE_PRESETS = [
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&h=150&q=80"
];

const FEMALE_PRESETS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
];

const DEFAULT_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuB5nym7eWc31QCAPiezxAEdukWge3mP9sKNFwbaIydCdisy5CCfPHKXrwB4qchcgG0WEVG8m17zjQJdAAApOgKi_2oKDCm6tPRhJU0MzrVIRyGId5YzAcmFdvOhl1M3VK37A2DcDdJr7SMXONJ3_vi793kQVGD83FQOoMLqab7dZl9qMe3FhTUJxIshV8UoM0NTtP428NHSP2BvjaKBHhS2dI6sVI-Av2-dTd0xf1VuaXqUMHKj7rHe";

function NavBar({ onLogout, theme, onToggleTheme }: Props) {
  const [profilePhoto, setProfilePhoto] = useState(() => {
    return localStorage.getItem("profile_photo") || DEFAULT_AVATAR;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeGender, setActiveGender] = useState<"male" | "female">("male");
  const [tempSelectedPhoto, setTempSelectedPhoto] = useState(profilePhoto);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("token");
      window.location.reload();
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-[#F4F5F2] border-b border-[#DDE0DA] flex justify-between items-center px-8 h-16">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold uppercase tracking-widest text-[#14171A]" style={{ fontFamily: "'Space Mono', monospace" }}>
            CAREER.AI
          </span>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={onToggleTheme}
            className="text-[#767B82] hover:text-[#14171A] transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center p-1"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>

          <button className="text-[#767B82] hover:text-[#14171A] transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center p-1">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-[#DDE0DA] py-1">
            {/* Clickable Profile Image Container */}
            <div 
              onClick={() => {
                setTempSelectedPhoto(profilePhoto);
                setIsModalOpen(true);
              }}
              className="w-8 h-8 rounded-full overflow-hidden border border-[#DDE0DA] hover:border-[#3F5B44] transition-all cursor-pointer relative group/avatar active:scale-95"
              title="Change Profile Photo"
            >
              <img
                className="w-full h-full object-cover group-hover/avatar:opacity-85 transition-opacity"
                alt="User Portrait"
                src={profilePhoto}
              />
              {/* Subtle edit overlay indicator on hover */}
              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
                <span className="material-symbols-outlined text-white text-[14px]">edit</span>
              </div>
            </div>

            {/* Separate Logout trigger */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer group hover:text-error transition-colors"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-[#767B82] group-hover:text-error transition-colors" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                Logout
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#767B82] group-hover:text-error transition-all">
                logout
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Profile Photo Selector Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[10000] p-4 animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-[#F4F5F2] border border-[#DDE0DA] rounded-xl shadow-2xl w-full max-w-sm overflow-hidden text-left relative"
            onClick={(e) => e.stopPropagation()}
            style={{ boxSizing: "border-box" }}
          >
            {/* Folder tab design header */}
            <div className="px-5 pt-6 pb-4 border-b border-[#DDE0DA]">
              <div 
                className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#3F5B44] bg-[#3F5B44]/10 px-2 py-0.5 rounded w-fit mb-2"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                USER CONFIGURATION
              </div>
              <h3 
                className="m-0 text-lg font-bold text-[#14171A] tracking-tight uppercase"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Change Portrait
              </h3>
            </div>

            {/* Content Body */}
            <div className="p-5 flex flex-col gap-4">
              {/* Category tabs */}
              <div className="flex bg-[#E4E6E1] p-0.5 rounded-lg border border-[#DDE0DA]">
                <button
                  type="button"
                  onClick={() => setActiveGender("male")}
                  className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md cursor-pointer border-none transition-all ${
                    activeGender === "male"
                      ? "bg-[#3F5B44] text-white shadow-sm"
                      : "bg-transparent text-[#767B82] hover:text-[#14171A]"
                  }`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Male Presets
                </button>
                <button
                  type="button"
                  onClick={() => setActiveGender("female")}
                  className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md cursor-pointer border-none transition-all ${
                    activeGender === "female"
                      ? "bg-[#3F5B44] text-white shadow-sm"
                      : "bg-transparent text-[#767B82] hover:text-[#14171A]"
                  }`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Female Presets
                </button>
              </div>

              {/* Grid of Avatars */}
              <div className="grid grid-cols-4 gap-3 py-2">
                {(activeGender === "male" ? MALE_PRESETS : FEMALE_PRESETS).map((photoUrl, index) => {
                  const isSelected = tempSelectedPhoto === photoUrl;
                  return (
                    <div
                      key={index}
                      onClick={() => setTempSelectedPhoto(photoUrl)}
                      className={`aspect-square rounded-full overflow-hidden border-2 cursor-pointer transition-all relative group active:scale-95 ${
                        isSelected 
                          ? "border-[#3F5B44] shadow-md scale-105" 
                          : "border-transparent hover:border-[#767B82]"
                      }`}
                    >
                      <img 
                        src={photoUrl} 
                        alt={`Preset ${activeGender} ${index}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Checkmark overlay for selected avatar */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#3F5B44]/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions footer */}
            <div className="px-5 py-4 border-t border-[#DDE0DA] bg-[#EBECE8] flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-transparent text-[#767B82] hover:text-[#14171A] border border-[#DDE0DA] rounded text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem("profile_photo", tempSelectedPhoto);
                  setProfilePhoto(tempSelectedPhoto);
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 bg-[#3F5B44] hover:bg-[#324936] text-white border-none rounded text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all shadow-sm"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;