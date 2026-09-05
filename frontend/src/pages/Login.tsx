import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Info
} from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both official email address and portal password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        err.message ||
        'Authentication failed. Please verify your official credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between selection:bg-amber-200 selection:text-slate-900 font-sans">
      {/* Top Tricolor Accent Stripe */}
      <div className="gov-tricolor-stripe"></div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Side: National Portal Information */}
          <div className="lg:col-span-6 space-y-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gov-primary border border-gov-gold/40 flex items-center justify-center text-gov-gold text-2xl font-serif font-black shadow-lg">
                ⚖
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-gov-gold">
                  GOVERNMENT OF INDIA • MINISTRY OF COAL
                </span>
                <h2 className="text-xl font-black tracking-tight text-white uppercase font-sans">
                  DIRECTORATE GENERAL OF MINES SAFETY (DGMS)
                </h2>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Coal Mine Statutory Compliance & Governance Monitoring System
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                Centralized national platform for statutory compliance monitoring under the Mines Act 1952, Coal Mines Regulations 2017, and CPCB environmental standards with AI-powered explainable risk intelligence.
              </p>
            </div>

            {/* Statutory Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-gov-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block font-bold">Mines Act 1952 & CMR</strong>
                  <span className="text-slate-500 text-[11px]">60+ statutory rules monitored</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block font-bold">Secure JWT & RBAC</strong>
                  <span className="text-slate-500 text-[11px]">Strict role-based access</span>
                </div>
              </div>
            </div>

            {/* Official Credentials Reference Guide */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-gov-gold font-bold text-[11px] uppercase tracking-wider">
                <Info className="w-3.5 h-3.5" />
                Registered Official Accounts (Reference)
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Use your designated official email address and password <code className="text-gov-gold font-mono bg-slate-950 px-1 py-0.5 rounded">CoalGov@2026</code> to log in:
              </p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-300 font-mono pt-1">
                <div>• <span className="text-slate-400">Super Admin:</span> admin@coal.gov.in</div>
                <div>• <span className="text-slate-400">DGMS Inspector:</span> inspector@dgms.gov.in</div>
                <div>• <span className="text-slate-400">HQ Management:</span> hq@coal.gov.in</div>
                <div>• <span className="text-slate-400">Mine Manager:</span> manager@mine.gov.in</div>
                <div>• <span className="text-slate-400">Compliance Off:</span> compliance@mine.gov.in</div>
                <div>• <span className="text-slate-400">Contractor:</span> contractor@partner.com</div>
              </div>
            </div>
          </div>

          {/* Right Side: Secure Authentication Form */}
          <div className="lg:col-span-6 bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  SECURE AUTHENTICATION GATEWAY
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Official Portal Sign In</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your authorized official email and password to access your role-specific governance portal.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Official Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. admin@coal.gov.in"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-gov-primary focus:bg-white transition-all"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Portal Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter official password..."
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-gov-primary focus:bg-white transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded text-gov-primary focus:ring-gov-primary w-3.5 h-3.5"
                  />
                  Remember session on this device
                </label>
                <span className="text-[11px] text-slate-400">TLS 1.3 256-Bit Encrypted</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gov-dark hover:bg-gov-primary text-white text-xs font-black rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Verifying Statutory JWT Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate & Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> DGMS ISO 27001 Certified
              </span>
              <span>v1.0 Statutory Edition</span>
            </div>

          </div>

        </div>
      </div>

      {/* Official Gov Footer */}
      <footer className="py-4 border-t border-slate-800 text-center text-[11px] text-slate-400">
        Ministry of Coal • Directorate General of Mines Safety (DGMS) • Digital Governance Platform © 2026
      </footer>
    </div>
  );
};

export default Login;
