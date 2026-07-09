import React, { useState, useRef } from "react";
import { register } from "../Services/AuthService";

type Props = {
  onSwitchToLogin: () => void;
};

function Register({ onSwitchToLogin }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isWarping, setIsWarping] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ name, email, password, role });
      setIsWarping(true);
      setTimeout(() => {
        alert("Registration successful! Please login.");
        onSwitchToLogin();
      }, 500);
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 w-screen h-screen z-50 flex items-center justify-center overflow-hidden bg-[#F4F5F2]"
      style={{ perspective: "1000px" }}
    >
      {/* Main Content Wrapper */}
      <main className="relative z-10 w-full max-w-md px-4">
        {/* Brand Identity */}
        <header className="absolute -top-16 left-0">
          <span className="text-xl font-bold uppercase tracking-widest text-[#14171A]" style={{ fontFamily: "'Space Mono', monospace" }}>
            CAREER.AI
          </span>
        </header>

        <section
          ref={cardRef}
          className="antigravity-card p-8 flex flex-col gap-6 relative text-left animate-fade-in-up"
          id="register-card"
        >
          {/* Manila Folder Tab */}
          <div className="folder-tab">NEW RECORD CREATION</div>

          <div className="space-y-1">
            <h2 className="text-[32px] text-[#14171A] font-bold m-0 leading-tight" style={{ fontFamily: "'Space Mono', monospace" }}>
              Join CareerAI
            </h2>
            <p className="text-[#767B82] text-xs font-mono uppercase">
              [ Open Career Dossier file ]
            </p>
          </div>

          <form className="flex flex-col gap-4" id="register-form" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="flex flex-col gap-1">
              <label
                className="text-[10px] font-bold uppercase tracking-widest text-[#767B82] font-mono"
                htmlFor="name"
              >
                Full Name
              </label>
              <input
                className="modern-input w-full py-2.5 px-3 text-xs text-[#14171A]"
                id="name"
                placeholder="Jane Doe"
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isWarping}
              />
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1">
              <label
                className="text-[10px] font-bold uppercase tracking-widest text-[#767B82] font-mono"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                className="modern-input w-full py-2.5 px-3 text-xs text-[#14171A]"
                id="email"
                placeholder="jane.doe@career.ai"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isWarping}
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1">
              <label
                className="text-[10px] font-bold uppercase tracking-widest text-[#767B82] font-mono"
                htmlFor="password"
              >
                Password Code
              </label>
              <input
                className="modern-input w-full py-2.5 px-3 text-xs text-[#14171A]"
                id="password"
                placeholder="••••••••"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isWarping}
              />
            </div>

            {/* Role Field */}
            <div className="flex flex-col gap-1">
              <label
                className="text-[10px] font-bold uppercase tracking-widest text-[#767B82] font-mono"
                htmlFor="role"
              >
                Professional Role
              </label>
              <input
                className="modern-input w-full py-2.5 px-3 text-xs text-[#14171A]"
                id="role"
                placeholder="e.g. Developer, Admin, Candidate"
                required
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isWarping}
              />
            </div>

            {/* CTA */}
            <button
              className="mt-2 py-3 px-6 bg-[#3F5B44] text-white font-bold rounded font-mono text-xs hover:opacity-90 active:scale-95 transition-all duration-100 flex items-center justify-center gap-2 border-none cursor-pointer disabled:opacity-50"
              id="register-btn"
              type="submit"
              disabled={isWarping}
            >
              {isWarping ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                  <span>CREATING RECORD...</span>
                </>
              ) : (
                <>
                  <span>CREATE DOSSIER</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Secondary Links */}
          <footer className="flex flex-col items-center gap-3 pt-4 border-t border-[#DDE0DA]">
            <p className="text-[#767B82] text-xs m-0 font-mono">
              ALREADY REGISTERED?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                disabled={isWarping}
                className="text-[#3F5B44] hover:underline bg-transparent border-none p-0 cursor-pointer font-bold font-mono"
              >
                SIGN IN
              </button>
            </p>
          </footer>
        </section>

        {/* Status Indicator */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-[#3F5B44]"></div>
          <span
            className="text-[9px] text-[#767B82] font-mono tracking-wider"
          >
            SECURE CHANNEL ACTIVE
          </span>
        </div>
      </main>
    </div>
  );
}

export default Register;
