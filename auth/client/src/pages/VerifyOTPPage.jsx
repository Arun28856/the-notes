import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate, useLocation } from 'react-router';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShieldCheck, MailCheck, RefreshCw } from 'lucide-react';

export const VerifyOTPPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  if (!email) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      toast.error('Please enter OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3003/api/auth/verify-otp', { email, otp });
      toast.success(res.data.message);
      
      // Store token and redirect to notes app
      if (res.data.token) {
        const redirectUrl = `http://localhost:5173/?token=${res.data.token}&name=${encodeURIComponent(res.data.user.name)}`;
        window.location.href = redirectUrl;
      } else {
        navigate('/success');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await axios.post('http://localhost:3003/api/auth/resend-otp', { email });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="absolute inset-0 -z-10 h-full w-full bg-black" />
      
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-black/40 backdrop-blur-md border border-[#00FF9D]/20 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00FF9D]/10 rounded-full mb-4">
              <MailCheck className="size-8 text-[#00FF9D]" />
            </div>
            <h2 className="text-3xl font-bold text-[#00FF9D] mb-2">Verify Email</h2>
            <p className="text-base-content/70 mb-2">Enter the OTP sent to</p>
            <p className="text-[#00FF9D] font-medium">{email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-base-content/90 mb-2">
                <ShieldCheck className="inline size-4 mr-2" />
                OTP Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-[#00FF9D]/20 rounded-lg focus:outline-none focus:border-[#00FF9D]/50 text-base-content text-center text-2xl tracking-widest transition-all"
                placeholder="000000"
                maxLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00FF9D]/10 hover:bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/30 hover:border-[#00FF9D]/50 transition-all duration-200 px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="w-full bg-transparent hover:bg-white/5 text-base-content/70 hover:text-base-content border border-white/10 hover:border-white/20 transition-all duration-200 px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <RefreshCw className={`size-4 ${resending ? 'animate-spin' : ''}`} />
              {resending ? 'Resending...' : 'Resend OTP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPPage;
