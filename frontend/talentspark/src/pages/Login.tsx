import React, { useState, useEffect } from "react";
import { login, register, resetPassword, resetPasswordDirect } from "../Services/AuthService";
import "./Login.css";

type Props = {
  onLogin: (token: string) => void;
  initialRegister?: boolean;
  onModeChange?: (mode: "login" | "register") => void;
};

function Login({ onLogin, initialRegister = false, onModeChange }: Props) {
  const [isActive, setIsActive] = useState(initialRegister);

  // Sign In states
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  // Sign Up states
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpRole, setSignUpRole] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signUpSuccess, setSignUpSuccess] = useState<string | null>(null);

  // Forgot Password states
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotName, setForgotName] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  // Reset Password states
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  useEffect(() => {
    setIsActive(initialRegister);
  }, [initialRegister]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("reset_token");
    if (token) {
      setResetToken(token);
      // Clean query parameters from URL for aesthetics and security
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);


  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);

    if (!signInEmail.toLowerCase().endsWith("@gmail.com")) {
      setSignInError("Only @gmail.com email addresses are allowed.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await login({ email: signInEmail, password: signInPassword });
      onLogin(response.access_token);
    } catch (err: any) {
      console.error("Sign in failed:", err);
      const msg = err.response?.data?.detail || err.message || "Failed to sign in. Please check your credentials.";
      setSignInError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError(null);
    setSignUpSuccess(null);

    if (!signUpEmail.toLowerCase().endsWith("@gmail.com")) {
      setSignUpError("Only @gmail.com email addresses are allowed.");
      return;
    }

    setIsRegistering(true);

    try {
      await register({
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword,
        role: signUpRole,
      });
      setSignUpSuccess("Registration successful! You can now sign in.");
      // Clear inputs
      setSignUpName("");
      setSignUpEmail("");
      setSignUpPassword("");
      setSignUpRole("");
      
      // Auto-slide to login after 1.5 seconds
      setTimeout(() => {
        setIsActive(false);
        if (onModeChange) onModeChange("login");
      }, 1500);
    } catch (err: any) {
      console.error("Sign up failed:", err);
      const msg = err.response?.data?.detail || err.message || "Failed to create account. Please try again.";
      setSignUpError(msg);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);

    if (!forgotEmail.toLowerCase().endsWith("@gmail.com")) {
      setForgotError("Only @gmail.com email addresses are allowed.");
      return;
    }

    setForgotSubmitting(true);

    try {
      const response = await resetPasswordDirect(forgotName, forgotEmail, forgotNewPassword);
      setForgotSuccess(response.message || "Password reset successfully!");
      setForgotName("");
      setForgotEmail("");
      setForgotNewPassword("");
      setTimeout(() => {
        setIsForgotPassword(false);
        setForgotSuccess(null);
      }, 2000);
    } catch (err: any) {
      console.error("Forgot password failed:", err);
      const msg = err.response?.data?.detail || err.message || "Failed to reset password. Please check your credentials.";
      setForgotError(msg);
    } finally {
      setForgotSubmitting(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetSuccess(null);
    setResetSubmitting(true);

    try {
      if (!resetToken) throw new Error("No reset token available.");
      await resetPassword(resetToken, newPassword);
      setResetSuccess("Password reset successfully! You can now sign in.");
      setNewPassword("");
      setTimeout(() => {
        setResetToken(null);
        setIsForgotPassword(false);
        setIsActive(false);
      }, 2000);
    } catch (err: any) {
      console.error("Reset password failed:", err);
      const msg = err.response?.data?.detail || err.message || "Failed to reset password. The link may have expired.";
      setResetError(msg);
    } finally {
      setResetSubmitting(false);
    }
  };

  const toggleMode = (active: boolean) => {
    setIsActive(active);
    if (onModeChange) {
      onModeChange(active ? "register" : "login");
    }
    // Clear notifications on swap
    setSignInError(null);
    setSignUpError(null);
    setSignUpSuccess(null);
  };

  return (
    <div className="auth-page-wrapper">
      <div className={`container ${isActive ? "active" : ""}`} id="container">
        
        {/* Sign Up Section */}
        <div className="form-container sign-up">
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            <div className="social-icons">
              <a href="https://github.com/akshayh0" target="_blank" rel="noopener noreferrer" className="icon" title="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/akshay0/" target="_blank" rel="noopener noreferrer" className="icon" title="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
            <span>or use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              required
              disabled={isRegistering}
            />
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              required
              disabled={isRegistering}
            />
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              required
              disabled={isRegistering}
            />
            <input
              type="text"
              placeholder="Professional Role"
              value={signUpRole}
              onChange={(e) => setSignUpRole(e.target.value)}
              required
              disabled={isRegistering}
            />
            {signUpError && <div className="error-message">{signUpError}</div>}
            {signUpSuccess && <div className="success-message">{signUpSuccess}</div>}
            <button type="submit" disabled={isRegistering}>
              {isRegistering ? (
                <>
                  <span className="loading-spinner"></span>
                  Signing Up...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        </div>

        {/* Sign In / Forgot Password / Reset Password Section */}
        <div className="form-container sign-in">
          {resetToken ? (
            <form onSubmit={handleResetPasswordSubmit}>
              <h1>Reset Password</h1>
              <p style={{ fontSize: "12px", color: "var(--graphite)", textAlign: "center", marginBottom: "15px" }}>
                Enter your new password below to update your account access.
              </p>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={resetSubmitting}
              />
              {resetError && <div className="error-message">{resetError}</div>}
              {resetSuccess && <div className="success-message">{resetSuccess}</div>}
              <button type="submit" disabled={resetSubmitting}>
                {resetSubmitting ? (
                  <>
                    <span className="loading-spinner"></span>
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setResetToken(null);
                  setIsForgotPassword(false);
                }}
                style={{ marginTop: "15px" }}
              >
                Back to Sign In
              </a>
            </form>
          ) : isForgotPassword ? (
            <form onSubmit={handleForgotPasswordSubmit}>
              <h1>Forgot Password</h1>
              <p style={{ fontSize: "12px", color: "var(--graphite)", textAlign: "center", marginBottom: "15px" }}>
                Enter your username, registered Gmail, and a new password code.
              </p>
              <input
                type="text"
                placeholder="Username"
                value={forgotName}
                onChange={(e) => setForgotName(e.target.value)}
                required
                disabled={forgotSubmitting}
              />
              <input
                type="email"
                placeholder="Email Address"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                disabled={forgotSubmitting}
              />
              <input
                type="password"
                placeholder="New Password Code"
                value={forgotNewPassword}
                onChange={(e) => setForgotNewPassword(e.target.value)}
                required
                disabled={forgotSubmitting}
              />
              {forgotError && <div className="error-message">{forgotError}</div>}
              {forgotSuccess && <div className="success-message">{forgotSuccess}</div>}
              <button type="submit" disabled={forgotSubmitting}>
                {forgotSubmitting ? (
                  <>
                    <span className="loading-spinner"></span>
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsForgotPassword(false);
                  setForgotError(null);
                  setForgotSuccess(null);
                  setForgotName("");
                  setForgotEmail("");
                  setForgotNewPassword("");
                }}
                style={{ marginTop: "15px" }}
              >
                Back to Sign In
              </a>
            </form>
          ) : (
            <form onSubmit={handleSignIn}>
              <h1>Sign In</h1>
              <div className="social-icons">
                <a href="https://github.com/akshayh0" target="_blank" rel="noopener noreferrer" className="icon" title="GitHub">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/akshay0/" target="_blank" rel="noopener noreferrer" className="icon" title="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
              <span>or use your email password</span>
              <input
                type="email"
                placeholder="Email"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <input
                type="password"
                placeholder="Password"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsForgotPassword(true);
                  setSignInError(null);
                }}
              >
                Forget Your Password?
              </a>
              {signInError && <div className="error-message">{signInError}</div>}
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner"></span>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          )}
        </div>

        {/* Toggle Panels Overlay */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button
                type="button"
                className="hidden"
                id="login"
                onClick={() => {
                  setIsForgotPassword(false);
                  toggleMode(false);
                }}
              >
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              {resetToken ? (
                <>
                  <h1>Secure Reset</h1>
                  <p>A secure link has been validated. Please choose a strong new password to restore your account access.</p>
                </>
              ) : isForgotPassword ? (
                <>
                  <h1>Need Access?</h1>
                  <p>Request a secure password reset link or return to register an account.</p>
                  <button
                    type="button"
                    className="hidden"
                    id="register"
                    onClick={() => {
                      setIsForgotPassword(false);
                      toggleMode(true);
                    }}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <h1>Hello, Friend!</h1>
                  <p>Register with your personal details to use all of site features</p>
                  <button
                    type="button"
                    className="hidden"
                    id="register"
                    onClick={() => toggleMode(true)}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;