import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, addDoc, getDoc, setDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Check, X, Shield, QrCode } from 'lucide-react';

const StudentManagement: React.FC = () => {
  const { profile } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.messId) fetchStudents();
  }, [profile]);

  const fetchStudents = async () => {
    const q = query(collection(db, 'users'), where('messId', '==', profile?.messId), where('role', '==', 'Student'));
    const snap = await getDocs(q);
    setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  const approvePayment = async (studentId: string) => {
    // Logic to add a payment record
    if (!profile?.messId) return;
    try {
        const month = new Date().toLocaleString('default', { month: 'long' });
        const year = new Date().getFullYear();
        
        await addDoc(collection(db, `messes/${profile.messId}/payments`), {
            studentId,
            messId: profile.messId,
            amount: 3000, // Standard fee
            month,
            year,
            date: new Date().toISOString(),
            status: 'paid'
        });
        alert('Payment recorded successfully');
    } catch (err) {
        alert('Error recording payment');
    }
  };

  return (
    <div className="pb-32 pt-8 px-6 bg-stone-50 min-h-screen">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Student List</h1>
          <p className="text-xs text-stone-500 font-medium">Manage your mess members and their payments.</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
           <div className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-1">Total</div>
          <div className="flex items-center gap-2 text-stone-700">
            <span className="text-xs font-bold">{students.length} Students</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {students.length === 0 && !loading && (
            <div className="p-16 text-center border-2 border-dashed border-stone-200 rounded-[32px] bg-white shadow-sm">
                <p className="text-xs font-bold text-stone-400">No students joined yet</p>
            </div>
        )}
        
        {students.map((student, idx) => (
          <motion.div 
            key={student.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white border border-stone-200 p-6 rounded-[2.5rem] flex items-center justify-between group hover:border-indigo-200 transition-all shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 text-stone-50 transition-colors">
              <QrCode size={80} />
            </div>
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-14 h-14 bg-stone-50 border border-stone-100 rounded-2xl flex items-center justify-center font-bold text-indigo-600 text-lg">
                {student.name?.[0].toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-stone-900 leading-none mb-1">{student.name}</h4>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-stone-400 font-medium">{student.username}</p>
                  <span className="w-1 h-1 bg-stone-200 rounded-full"></span>
                  <p className="text-xs text-stone-400 font-medium">{student.phone || 'No phone'}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 relative z-10">
               <button 
                 onClick={() => approvePayment(student.id)}
                 className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all shadow-sm font-bold text-xs"
                 title="Record Payment"
               >
                 Record Fee
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StudentManagement;
