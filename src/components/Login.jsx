import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const formatAuthError = (err) => {
  const data = err?.response?.data;
  if (typeof data === "string" && data.trim()) return data.replace(/^ERROR\s*:?\s*/i, "");
  if (data?.message) return data.message;
  if (!err?.response) {
    return "Could not reach the server. If you are on localhost, make sure the API is running and CORS allows this port.";
  }
  return "Something went wrong";
};

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/feed");
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/signup`,
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      navigate("/profile");
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) handleLogin();
    else handleSignUp();
  };

  return (
    <div className="page-shell flex flex-col">
      <header className="page-wrap px-4 h-14 flex items-center">
        <Link to="/" className="text-sm font-semibold tracking-tight">
          ByteFlame
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-[400px] surface-card p-6 md:p-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="page-sub">
            {isLogin ? "Sign in to keep matching." : "A minute to set up. Then discover people."}
          </p>

          {!isLogin && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              <input
                className="input-field"
                type="text"
                placeholder="First name"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                className="input-field"
                type="text"
                placeholder="Last name"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          )}

          <input
            className={`input-field ${isLogin ? "mt-6" : "mt-3"}`}
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
          />

          <div className="relative mt-3">
            <input
              className="input-field pr-12"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-400 px-2 min-h-10"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {!isLogin && (
            <p className="text-xs text-zinc-500 mt-3 leading-relaxed">
              First name at least 4 letters. Password: 8+ characters with upper, lower, number, and symbol.
            </p>
          )}

          {error && (
            <div className="mt-4 text-sm text-rose-300 bg-rose-950/40 border border-rose-900/60 rounded-xl px-3 py-2" role="alert">
              {String(error)}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full mt-5">
            {loading ? "Working…" : isLogin ? "Sign in" : "Sign up"}
          </button>

          <p className="text-center text-sm text-zinc-500 mt-5">
            {isLogin ? "No account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-rose-400 font-medium"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </form>
      </main>
    </div>
  );
};

export default AuthForm;
