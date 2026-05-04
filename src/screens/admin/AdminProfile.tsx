import React from 'react';
import { useAuth } from '../../lib/AuthContext';
import { auth } from '../../lib/firebase';
import { motion } from 'motion/react';
import { LogOut, User, Mail, AtSign, ShieldAlert, Download } from 'lucide-react';
import jsPDF from 'jspdf';

const AdminProfile: React.FC = () => {
  const { profile } = useAuth();

  const downloadCert = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85, 55]
    });

    doc.setFillColor(2, 6, 23);
    doc.rect(0, 0, 85, 55, 'F');
    doc.setFillColor(245, 158, 11); // Amber for admin
    doc.rect(0, 0, 85, 5, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(profile?.name || 'Admin', 5, 15);

    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text('CLEARANCE', 5, 22);
    doc.setTextColor(255, 255, 255);
    doc.text('SYSTEM ADMINISTRATOR', 5, 25);

    doc.setTextColor(150, 150, 150);
    doc.text('USERNAME', 5, 32);
    doc.setTextColor(255, 255, 255);
    doc.text(`@${profile?.username || 'root'}`, 5, 35);

    doc.setFontSize(5);
    doc.setTextColor(245, 158, 11);
    doc.text('ADMINISTRATION CARD', 5, 52);

    doc.save(`ADMIN_${profile?.username}_ID.pdf`);
  };

  return (
    <div className="pb-32 pt-8 px-6 bg-stone-50 min-h-screen">
      <div className="pt-8 mb-10 text-center">
        <div className="w-24 h-24 bg-amber-50 text-amber-600 border border-amber-200 rounded-[40px] flex items-center justify-center text-4xl font-bold mx-auto mb-4 shadow-sm transition-transform hover:scale-105 duration-500">
          {profile?.name?.[0].toUpperCase()}
        </div>
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight mb-1">{profile?.name}</h1>
        <p className="text-sm text-stone-500 font-medium">Administrator</p>
      </div>

      <div className="space-y-6">
        <button 
          onClick={downloadCert}
          className="w-full flex items-center justify-center gap-3 p-6 bg-amber-500 text-white rounded-[2rem] font-bold text-sm transition-all hover:bg-amber-600 shadow-sm"
        >
          <Download size={18} /> Download Admin ID
        </button>

        <div className="bg-white border border-stone-200 p-8 rounded-[40px] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-stone-50">
             <ShieldAlert size={120} />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-8 flex items-center gap-2">
            <ShieldAlert size={14} className="text-amber-500" /> Account Details
          </h3>
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-4 group">
               <div className="p-4 bg-stone-50 border border-stone-100 rounded-2xl text-stone-400 group-hover:text-amber-500 transition-colors"><Mail size={18} /></div>
               <div>
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-0.5">Email</p>
                  <p className="text-sm font-bold text-stone-700">{profile?.email}</p>
               </div>
            </div>
            <div className="flex items-center gap-4 group">
               <div className="p-4 bg-stone-50 border border-stone-100 rounded-2xl text-stone-400 group-hover:text-amber-500 transition-colors"><AtSign size={18} /></div>
               <div>
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-0.5">Username</p>
                  <p className="text-sm font-bold text-stone-700">@{profile?.username}</p>
               </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => auth.signOut()}
          className="w-full mt-4 flex items-center justify-center gap-3 p-6 bg-red-50 text-red-600 border border-red-100 rounded-[2.5rem] font-bold text-sm transition-all hover:bg-red-600 hover:text-white"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;
