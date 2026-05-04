import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Store } from 'lucide-react';

import { handleFirestoreError, OperationType } from '../lib/AuthContext';

const RoleSelection: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const selectRole = async (role: 'Student' | 'MessOwner') => {
    if (!user) return;
    setLoading(true);
    try {
      const userData = {
        uid: user.uid,
        email: user.email,
        role,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
      navigate('/profile-setup');
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { 
        id: 'Student', 
        title: 'I am a Student', 
        desc: 'Find messes, track meals, and manage monthly payments.',
        icon: User,
        color: 'bg-indigo-50 border-indigo-100 text-indigo-600',
        gradient: 'from-indigo-600/5 to-transparent'
    },
    { 
        id: 'MessOwner', 
        title: 'I am a Mess Owner', 
        desc: 'Manage menus, track attendance, and oversee your business.',
        icon: Store,
        color: 'bg-amber-50 border-amber-100 text-amber-600',
        gradient: 'from-amber-600/5 to-transparent'
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 pb-20">
      <div className="w-full max-w-lg">
        <div className="text-center mb-12">
          <div className="inline-flex p-3 bg-white rounded-2xl border border-stone-200 shadow-sm mb-6">
            <User size={24} className="text-indigo-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-stone-900 mb-2 tracking-tight">Identity</h2>
          <p className="text-stone-500 font-medium text-sm">How would you like to use MessMate?</p>
        </div>

        <div className="grid gap-4">
          {roles.map((r) => (
            <motion.button
              key={r.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              onClick={() => selectRole(r.id as any)}
              className="flex items-center gap-6 p-8 bg-white border border-stone-200 rounded-[32px] text-left hover:border-stone-300 transition-all outline-none relative group overflow-hidden shadow-sm"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${r.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              <div className={`p-4 rounded-2xl ${r.color} relative z-10 border transition-transform group-hover:scale-110`}>
                <r.icon size={28} strokeWidth={2.5} />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-extrabold text-stone-900 mb-1">{r.title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed font-medium">{r.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
