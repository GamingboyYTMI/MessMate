import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { motion } from 'motion/react';
import { PieChart, Users, Store, Activity } from 'lucide-react';

import { handleFirestoreError, OperationType } from '../../lib/AuthContext';

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState({ users: 0, messes: 0, pending: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const messesSnap = await getDocs(collection(db, 'messes'));
      const pendingSnap = await getDocs(query(collection(db, 'messes'), where('status', '==', 'pending')));
      
      setStats({
        users: usersSnap.size,
        messes: messesSnap.size,
        pending: pendingSnap.size
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'admin_overview_stats');
    }
  };

  const widgets = [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Messes', value: stats.messes, icon: Store, color: 'bg-purple-50 text-purple-600' },
    { label: 'Pending Approvals', value: stats.pending, icon: Activity, color: 'bg-yellow-50 text-yellow-600' },
  ];

  return (
    <div className="pb-32 pt-8 px-6 bg-stone-50 min-h-screen">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Admin Control</h1>
          <p className="text-xs text-stone-500 font-medium">Keep an eye on the entire ecosystem.</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
           <div className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-1">System Status</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-bold text-indigo-600">Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {widgets.map((w, i) => (
          <motion.div 
            key={w.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-stone-200 p-8 rounded-[40px] shadow-sm flex flex-col items-center text-center relative overflow-hidden group"
          >
            <div className={`p-4 rounded-[2rem] ${w.color} mb-6 group-hover:scale-110 transition-transform`}>
                <w.icon size={24} />
            </div>
            <p className="text-4xl font-bold text-stone-900 mb-2 tracking-tight">{w.value}</p>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">{w.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white border border-stone-200 rounded-[40px] p-10 flex flex-col items-center justify-center min-h-[200px] relative overflow-hidden shadow-sm">
         <Activity className="text-indigo-600 mb-4 animate-pulse" size={40} />
         <p className="text-sm font-bold text-stone-500">System is running smoothly</p>
      </div>
    </div>
  );
};

export default AdminOverview;
