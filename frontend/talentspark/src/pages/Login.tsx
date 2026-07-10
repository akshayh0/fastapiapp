import React, { useState, useEffect } from "react";
import { login, register } from "../Services/AuthService";
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

  useEffect(() => {
    setIsActive(initialRegister);
  }, [initialRegister]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);
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
              <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
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

        {/* Sign In Section */}
        <div className="form-container sign-in">
          <form onSubmit={handleSignIn}>
            <h1>Sign In</h1>
            <div className="social-icons">
              <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
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
            <a href="#">Forget Your Password?</a>
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
                onClick={() => toggleMode(false)}
              >
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
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
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;