import React, { useState, useEffect, useRef } from "react";
import { login } from "../Services/AuthService";
import { LoginBackground } from "../components/LoginBackground";

type Props = {
  onLogin: (token: string) => void;
  onSwitchToRegister: () => void;
};

function Login({ onLogin, onSwitchToRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isWarping, setIsWarping] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleCardParallax = (e: MouseEvent) => {
      if (isWarping || !cardRef.current) return;
      const xAxis = (window.innerWidth / 2 - e.clientX) / 80;
      const yAxis = (window.innerHeight / 2 - e.clientY) / 80;
      cardRef.current.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    };

    window.addEventListener("mousemove", handleCardParallax);
    return () => {
      window.removeEventListener("mousemove", handleCardParallax);
    };
  }, [isWarping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Authenticate first
      const response = await login({ email, password });
      
      // 2. Play warp transition
      setIsWarping(true);
      
      // 3. Complete login after transition ends
      setTimeout(() => {
        onLogin(response.access_token);
      }, 1200);
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div
      className={`fixed inset-0 w-screen h-screen z-50 flex items-center justify-center font-body-md text-on-surface overflow-hidden bg-[#0b1326] ${
        isWarping ? "warp-active" : ""
      }`}
      style={{ perspective: "1000px" }}
    >
      <style>{`
        .glass-panel {
          background: rgba(30, 41, 59, 0.4);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
          transition: transform 1.2s cubic-bezier(0.7, 0, 0.3, 1), opacity 0.8s ease-out;
        }

        .glowing-input:focus {
          outline: none;
          border-bottom-color: #d2bbff;
          box-shadow: 0 4px 12px -2px rgba(210, 187, 255, 0.3);
        }

        .pulse-animation {
          animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(124, 58, 237, 0.4);
          }
          50% {
            box-shadow: 0 0 25px rgba(124, 58, 237, 0.8);
          }
        }

        /* Warp transition states */
        .warp-active .glass-panel {
          transform: scale(0.8) !important;
          opacity: 0;
          pointer-events: none;
        }

        .warp-active #background-container {
          transform: scale(3);
          transition: transform 2.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        #background-container {
          transition: transform 1s ease-out;
          transform: scale(1);
        }

        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>

      {/* WebGL/Three.js Background */}
      <LoginBackground />

      {/* Main Content Wrapper */}
      <main className="relative z-10 w-full max-w-md px-margin-mobile md:px-0">
        {/* Brand Identity */}
        <header className="fixed top-margin-desktop left-margin-desktop">
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight m-0" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            CareerAI
          </h1>
        </header>

        {/* Login Card */}
        <section
          ref={cardRef}
          className="glass-panel rounded-xl p-10 flex flex-col gap-8 relative text-left"
          id="login-card"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="space-y-2">
            <h2 className="font-headline-lg text-headline-lg text-white m-0" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
              Welcome Back
            </h2>
            <p className="text-on-surface-variant font-body-md text-sm">
              Precision career engineering starts here.
            </p>
          </div>

          <form className="flex flex-col gap-6" id="login-form" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label
                className="font-label-sm text-label-sm text-primary uppercase tracking-widest text-[10px]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-0 bottom-2 text-on-surface-variant">
                  mail
                </span>
                <input
                  className="w-full bg-transparent border-b border-outline-variant py-2 pl-8 text-on-surface glowing-input transition-all placeholder:text-outline-variant text-base"
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
            <div className="flex flex-col gap-2">
              <label
                className="font-label-sm text-label-sm text-primary uppercase tracking-widest text-[10px]"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-0 bottom-2 text-on-surface-variant">
                  lock
                </span>
                <input
                  className="w-full bg-transparent border-b border-outline-variant py-2 pl-8 text-on-surface glowing-input transition-all placeholder:text-outline-variant text-base"
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
              className={`mt-4 py-4 px-6 bg-gradient-to-r from-primary-container to-inverse-primary text-white font-semibold rounded-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 group ${
                isWarping ? "opacity-75 pointer-events-none" : "pulse-animation"
              }`}
              id="login-btn"
              type="submit"
              disabled={isWarping}
            >
              {isWarping ? (
                <>
                  <span className="material-symbols-outlined animate-spin">sync</span>
                  <span>Initiating Warp...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Secondary Links */}
          <footer className="flex flex-col items-center gap-4 pt-4 border-t border-white/5">
            <p className="text-on-surface-variant text-body-md text-sm m-0">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToRegister}
                disabled={isWarping}
                className="text-primary hover:text-white transition-colors underline underline-offset-4 bg-transparent border-none p-0 cursor-pointer"
              >
                Register
              </button>
            </p>
            <a
              className="font-label-sm text-label-sm text-outline hover:text-primary transition-colors no-underline text-[11px]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              Forgot credentials?
            </a>
          </footer>
        </section>

        {/* Status Indicator */}
        <div className="fixed bottom-margin-mobile left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse shadow-[0_0_8px_#89ceff]"></div>
          <span
            className="font-label-sm text-label-sm text-secondary opacity-70 text-[10px]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            AI ENGINE ONLINE
          </span>
        </div>
      </main>
    </div>
  );
}

export default Login;