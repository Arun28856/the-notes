import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate, Link } from 'react-router';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3003/api/auth/register', formData);
      toast.success(res.data.message);
      navigate('/verify', { state: { email: formData.email } });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Google Sign In clicked');
    console.log('Redirecting to:', 'http://localhost:3003/api/auth/google');
    window.location.href = 'http://localhost:3003/api/auth/google';
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="absolute inset-0 -z-10 h-full w-full bg-black" />
      
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-black/40 backdrop-blur-md border border-[#00FF9D]/20 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00FF9D]/10 rounded-full mb-4">
              <UserPlus className="size-8 text-[#00FF9D]" />
            </div>
            <h2 className="text-3xl font-bold text-[#00FF9D] mb-2">Welcome Back</h2>
            <p className="text-base-content/70">Sign in with Google or create a new account</p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 transition-all duration-200 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-3 mb-6"
          >
            <svg className="size-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#00FF9D]/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-black/40 text-base-content/60">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-base-content/90 mb-2">
                <User className="inline size-4 mr-2" />
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/30 border border-[#00FF9D]/20 rounded-lg focus:outline-none focus:border-[#00FF9D]/50 text-base-content transition-all"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content/90 mb-2">
                <Mail className="inline size-4 mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/30 border border-[#00FF9D]/20 rounded-lg focus:outline-none focus:border-[#00FF9D]/50 text-base-content transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-base-content/90 mb-2">
                <Lock className="inline size-4 mr-2" />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/30 border border-[#00FF9D]/20 rounded-lg focus:outline-none focus:border-[#00FF9D]/50 text-base-content transition-all"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00FF9D]/10 hover:bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/30 hover:border-[#00FF9D]/50 transition-all duration-200 px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-base-content/70">
              Already have an account?{' '}
              <Link to="/login" className="text-[#00FF9D] hover:text-[#00FF9D]/80 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
