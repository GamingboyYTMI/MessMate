import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { db } from '../../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Users, Utensils, TrendingUp, Clock, ShieldCheck, Calendar, Download } from 'lucide-react';
import jsPDF from 'jspdf';

const OwnerHome: React.FC = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ students: 0, attendance: 0, revenue: 0 });
  const [mess, setMess] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    if (profile?.messId) {
      fetchData();
    }
  }, [profile]);

  const fetchData = async () => {
    if (!profile?.messId) return;
    
    // Fetch Mess
    const m = await getDoc(doc(db, 'messes', profile.messId));
    setMess(m.data());

    // Fetch Students
    const studentsSnap = await getDocs(query(collection(db, 'users'), where('messId', '==', profile.messId), where('role', '==', 'Student')));
    const studentList = studentsSnap.docs.map(d => d.data());
    setStudents(studentList);
    
    setStats({
      students: studentsSnap.size,
      attendance: 0,
      revenue: studentsSnap.size * 3000 // Simple estimate
    });
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('Mess Management Report', 20, 20);
    
    doc.setFontSize(14);
    doc.text(`Mess Name: ${mess?.name || 'My Mess'}`, 20, 35);
    doc.text(`Owner: ${profile?.name}`, 20, 42);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 49);
    
    doc.text('Performance Summary:', 20, 65);
    doc.text(`Total Active Students: ${stats.students}`, 25, 75);
    doc.text(`Estimated Revenue: INR ${stats.revenue}`, 25, 82);
    
    doc.text('Student List:', 20, 100);
    students.forEach((s, i) => {
        if (110 + (i * 10) < 280) {
            doc.text(`${i + 1}. ${s.name} (${s.username}) - ${s.phone || 'No Phone'}`, 25, 110 + (i * 10));
        }
    });

    doc.save(`Mess_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="pb-32 pt-6 px-4 bg-stone-50 min-h-screen">
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <p className="text-xs text-stone-500 font-medium mb-1">Good morning</p>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={downloadReport}
            className="w-11 h-11 flex items-center justify-center bg-white text-stone-600 border border-stone-200 rounded-2xl hover:bg-stone-50 transition-all shadow-sm"
            title="Download Monthly Report"
          >
            <Download size={18} />
          </button>
          <div className="bg-white px-3 py-1.5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[11px] font-bold text-stone-700">Live</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Main Card: Mess Performance */}
        <div className="md:col-span-2 md:row-span-2 bg-indigo-600 rounded-[32px] p-7 shadow-lg shadow-indigo-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-white/10 group-hover:text-white/20 transition-colors">
            <TrendingUp size={160} />
          </div>
          <div className="relative z-10 flex flex-col h-full text-white">
            <div className="inline-flex p-2.5 bg-white/20 rounded-xl mb-6 w-fit backdrop-blur-md">
              <TrendingUp size={22} />
            </div>
            <h2 className="text-2xl font-extrabold mb-1">{mess?.name || 'Your Mess'}</h2>
            <div className="flex items-center gap-2 opacity-70 mb-8 text-xs font-medium">
              Daily Management Active
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <div className="text-[10px] text-white/60 uppercase tracking-wider font-bold mb-1">Students</div>
                <div className="text-2xl font-extrabold">{stats.students}</div>
              </div>
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <div className="text-[10px] text-white/60 uppercase tracking-wider font-bold mb-1">Revenue</div>
                <div className="text-2xl font-extrabold">₹{stats.revenue}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 md:row-span-1 bg-green-50 rounded-[32px] p-7 relative overflow-hidden group border border-green-100">
          <div className="absolute -right-4 -bottom-4 text-green-200/50 group-hover:text-green-200 transition-colors">
            <Users size={120} />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-extrabold text-green-900 mb-1">Members</h3>
            <p className="text-green-700 text-xs mb-6 font-medium">Manage your active members</p>
            <button className="px-6 py-2.5 bg-green-600 text-white hover:bg-green-700 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95">
              Manage List
            </button>
          </div>
        </div>

        <div className="md:col-span-2 md:row-span-1 bg-amber-50 rounded-[32px] p-7 relative overflow-hidden group border border-amber-100">
          <div className="absolute -right-4 -bottom-4 text-amber-200/50 group-hover:text-amber-200 transition-colors">
            <Utensils size={120} />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-amber-900 mb-1">Meals</h3>
              <p className="text-amber-700 text-xs font-medium">Set daily food cycles</p>
            </div>
            <button className="w-12 h-12 flex items-center justify-center bg-amber-600 text-white rounded-2xl hover:bg-amber-700 transition-all shadow-md active:scale-95">
              <Calendar size={20} />
            </button>
          </div>
        </div>

        {/* Small Cards */}
        <div className="bg-white border border-stone-200 rounded-[32px] p-6 flex flex-col justify-between shadow-sm hover:border-indigo-200 transition-all min-h-[160px]">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-1">Local Time</div>
            <div className="text-xl font-bold text-stone-900">{new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-[32px] p-6 flex flex-col justify-between shadow-sm hover:border-stone-300 transition-all min-h-[160px]">
          <div className="p-3 bg-stone-50 text-stone-400 rounded-xl w-fit">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-1">Security</div>
            <p className="text-xs font-medium text-stone-600">Your data is secure.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerHome;
