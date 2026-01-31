import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Mail, Lock, LogIn, UserPlus, ShieldCheck } from "lucide-react";
import api from "../lib/api";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (value) => EMAIL_REGEX.test(value?.trim() ?? "");

/** Get domain from email (e.g. "user@gmal.com" -> "gmal.com") */
const getEmailDomain = (email) => {
  const trimmed = (email || "").trim().toLowerCase();
  const at = trimmed.lastIndexOf("@");
  return at === -1 ? null : trimmed.slice(at + 1);
};

/** Common domain typos -> correct domain (instant feedback, no API) */
const COMMON_DOMAIN_TYPOS = {
  gmal: "gmail",
  gmai: "gmail",
  gmial: "gmail",
  yaho: "yahoo",
  outlok: "outlook",
  hotmal: "hotmail",
};
const getDomainTypoSuggestion = (domain) => {
  if (!domain) return null;
  const base = domain.replace(/\.(com|org|net|co\.\w+)$/i, "").toLowerCase();
  return COMMON_DOMAIN_TYPOS[base] || null;
};

const isPasswordValid = (value) => {
  if (!value || value.length < 6) return false;
  return /[a-zA-Z0-9]/.test(value);
};

const GoogleIcon = () => (
  <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { currentUser, login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      toast.success("Signed in successfully!");
      navigate("/", { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email?.trim() || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isLogin) {
      if (!isValidEmail(email)) {
        toast.error("Please enter a valid email address");
        return;
      }
      const domain = getEmailDomain(email);
      const typoSuggestion = getDomainTypoSuggestion(domain);
      if (typoSuggestion) {
        toast.error(`This domain doesn't exist. Did you mean ${typoSuggestion}.com?`);
        return;
      }
      if (!isPasswordValid(password)) {
        toast.error("Password must be at least 6 characters and contain at least one letter or number");
        return;
      }
    } else {
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        toast.success("Logged in successfully!");
        navigate("/");
      } else {
        const { data } = await api.post("/api/validate-email", { email: email.trim() });
        if (data?.valid === false) {
          if (data.suggestion) {
            toast.error(`This domain doesn't exist. Did you mean ${data.suggestion}?`);
          } else {
            toast.error(data.error || "This email domain does not exist or cannot receive email.");
          }
          setLoading(false);
          return;
        }
        await signup(email, password);
        toast.success("Account created successfully!");
        navigate("/");
      }
    } catch (error) {
      if (error.response?.data?.valid === false) {
        const { suggestion, error: msg } = error.response.data;
        if (suggestion) {
          toast.error(`This domain doesn't exist. Did you mean ${suggestion}?`);
        } else {
          toast.error(msg || "This email domain does not exist.");
        }
        setLoading(false);
        return;
      }
      let errorMessage = "An error occurred";
      
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/email-already-in-use":
          errorMessage = "This email is already registered. Please sign in instead.";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection";
          break;
        default:
          errorMessage = error.message || "An error occurred";
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Signed in with Google!");
      navigate("/", { replace: true });
    } catch (error) {
      let errorMessage = "Could not sign in with Google";
      switch (error.code) {
        case "auth/account-exists-with-different-credential":
          errorMessage = "An account already exists with the same email. Try signing in with email/password.";
          break;
        case "auth/popup-closed-by-user":
          errorMessage = "Sign-in was cancelled.";
          break;
        case "auth/popup-blocked":
          errorMessage = "Popup was blocked. Redirecting to Google...";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-black/40 backdrop-blur-md border border-[#00FF9D]/20 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#00FF9D] font-mono tracking-tight mb-2">
              The Notes
            </h1>
            <p className="text-gray-400">
              {isLogin ? "Welcome back!" : "Create your account"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00FF9D]/60 size-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-black/30 border border-[#00FF9D]/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF9D]/50 focus:ring-2 focus:ring-[#00FF9D]/20 transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00FF9D]/60 size-5" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-black/30 border border-[#00FF9D]/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00FF9D]/50 focus:ring-2 focus:ring-[#00FF9D]/20 transition-all"
                  placeholder={isLogin ? "••••••••" : "Min 6 characters, one letter or number"}
                  required
                  minLength={6}
                />
              </div>
              {!isLogin && (
                <p className="mt-1.5 text-xs text-gray-500">
                  At least 6 characters with one letter or number
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00FF9D]/10 hover:bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/30 hover:border-[#00FF9D]/50 transition-all duration-200 px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="size-5 border-2 border-[#00FF9D]/30 border-t-[#00FF9D] rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  {isLogin ? (
                    <>
                      <LogIn className="size-5" />
                      <span>Sign In</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="size-5" />
                      <span>Sign Up</span>
                    </>
                  )}
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#00FF9D]/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black/40 text-gray-400">or continue with</span>
              </div>
            </div>

            {/* Sign in with Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading || googleLoading}
              className="w-full bg-white/5 hover:bg-white/10 text-gray-200 border border-white/20 hover:border-white/30 transition-all duration-200 px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <>
                  <div className="size-5 border-2 border-gray-400/30 border-t-gray-300 rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <GoogleIcon />
                  <span>Sign in with Google</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle between Login and SignUp */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setEmail("");
                  setPassword("");
                }}
                className="text-[#00FF9D] hover:text-[#00FF9D]/80 font-medium transition-colors"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
