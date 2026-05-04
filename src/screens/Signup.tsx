import React, { useState } from 'react';
import { auth, googleProvider, db } from '../lib/firebase';
import { signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { motion } from 'motion/react';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      // Profile will be initialized in RoleSelection or ProfileSetup
      navigate('/role-selection');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/role-selection');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-stone-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md pt-8"
      >
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
            <UserPlus size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 mb-2">Join MessMate</h1>
          <p className="text-sm text-stone-500 font-medium">Create your profile to get started</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
          {error}
        </div>}

        <form onSubmit={handleSignup} className="space-y-4">
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-6 py-4 bg-white border border-stone-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-sm outline-none text-stone-900 placeholder:text-stone-400 font-medium"
            placeholder="Full Name"
            required
          />
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 bg-white border border-stone-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-sm outline-none text-stone-900 placeholder:text-stone-400 font-medium"
            placeholder="Email address"
            required
          />
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-4 bg-white border border-stone-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-sm outline-none text-stone-900 placeholder:text-stone-400 font-medium"
            placeholder="Create Password"
            required
          />
          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-extrabold text-sm hover:bg-indigo-700 transition-all active:scale-[0.98] shadow-md shadow-indigo-100 mt-2"
          >
            Create Account
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] text-stone-400 font-extrabold bg-stone-50 px-4">Instant Access</div>
        </div>

        <button 
          onClick={handleGoogleSignup}
          className="w-full bg-white border border-stone-200 py-4 rounded-2xl font-bold text-sm hover:bg-stone-50 transition-all flex items-center justify-center gap-3 text-stone-700 shadow-sm active:scale-[0.98]"
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
          Signup with Google
        </button>

        <p className="text-center text-sm text-stone-500 mt-12 font-medium">
          Already have an account? <Link to="/login" className="text-indigo-600 font-extrabold ml-1 hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
