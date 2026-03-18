import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ClipboardCheck, Mail, Lock, LogIn, UserPlus, AlertCircle, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      const msgs = {
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/invalid-email': 'Invalid email address.',
      };
      setError(msgs[err.code] || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Google sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafb] via-teal-50/30 to-[#f8fafb] flex items-center justify-center p-6 font-sans">
      <div className="relative max-w-md w-full">
        {/* Decorative glows */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-teal-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-200/20 rounded-full blur-3xl animate-float delay-300" />

        <div className="relative card-elevated p-10 animate-fade-in">
          {/* Logo / Header */}
          <div className="text-center mb-10">
            <div className="bg-gradient-to-br from-teal-500 to-teal-700 p-4 rounded-3xl text-white shadow-xl shadow-teal-500/20 inline-flex mb-5">
              <ClipboardCheck size={36} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">RBSK Surveyor</h1>
            <p className="text-slate-400 text-sm font-semibold mt-1.5">Digital Intervention Hub</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3 mb-6 text-sm font-bold animate-fade-in">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-slate-400" size={18} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" required
                  className="input-premium pl-12" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-slate-400" size={18} />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required minLength={6}
                  className="input-premium pl-12" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary py-4 text-base shadow-2xl disabled:opacity-50">
              {loading ? <Loader2 size={20} className="animate-spin" /> : isSignUp ? <><UserPlus size={20} /> Create Account</> : <><LogIn size={20} /> Sign In</>}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="section-line flex-1" />
            <span className="text-xs font-extrabold text-slate-300 uppercase">or</span>
            <div className="section-line flex-1" />
          </div>

          {/* Google */}
          <button onClick={handleGoogle} disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 py-3.5 rounded-2xl font-extrabold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50">
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            Continue with Google
          </button>

          {/* Toggle */}
          <p className="text-center text-sm text-slate-500 font-medium mt-6">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => { setIsSignUp(v => !v); setError(''); }}
              className="text-teal-600 font-extrabold hover:text-teal-700 transition-colors">
              {isSignUp ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
