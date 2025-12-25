import { useState } from "react";
import { useAuth, type Address } from "../../context/AuthContext";
import "../../styles/LoginModal.css";

interface LoginModalProps {
  onClose: () => void;
}

function LoginModal({ onClose }: LoginModalProps) {
  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState<Address>({
    street: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1); // 1: Basic info, 2: Address

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // For registration, handle multi-step
    if (!isLogin && step === 1) {
      // Validate first step
      if (!fullName || !email || password.length < 6) {
        setError("Please fill all fields (password min 6 characters)");
        return;
      }
      setStep(2);
      return;
    }

    setLoading(true);

    try {
      let result;

      if (isLogin) {
        result = await login(email, password);
      } else {
        result = await register({
          fullName,
          email,
          password,
          address,
        });
      }

      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => onClose(), 1500);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
    setStep(1);
    // Reset form
    setEmail("");
    setPassword("");
    setFullName("");
    setAddress({
      street: "",
      city: "",
      stateProvince: "",
      postalCode: "",
      country: "",
    });
  };

  const goBack = () => {
    setStep(1);
    setError("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content login-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>×</button>

        <h2 className="login-title">
          {isLogin ? "Welcome Back" : step === 1 ? "Join the Realm" : "Your Location"}
        </h2>
        <p className="login-sub">
          {isLogin
            ? "Enter your credentials to access"
            : step === 1
              ? "Begin your majestic journey"
              : "Tell us where you're from"}
        </p>

        {/* Step Indicator for Registration */}
        {!isLogin && (
          <div className="step-indicator">
            <div className={`step ${step >= 1 ? "active" : ""}`}>
              <span className="step-number">1</span>
              <span className="step-label">Account</span>
            </div>
            <div className="step-line" />
            <div className={`step ${step >= 2 ? "active" : ""}`}>
              <span className="step-number">2</span>
              <span className="step-label">Address</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="login-message error-message">
            ⚠️ {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="login-message success-message">
            ✓ {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isLogin ? (
            // Login Form
            <>
              <label className="login-label">Email</label>
              <input
                type="email"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                autoComplete="email"
                disabled={loading}
              />

              <label className="login-label">Password</label>
              <input
                type="password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                disabled={loading}
              />
            </>
          ) : step === 1 ? (
            // Registration Step 1: Basic Info
            <>
              <label className="login-label">Full Name</label>
              <input
                type="text"
                className="login-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
                autoComplete="name"
                disabled={loading}
              />

              <label className="login-label">Email</label>
              <input
                type="email"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                autoComplete="email"
                disabled={loading}
              />

              <label className="login-label">Password</label>
              <input
                type="password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                disabled={loading}
              />
            </>
          ) : (
            // Registration Step 2: Address
            <>
              <label className="login-label">Street Address</label>
              <input
                type="text"
                className="login-input"
                value={address.street}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                placeholder="123 Main Street"
                disabled={loading}
              />

              <div className="input-row">
                <div className="input-group">
                  <label className="login-label">City</label>
                  <input
                    type="text"
                    className="login-input"
                    value={address.city}
                    onChange={(e) => handleAddressChange("city", e.target.value)}
                    placeholder="New York"
                    disabled={loading}
                  />
                </div>
                <div className="input-group">
                  <label className="login-label">State/Province</label>
                  <input
                    type="text"
                    className="login-input"
                    value={address.stateProvince}
                    onChange={(e) => handleAddressChange("stateProvince", e.target.value)}
                    placeholder="NY"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label className="login-label">Postal Code</label>
                  <input
                    type="text"
                    className="login-input"
                    value={address.postalCode}
                    onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                    placeholder="10001"
                    disabled={loading}
                  />
                </div>
                <div className="input-group">
                  <label className="login-label">Country</label>
                  <input
                    type="text"
                    className="login-input"
                    value={address.country}
                    onChange={(e) => handleAddressChange("country", e.target.value)}
                    placeholder="United States"
                    disabled={loading}
                  />
                </div>
              </div>
            </>
          )}

          <div className="button-row">
            {!isLogin && step === 2 && (
              <button
                type="button"
                className="btn back-button"
                onClick={goBack}
                disabled={loading}
              >
                <i className="fas fa-arrow-left" /> Back
              </button>
            )}

            <button
              type="submit"
              className={`btn login-button ${loading ? "loading" : ""} ${!isLogin && step === 2 ? "flex-1" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner">
                  <span className="spinner"></span>
                  Processing...
                </span>
              ) : isLogin ? (
                "Login"
              ) : step === 1 ? (
                <>Continue <i className="fas fa-arrow-right" /></>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>

        <div className="toggle-container">
          <p>
            {isLogin ? "New here? " : "Already initiated? "}
            <span className="toggle-link" onClick={toggleMode}>
              {isLogin ? "Create Account" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;