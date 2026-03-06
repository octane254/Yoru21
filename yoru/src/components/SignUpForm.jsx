import { useState } from "react"
import { useNavigate } from "react-router";
import { User, Eye, EyeOff, Mail, Lock, ArrowRight, Loader, CheckCircle } from "lucide-react";


function SignUpForm() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
    setError("");
  }

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

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleAgreeTermsChange = (e) => {
    setAgreeTerms(e.target.checked);
    setError("")
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!fullName.trim()) {
      setError("Full Name is Required")
      return;
    }

    if (fullName.trim().length < 2) {
      setError("Full Name must be at least 2 characters")
      return;
    }

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

    if (!confirmPassword.trim()) {
      setError("Please confirm your Password")
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    setIsLoading(true);

    try {
    const response = await fetch('http://localhost:5000/api/users/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: fullName,
        email: email,
        password: password,
        confirm_password: confirmPassword,
        terms_accepted: agreeTerms
      })
    });

    const data = await response.json();

    if (response.ok) {
      setSuccess(true);

      await new Promise((resolve) => setTimeout(resolve, 5000));

      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setShowConfirmPassword(false);
      setAgreeTerms(false);
      setSuccess(false);
      
      navigate('/login');
    } else {
      setError(data.error || 'Signup failed');
    }
  } catch (error) {
    setError('Network error: ' + error.message);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="sign-up-container">
      <div className="sign-up-wrapper">
        <h1 className="sign-up-title">SIGN UP</h1>

        <form onSubmit={handleSubmit} className="sign-up-form">
          {error && (
            <div className="error-box">
              <p className="error-text">{error}</p>
            </div>
          )}

          {success && (
            <div className="success-box">
              <p className="success-text">Sign Up Successful</p>
            </div>
          )}

          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <div className="input-container">
              <User size={20} className="input-icon" />
              <input
                id="fullName"
                type="text"
                placeholder="Your Name"
                value={fullName}
                onChange={handleFullNameChange}
                disabled={isLoading || success}
                className="form-input"
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Password */}
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
                style={{ paddingRight: '50px' }}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                disabled={isLoading || success}
                className="toggle-btn"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {password && password.length < 8 && (
              <p className="helper-text">Minimum 8 characters required</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <div className="input-container">
              <Lock size={20} className="input-icon" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••••••••"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                disabled={isLoading || success}
                className="form-input"
                style={{ paddingRight: '50px' }}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                disabled={isLoading || success}
                className="toggle-btn"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="helper-text">Passwords do not match</p>
            )}
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <input
              id="agreeTerms"
              type="checkbox"
              checked={agreeTerms}
              onChange={handleAgreeTermsChange}
              disabled={isLoading || success}
              style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                accentColor: '#ffffff'
              }}
            />
            <label htmlFor="agreeTerms" style={{ 
              color: '#ffffff', 
              cursor: 'pointer',
              marginBottom: '0',
              fontSize: '14px'
            }}>
              I agree to the{' '}
              <a href="#terms" style={{ color: '#ffffff', textDecoration: 'underline' }}>
                Terms & Conditions
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || success || !fullName || !email || !password || !confirmPassword || !agreeTerms}
            className="submit-btn"
          >
            {isLoading ? (
              <>
                <Loader size={20} className="loader-spin" />
                SIGNING UP
              </>
            ) : success ? (
              <>
                <CheckCircle size={20} />
                SUCCESS
              </>
            ) : (
              <>
                SIGN UP
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <p className="form-footer">
          Already have an account?{' '}
          <a href="/" className="signup-link">
            LOGIN
          </a>
        </p>
      </div>
    </div>
  )
}

export default SignUpForm;