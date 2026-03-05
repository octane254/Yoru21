import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader, CheckCircle } from "lucide-react";


function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSuccess(true);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setEmail("");
      setPassword("");
      setShowPassword(false);
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <h1 className="login-title">LOGIN</h1>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-box">
              <p className="error-text">{error}</p>
            </div>
          )}

          {success && (
            <div className="success-box">
              <p className="success-text">Login Successful</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <div className="input-container">
              <Mail size={20} className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={handleEmailChange}
                disabled={isLoading || success}
                className="form-input"
              />
              {email && isValidEmail(email) && (
                <span className="validation-icon">✓</span>
              )}
            </div>
            {email && !isValidEmail(email) && (
              <p className="helper-text">Invalid email format</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-container">
              <Lock size={20} className="input-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••••"
                value={password}
                onChange={handlePasswordChange}
                disabled={isLoading || success}
                className="form-input"
                style={{ paddingRight: "50px" }}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                disabled={isLoading || success}
                className="toggle-btn"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
            {password && password.length < 8 && (
              <p className="helper-text">Minimum 8 characters required</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || success || !email || !password}
            className="submit-btn"
          >
            {isLoading ? (
              <>
                <Loader size={20} className="loader-spin" />
                SIGNING IN
              </>
            ) : success ? (
              <>
                <CheckCircle size={20} />
                SUCCESS
              </>
            ) : (
              <>
                SIGN IN
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <p className="form-footer">
          Don't have an account?{" "}
          <a href="#sign-up" className="signup-link">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;