import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Calendar, UserCheck, Search, Check } from 'lucide-react';

const AttendanceTracking: React.FC = () => {
  const { profile } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any>({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealType, setMealType] = useState('lunch');

  useEffect(() => {
    if (profile?.messId) {
      fetchStudents();
      fetchAttendance();
    }
  }, [profile, date, mealType]);

  const fetchStudents = async () => {
    const q = query(collection(db, 'users'), where('messId', '==', profile?.messId), where('role', '==', 'Student'));
    const snap = await getDocs(q);
    setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const fetchAttendance = async () => {
    if (!profile?.messId) return;
    const q = query(
      collection(db, `messes/${profile.messId}/attendance`),
      where('date', '==', date),
      where('mealType', '==', mealType)
    );
    const snap = await getDocs(q);
    const data: any = {};
    snap.forEach(doc => {
      data[doc.data().studentId] = doc.data().status;
    });
    setAttendance(data);
  };

  const toggleAttendance = async (studentId: string) => {
    if (!profile?.messId) return;
    const current = attendance[studentId];
    const nextStatus = current === 'present' ? 'absent' : 'present';
    
    try {
      const attendanceId = `${studentId}_${date}_${mealType}`;
      await setDoc(doc(db, `messes/${profile.messId}/attendance`, attendanceId), {
        studentId,
        messId: profile.messId,
        date,
        mealType,
        status: nextStatus,
        updatedAt: new Date().toISOString()
      });
      setAttendance({ ...attendance, [studentId]: nextStatus });
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="pb-32 pt-8 px-6 bg-stone-50 min-h-screen">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Attendance</h1>
          <p className="text-xs text-stone-500 font-medium">Mark who's eating with you today.</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
           <div className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-1">Total Members</div>
          <div className="flex items-center gap-2 text-stone-700">
            <UserCheck size={14} className="text-indigo-600" />
            <span className="text-xs font-bold">{students.length} Students</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-stone-200 p-6 rounded-[32px] shadow-sm mb-6 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
              <Calendar size={18} />
            </div>
            <input 
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-stone-900 outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <select 
            value={mealType}
            onChange={e => setMealType(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-sm font-bold text-stone-900 outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {students.map((student, idx) => (
          <motion.div 
            key={student.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white border border-stone-200 p-5 rounded-[2rem] flex items-center justify-between group hover:border-stone-300 transition-all shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-stone-50 border border-stone-100 rounded-2xl flex items-center justify-center font-bold text-indigo-600 text-sm">
                {student.name?.[0].toUpperCase()}
              </div>
              <div>
                <span className="text-sm font-bold text-stone-900 leading-none">{student.name}</span>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-1">{student.username || 'Student'}</p>
              </div>
            </div>
            
            <button 
              onClick={() => toggleAttendance(student.id)}
              className={`px-8 py-4 rounded-2xl text-xs font-bold transition-all relative overflow-hidden shadow-sm ${
                attendance[student.id] === 'present' 
                  ? 'bg-green-600 text-white shadow-green-100' 
                  : 'bg-stone-50 border border-stone-200 text-stone-500'
              }`}
            >
              <div className="relative z-10 flex items-center gap-2">
                {attendance[student.id] === 'present' ? <Check size={14} /> : null}
                {attendance[student.id] === 'present' ? 'Present' : 'Mark Present'}
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceTracking;
