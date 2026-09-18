import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import api from '../utils/api';
import ClinicLogo from '../components/client/ClinicLogo';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Instant bypass for test/overview credentials without database
    if (email === 'admin@gmail.com' && password === '123456') {
      const mockUser = {
        id: 1,
        name: 'Clinic Administrator',
        email: 'admin@gmail.com',
        role: 'admin',
        userType: 'Super Admin',
      };
      localStorage.setItem('accessToken', 'mock-admin-token-sharnam-demo');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setTimeout(() => {
        setLoading(false);
        navigate('/admin');
      }, 300);
      return;
    }

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      if (response.data.status && response.data.result.accessToken) {
        localStorage.setItem('accessToken', response.data.result.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.result.user));
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 sm:p-6 font-body-md selection:bg-primary-fixed selection:text-primary">
      
      {/* Centered Admin Login Card */}
      <div className="w-full max-w-[440px] bg-surface-container-lowest rounded-3xl shadow-[0_12px_45px_rgba(0,0,0,0.06)] border border-outline-variant/70 p-8 sm:p-10 transition-all">
        
        {/* Clinic Logo */}
        <div className="flex justify-center mb-6">
          <ClinicLogo size="lg" />
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-8">
          <h1 className="font-headline-md text-[26px] sm:text-[28px] font-bold text-on-surface leading-snug">
            Welcome to Sharnam Clinic
          </h1>
          <p className="font-body-md text-on-surface-variant text-[14px] sm:text-[15px] mt-1.5">
            Secure access to your admin portal.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {error && (
            <div className="bg-error-container text-on-error-container p-3.5 rounded-xl text-sm flex items-start gap-2.5 border border-error/20 font-body-md animate-shake">
              <Icons.AlertCircle size={18} className="mt-0.5 shrink-0 text-error" />
              <span>{error}</span>
            </div>
          )}

          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-[13px] font-semibold text-on-surface-variant">
              Email Address <span className="text-error">*</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                <Icons.Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-low/40 border border-outline-variant rounded-xl pl-10 pr-4 py-3 text-[14px] text-on-surface placeholder-outline focus:outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all font-body-md"
                placeholder="admin@sharnam.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="font-label-md text-[13px] font-semibold text-on-surface-variant">
                Password <span className="text-error">*</span>
              </label>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Please contact the super administrator to reset your clinic login credentials.');
                }}
                className="font-label-md text-[12.5px] text-primary hover:text-primary-hover font-medium transition-colors"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                <Icons.Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-low/40 border border-outline-variant rounded-xl pl-10 pr-10 py-3 text-[14px] text-on-surface placeholder-outline focus:outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all font-body-md"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-on-surface-variant transition-colors"
              >
                {showPassword ? <Icons.EyeOff size={18} /> : <Icons.Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-primary text-on-primary font-label-md text-[15px] py-3.5 rounded-xl hover:bg-primary-hover active:bg-primary-hover/90 transition-all disabled:opacity-60 flex justify-center items-center gap-2 shadow-[0_4px_14px_rgba(204,59,56,0.25)] hover:shadow-[0_6px_20px_rgba(204,59,56,0.35)] cursor-pointer"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Icons.Loader2 size={18} className="animate-spin" />
                Signing In...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                Sign In
                <Icons.ArrowRight size={18} />
              </span>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-outline-variant/60 text-center">
          <p className="font-body-md text-[13px] text-on-surface-variant">
            Don't have an account?{' '}
            <span className="text-primary font-semibold">Contact Administrator</span>
          </p>
        </div>
      </div>

      {/* Return to public site link */}
      <div className="mt-6 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-on-surface-variant hover:text-primary transition-colors font-medium"
        >
          <Icons.ArrowLeft size={16} />
          Back to Public Website
        </Link>
      </div>

    </div>
  );
};

export default Login;
