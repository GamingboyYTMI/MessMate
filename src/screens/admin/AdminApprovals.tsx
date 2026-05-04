import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Check, X, Store, AlertTriangle } from 'lucide-react';

const AdminApprovals: React.FC = () => {
  const [pendingMesses, setPendingMesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    const q = query(collection(db, 'messes'), where('status', '==', 'pending'));
    const snap = await getDocs(q);
    setPendingMesses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  const handleAction = async (messId: string, ownerId: string, status: 'approved' | 'rejected') => {
    try {
      // Update Mess status
      await updateDoc(doc(db, 'messes', messId), { status });
      // Update Owner status
      await updateDoc(doc(db, 'users', ownerId), { status });
      
      alert(`Mess ${status} successfully`);
      fetchPending();
    } catch (err) {
      alert('Action failed');
    }
  };

  return (
    <div className="pb-32 pt-8 px-6 bg-stone-50 min-h-screen">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Pending Approvals</h1>
          <p className="text-xs text-stone-500 font-medium">Verify and welcome new messes to the platform.</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
           <div className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-1">Queue</div>
          <div className="flex items-center gap-2 text-amber-600">
            <AlertTriangle size={14} />
            <span className="text-xs font-bold">{pendingMesses.length} Waiting</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {pendingMesses.length === 0 && !loading && (
            <div className="p-16 text-center bg-white border-2 border-dashed border-stone-200 rounded-[32px] relative overflow-hidden shadow-sm">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-100">
                    <Check size={32} />
                </div>
                <p className="text-sm font-bold text-stone-400">All caught up! No pending requests.</p>
            </div>
        )}

        {pendingMesses.map((mess) => (
          <motion.div 
            key={mess.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-stone-200 p-8 rounded-[32px] shadow-sm relative overflow-hidden group"
          >
            <div className="flex items-center gap-5 mb-8 relative z-10">
                <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
                    <Store size={28} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-stone-900 leading-none mb-2">{mess.name}</h3>
                    <p className="text-xs text-stone-500 font-medium">{mess.address}</p>
                </div>
            </div>

            <div className="flex gap-3 relative z-10">
                <button 
                  onClick={() => handleAction(mess.id, mess.ownerId, 'approved')}
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-[2rem] text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-sm"
                >
                    <Check size={16} /> Approve Mess
                </button>
                <button 
                  onClick={() => handleAction(mess.id, mess.ownerId, 'rejected')}
                  className="flex-1 bg-red-50 text-red-600 py-4 rounded-[2rem] text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-100 border border-red-100 transition-all"
                >
                    <X size={16} /> Reject
                </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminApprovals;
