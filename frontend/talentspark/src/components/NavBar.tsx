type Props = {
  onLogout?: () => void;
};

function NavBar({ onLogout }: Props) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("token");
      window.location.reload();
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0b1326]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(124,58,237,0.1)] flex justify-between items-center px-margin-desktop h-16">
      <div className="flex items-center gap-8">
        <span className="text-headline-lg font-headline-lg text-primary tracking-tight" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
          CareerAI
        </span>
        <div className="hidden md:flex items-center bg-[#2d3449]/40 rounded-full px-4 py-1.5 border border-white/5">
          <span className="material-symbols-outlined text-on-surface-variant text-[20px] mr-2">
            search
          </span>
          <input
            className="bg-transparent border-none focus:ring-0 text-label-sm font-label-sm w-48 placeholder:text-on-surface-variant text-sm text-on-surface outline-none"
            placeholder="Search insights..."
            type="text"
            onClick={(e) => e.preventDefault()}
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-on-surface-variant hover:text-primary transition-colors active:scale-95 duration-200 bg-transparent border-none cursor-pointer flex items-center justify-center p-0">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-on-surface-variant hover:text-primary transition-colors active:scale-95 duration-200 bg-transparent border-none cursor-pointer flex items-center justify-center p-0">
          <span className="material-symbols-outlined">settings</span>
        </button>

        <div
          className="flex items-center gap-3 pl-4 border-l border-white/10 group cursor-pointer"
          onClick={handleLogout}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/30">
            <img
              className="w-full h-full object-cover"
              alt="A professional portrait of a tech executive"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5nym7eWc31QCAPiezxAEdukWge3mP9sKNFwbaIydCdisy5CCfPHKXrwB4qchcgG0WEVG8m17zjQJdAAApOgKi_2oKDCm6tPRhJU0MzrVIRyGId5YzAcmFdvOhl1M3VK37A2DcDdJr7SMXONJ3_vi793kQVGD83FQOoMLqab7dZl9qMe3FhTUJxIshV8UoM0NTtP428NHSP2BvjaKBHhS2dI6sVI-Av2-dTd0xf1VuaXqUMHKj7rHe"
            />
          </div>
          <span className="text-label-sm font-label-sm text-on-surface-variant group-hover:text-error transition-colors text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Logout
          </span>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-error">
            logout
          </span>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;