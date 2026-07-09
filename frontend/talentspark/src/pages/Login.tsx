import React, { useState, useEffect, useRef } from "react";
import { login } from "../Services/AuthService";

type Props = {
  onLogin: (token: string) => void;
  onSwitchToRegister: () => void;
};

type TransitionPhase = "idle" | "submitting" | "stamping-success" | "stamping-failed" | "closing";

function Login({ onLogin, onSwitchToRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [errorText, setErrorText] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotionRef = useRef(false);

  useEffect(() => {
    prefersReducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const isProcessing = phase !== "idle";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);

    const prefersReduced = prefersReducedMotionRef.current;

    if (prefersReduced) {
      setPhase("submitting");
      try {
        const response = await login({ email, password });
        onLogin(response.access_token);
      } catch (error: any) {
        console.error("Error during login:", error);
        setErrorText(error.message || "AUTHENTICATION SYSTEM DENIED STATUS");
        setPhase("idle");
      }
      return;
    }

    // Normal animated sequence
    setPhase("submitting");
    let apiSuccess = false;
    let apiToken: string | null = null;
    let apiErrorMsg = "AUTHENTICATION SYSTEM DENIED STATUS";

    // Start API call immediately (optimistic UI starts running 0-150ms button animation)
    const apiPromise = login({ email, password })
      .then((response) => {
        apiSuccess = true;
        apiToken = response.access_token;
      })
      .catch((err) => {
        apiSuccess = false;
        apiErrorMsg = err.message || "AUTHENTICATION SYSTEM DENIED STATUS";
      });

    // Step 1 finishes at 150ms. Wait for API to finish.
    setTimeout(async () => {
      await apiPromise;

      if (apiSuccess && apiToken) {
        // Step 2: Stamp impression drops (ACCESS GRANTED)
        setPhase("stamping-success");

        // Hold stamp for 150ms (takes 150ms to 300ms)
        setTimeout(() => {
          // Step 3: Card closes (300ms to 450ms)
          setPhase("closing");

          // Hold closing animation for 150ms
          setTimeout(() => {
            if (apiToken) onLogin(apiToken);
          }, 150);
        }, 150);
      } else {
        // Step 2 (failed): Stamp impression drops (DECLINED)
        setPhase("stamping-failed");

        // Hold stamp for 550ms (120ms drop + 280ms hold + 150ms fade out)
        setTimeout(() => {
          setPhase("idle");
          setErrorText(apiErrorMsg);
        }, 550);
      }
    }, 150);
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
          className={`antigravity-card p-8 flex flex-col gap-6 relative text-left ${
            phase === "closing"
              ? "opacity-0 scale-[0.96] transition-all duration-150 ease-out"
              : "animate-fade-in-up"
          }`}
          id="login-card"
        >
          {/* Manila Folder Tab */}
          <div className="folder-tab">USER CREDENTIAL SCAN</div>

          {/* Sweeping Line for step 3 folder closing */}
          {phase === "closing" && <div className="sweeping-line animate-sweep" />}

          {/* Stamp Impression overlay */}
          {(phase === "stamping-success" || phase === "stamping-failed") && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 bg-transparent">
              <div
                className={`large-stamp ${
                  phase === "stamping-failed" ? "declined" : "animate-stamp-drop"
                }`}
              >
                {phase === "stamping-success" ? "ACCESS GRANTED" : "DECLINED"}
              </div>
            </div>
          )}

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
                  disabled={isProcessing}
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
                  disabled={isProcessing}
                />
              </div>
              {errorText && (
                <div className="text-[10px] text-[#767B82] font-mono uppercase tracking-wide mt-1">
                  [ ERR: {errorText.toUpperCase()} ]
                </div>
              )}
            </div>

            {/* CTA */}
            <button
              className={`mt-2 py-3 px-6 text-white font-bold rounded font-mono text-xs hover:opacity-90 active:scale-95 transition-all duration-100 flex items-center justify-center gap-2 border-none cursor-pointer relative overflow-hidden ${
                isProcessing
                  ? "bg-[#DDE0DA] text-[#14171A] btn-ink-spread-active"
                  : "bg-[#3F5B44]"
              }`}
              id="login-btn"
              type="submit"
              disabled={isProcessing}
            >
              {/* The spreading ink background */}
              {isProcessing && <div className="btn-ink-spread-bg" />}

              {/* Button content with z-index to stay above the spreading background */}
              <div className="relative z-10 w-full h-4 flex items-center justify-center">
                <span
                  className={`absolute transition-opacity duration-150 flex items-center gap-2 ${
                    phase === "submitting" || phase === "stamping-success" || phase === "closing"
                      ? "opacity-0"
                      : "opacity-100"
                  }`}
                >
                  <span>SIGN IN</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
                <span
                  className={`absolute transition-opacity duration-150 font-mono ${
                    phase === "submitting" || phase === "stamping-success" || phase === "closing"
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                >
                  VERIFIED
                </span>
              </div>
            </button>
          </form>

          {/* Secondary Links */}
          <footer className="flex flex-col items-center gap-3 pt-4 border-t border-[#DDE0DA]">
            <p className="text-[#767B82] text-xs m-0 font-mono">
              DON'T HAVE AN ACCOUNT?{" "}
              <button
                type="button"
                onClick={onSwitchToRegister}
                disabled={isProcessing}
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