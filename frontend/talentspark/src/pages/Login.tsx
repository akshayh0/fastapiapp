import React, { useState, useEffect, useRef } from "react";
import { login } from "../Services/AuthService";

type Props = {
  onLogin: (token: string) => void;
  onSwitchToRegister: () => void;
};

function Login({ onLogin, onSwitchToRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isWarping, setIsWarping] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      setIsWarping(true);
      setTimeout(() => {
        onLogin(response.access_token);
      }, 500);
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please check your credentials.");
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
          id="login-card"
        >
          {/* Manila Folder Tab */}
          <div className="folder-tab">USER CREDENTIAL SCAN</div>

          <div className="space-y-1">
            <h2 className="text-[32px] text-[#14171A] font-bold m-0 leading-tight" style={{ fontFamily: "'Space Mono', monospace" }}>
              Welcome Back
            </h2>
            <p className="text-[#767B82] text-xs font-mono uppercase">
              [ Secure Port Authenticate ]
            </p>
          </div>

          <form className="flex flex-col gap-5" id="login-form" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-[10px] font-bold uppercase tracking-widest text-[#767B82] font-mono"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative group">
                <input
                  className="modern-input w-full py-2.5 px-3 text-xs text-[#14171A]"
                  id="email"
                  placeholder="professional@career.ai"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isWarping}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-[10px] font-bold uppercase tracking-widest text-[#767B82] font-mono"
                htmlFor="password"
              >
                Password Code
              </label>
              <div className="relative group">
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
            </div>

            {/* CTA */}
            <button
              className="mt-2 py-3 px-6 bg-[#3F5B44] text-white font-bold rounded font-mono text-xs hover:opacity-90 active:scale-95 transition-all duration-100 flex items-center justify-center gap-2 border-none cursor-pointer disabled:opacity-50"
              id="login-btn"
              type="submit"
              disabled={isWarping}
            >
              {isWarping ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <span>SIGN IN</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Secondary Links */}
          <footer className="flex flex-col items-center gap-3 pt-4 border-t border-[#DDE0DA]">
            <p className="text-[#767B82] text-xs m-0 font-mono">
              DON'T HAVE AN ACCOUNT?{" "}
              <button
                type="button"
                onClick={onSwitchToRegister}
                disabled={isWarping}
                className="text-[#3F5B44] hover:underline bg-transparent border-none p-0 cursor-pointer font-bold font-mono"
              >
                REGISTER
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

export default Login;