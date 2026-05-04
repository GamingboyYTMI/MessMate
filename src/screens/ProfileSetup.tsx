import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Phone, AtSign, MapPin } from 'lucide-react';

const ProfileSetup: React.FC = () => {
  const { user, profile } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [messName, setMessName] = useState(''); // Only for Owners
  const [address, setAddress] = useState(''); // Only for Owners
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      if (profile.name) setName(profile.name);
      // If profile is already complete, redirect
      if (profile.name && profile.role !== 'MessOwner') {
          // Students go home
          // Owners need to set up Mess if not done
      }
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    setLoading(true);

    try {
      const updates: any = {
        name,
        phone,
        username,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, 'users', user.uid), updates);

      if (profile.role === 'MessOwner') {
        // Create Mess document
        const messRef = await addDoc(collection(db, 'messes'), {
          ownerId: user.uid,
          ownerName: name,
          name: messName,
          address,
          status: 'pending',
          createdAt: new Date().toISOString(),
        });
        
        await updateDoc(doc(db, 'users', user.uid), {
          messId: messRef.id
        });
      }

      navigate('/');
    } catch (err: any) {
      console.error(err);
      alert('Error updating profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4 pb-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-white rounded-2xl border border-stone-200 shadow-sm mb-6">
            <User size={24} className="text-indigo-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-stone-900 mb-2 tracking-tight">Profile</h2>
          <p className="text-stone-500 font-medium text-sm">Tell us a bit more about you.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-[2rem] border border-stone-200 shadow-sm">
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-extrabold text-stone-400 mb-2 ml-1">
                Display Name
              </label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-2 py-1 bg-transparent text-sm outline-none text-stone-900 placeholder:text-stone-300 font-bold"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="bg-white p-4 rounded-[2rem] border border-stone-200 shadow-sm">
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-extrabold text-stone-400 mb-2 ml-1">
                Username
              </label>
              <div className="flex items-center gap-1">
                <span className="text-stone-300 font-bold text-sm">@</span>
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full py-1 bg-transparent text-sm outline-none text-stone-900 placeholder:text-stone-300 font-bold"
                  placeholder="johndoe"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[2rem] border border-stone-200 shadow-sm">
            <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-extrabold text-stone-400 mb-2 ml-1">
                Phone Number
            </label>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-stone-50 rounded-xl text-stone-400">
                <Phone size={18} />
              </div>
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full py-1 bg-transparent text-sm outline-none text-stone-900 placeholder:text-stone-300 font-bold"
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </div>

          {profile?.role === 'MessOwner' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 pt-4"
            >
              <div className="bg-white p-5 rounded-[2rem] border border-stone-200 shadow-sm">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-extrabold text-stone-400 mb-2 ml-1">
                    Mess Name
                </label>
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <MapPin size={18} />
                  </div>
                  <input 
                    type="text"
                    value={messName}
                    onChange={(e) => setMessName(e.target.value)}
                    className="w-full py-1 bg-transparent text-sm outline-none text-stone-900 placeholder:text-stone-300 font-bold"
                    placeholder="e.g. Royal Caterers"
                    required
                  />
                </div>
              </div>
              <div className="bg-white p-5 rounded-[2rem] border border-stone-200 shadow-sm">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-extrabold text-stone-400 mb-2 ml-1">
                    Address
                </label>
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full py-1 bg-transparent text-sm outline-none text-stone-900 placeholder:text-stone-300 font-bold resize-none h-20"
                  placeholder="Mess Location"
                  required
                />
              </div>
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-extrabold text-sm hover:bg-indigo-700 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 mt-6"
          >
            {loading ? 'Finalizing...' : 'Complete Profile'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfileSetup;
