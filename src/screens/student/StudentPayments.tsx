import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { QrCode, Download, ExternalLink, ShieldCheck } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const StudentPayments: React.FC = () => {
  const { profile } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [mess, setMess] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);

  useEffect(() => {
    if (profile?.messId) {
        fetchPayments();
        fetchMess();
        fetchAttendance();
    }
  }, [profile]);

  const fetchMess = async () => {
    const mSnap = await getDoc(doc(db, 'messes', profile?.messId!));
    setMess(mSnap.data());
  };

  const fetchPayments = async () => {
    const q = query(collection(db, `messes/${profile?.messId}/payments`), where('studentId', '==', profile?.uid));
    const snap = await getDocs(q);
    setPayments(snap.docs.map(d => d.data()));
  };

  const fetchAttendance = async () => {
    const q = query(collection(db, `messes/${profile?.messId}/attendance`), where('studentId', '==', profile?.uid));
    const snap = await getDocs(q);
    setAttendance(snap.docs.map(d => d.data()));
  };

  const downloadReport = async () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Monthly Mess Report', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Student: ${profile?.name}`, 20, 35);
    doc.text(`Mess: ${mess?.name}`, 20, 42);
    
    doc.text('Payments Summary:', 20, 55);
    payments.forEach((p, i) => {
        doc.text(`${p.month} ${p.year}: ₹${p.amount} (${p.status})`, 25, 65 + (i * 7));
    });

    doc.text('Attendance Summary:', 20, 110);
    doc.text(`Total Meals Recorded: ${attendance.length}`, 25, 120);

    doc.save(`Mess_Report_${new Date().getMonth()+1}.pdf`);
  };

  return (
    <div className="pb-32 pt-8 px-6 bg-[#020617]">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Finance Hub</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-black">Secure Transaction Node</p>
        </div>
        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl">
           <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1 italic">Protocol</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-xs font-black text-white uppercase italic tracking-wider">UPI Standard</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* UPI QR Tile */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] p-8 text-center flex flex-col items-center">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 italic">Transmission ID</h3>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[40px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-[#020617] p-6 rounded-[32px] border border-slate-800">
              {mess?.upiQrUrl ? (
                  <img src={mess.upiQrUrl} alt="UPI QR" className="w-48 h-48 object-contain" />
              ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-slate-800">
                      <QrCode size={100} strokeWidth={0.5} />
                  </div>
              )}
            </div>
          </div>
          <div className="mt-8 space-y-1">
            <p className="text-sm font-black text-white tracking-tight uppercase italic">{mess?.upiId || 'No UPI ID Detected'}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black italic">Recipient: {mess?.name || 'Authorized Entity'}</p>
          </div>
        </div>

        {/* Actions Tile */}
        <div className="flex flex-col gap-4">
          <button 
           onClick={downloadReport}
           className="flex-1 bg-indigo-600 text-white rounded-[32px] font-black text-[12px] uppercase tracking-[0.3em] flex flex-col items-center justify-center gap-4 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 group overflow-hidden relative"
          >
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Download size={100} />
            </div>
            <Download size={24} />
            Download Data Log
          </button>
          
          <a 
            href={`upi://pay?pa=${mess?.upiId}&pn=${mess?.name}&cu=INR`}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-[32px] font-black text-[12px] uppercase tracking-[0.3em] flex flex-col items-center justify-center gap-4 hover:bg-slate-800 transition-all text-slate-400 group overflow-hidden relative"
          >
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ExternalLink size={100} />
            </div>
            <ExternalLink size={24} />
            Trigger Payment
          </a>
        </div>
      </div>

      <div className="bg-[#0f172a] border border-slate-800 rounded-[40px] p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
          <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 italic">History Ledger</h4>
          <span className="text-[10px] font-black text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full uppercase tracking-widest">Verified</span>
        </div>

        <div className="space-y-3">
          {payments.length === 0 && (
              <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-[32px]">
                  <p className="text-[10px] uppercase tracking-widest font-black text-slate-600 italic">Empty Database Entry</p>
              </div>
          )}
          {payments.map((p, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: i * 0.05 }}
               className="bg-[#020617] border border-slate-800 p-6 rounded-[2rem] flex items-center justify-between hover:border-indigo-500/30 transition-all group"
             >
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-black text-white uppercase tracking-tight italic leading-none mb-1">{p.month} {p.year}</p>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">Status: <span className="text-emerald-400">{p.status}</span></p>
                    </div>
                </div>
                <div className="text-right text-indigo-400 font-black text-lg italic tracking-tighter">
                  ₹{p.amount}
                </div>
             </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentPayments;
