import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../lib/AuthContext';
import { motion } from 'motion/react';
import { MapPin, Search, ChevronRight } from 'lucide-react';

const MessSelection: React.FC = () => {
  const { user } = useAuth();
  const [messes, setMesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMesses();
  }, []);

  const fetchMesses = async () => {
    const q = query(collection(db, 'messes'), where('status', '==', 'approved'));
    const snap = await getDocs(q);
    setMesses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  const joinMess = async (messId: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), { messId });
      window.location.reload();
    } catch (err) {
      alert('Error joining mess');
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#F5F5F0]">
      <div className="pt-12 mb-10 text-center">
        <h1 className="text-3xl font-serif text-[#141414] mb-3">Find your table</h1>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">Discover and join a mess that fits your taste and location.</p>
      </div>

      <div className="relative mb-8">
        <input 
          placeholder="Search for messes..."
          className="w-full bg-white pl-12 pr-6 py-4 rounded-[24px] shadow-sm border-none text-sm outline-none"
        />
        <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
      </div>

      <div className="space-y-4">
        {messes.map((mess) => (
          <motion.div 
            key={mess.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-[32px] shadow-sm group active:scale-[0.98] transition-all"
            onClick={() => joinMess(mess.id)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#5A5A40]/5 text-[#5A5A40] rounded-2xl flex items-center justify-center font-serif italic text-2xl">
                  {mess.name?.[0]}
                </div>
                <div>
                  <h3 className="text-lg font-serif">{mess.name}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                    <MapPin size={10} /> {mess.address?.split(',')[0]}
                  </div>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-200 group-hover:text-[#5A5A40] transition-colors" />
            </div>
          </motion.div>
        ))}

        {messes.length === 0 && !loading && (
          <div className="text-center p-12">
            <p className="text-gray-400 text-sm italic">No approved messes found yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessSelection;
