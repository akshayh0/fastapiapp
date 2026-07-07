type Props = {
  onLogout?: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
};

function NavBar({ onLogout, theme, onToggleTheme }: Props) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("token");
      window.location.reload();
    }
  };

  return (
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

        <div
          className="flex items-center gap-3 pl-4 border-l border-[#DDE0DA] group cursor-pointer hover:border-error transition-colors py-1"
          onClick={handleLogout}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#DDE0DA]">
            <img
              className="w-full h-full object-cover"
              alt="User Portrait"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5nym7eWc31QCAPiezxAEdukWge3mP9sKNFwbaIydCdisy5CCfPHKXrwB4qchcgG0WEVG8m17zjQJdAAApOgKi_2oKDCm6tPRhJU0MzrVIRyGId5YzAcmFdvOhl1M3VK37A2DcDdJr7SMXONJ3_vi793kQVGD83FQOoMLqab7dZl9qMe3FhTUJxIshV8UoM0NTtP428NHSP2BvjaKBHhS2dI6sVI-Av2-dTd0xf1VuaXqUMHKj7rHe"
            />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#767B82] group-hover:text-error transition-colors" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Logout
          </span>
          <span className="material-symbols-outlined text-[18px] text-[#767B82] group-hover:text-error transition-all">
            logout
          </span>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;