import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import toast from 'react-hot-toast';

export const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const name = searchParams.get('name');
    
    if (token) {
      // Store token in localStorage or handle it as needed
      localStorage.setItem('authToken', token);
      toast.success('Successfully signed in with Google!');
    }
    
    if (name) {
      setUserName(decodeURIComponent(name));
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="absolute inset-0 -z-10 h-full w-full bg-black" />
      
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-black/40 backdrop-blur-md border border-[#00FF9D]/20 rounded-2xl p-8 shadow-xl text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#00FF9D]/10 rounded-full mb-6">
            <CheckCircle2 className="size-12 text-[#00FF9D]" />
          </div>
          
          <h2 className="text-3xl font-bold text-[#00FF9D] mb-4">
            {userName ? `Welcome, ${userName}!` : 'Verification Successful!'}
          </h2>
          <p className="text-base-content/80 mb-8 text-lg">
            {userName 
              ? 'You have successfully signed in with Google.' 
              : 'Your email has been verified successfully. Your account is now active!'}
          </p>

          <div className="space-y-4">
            <div className="bg-black/30 border border-[#00FF9D]/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#00FF9D] mb-2">What's Next?</h3>
              <p className="text-base-content/70">
                You can now access all features of the application. Start exploring and enjoy!
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#00FF9D]/10 hover:bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/30 hover:border-[#00FF9D]/50 transition-all duration-200 px-6 py-3 rounded-lg font-medium"
            >
              Go to Home
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
