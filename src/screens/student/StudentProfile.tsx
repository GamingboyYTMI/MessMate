import React from 'react';
import { useAuth } from '../../lib/AuthContext';
import { auth } from '../../lib/firebase';
import { motion } from 'motion/react';
import { LogOut, User, Mail, AtSign, MapPin, Download } from 'lucide-react';
import jsPDF from 'jspdf';

const StudentProfile: React.FC = () => {
  const { profile } = useAuth();

  const downloadIdCard = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85, 55] // Standard ID card size
    });

    // Background
    doc.setFillColor(2, 6, 23);
    doc.rect(0, 0, 85, 55, 'F');

    // Header Stripe
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 85, 5, 'F');

    // Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(profile?.name || 'Student', 5, 15);

    // Details
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text('DESIGNATION', 5, 22);
    doc.setTextColor(255, 255, 255);
    doc.text('STUDENT', 5, 25);

    doc.setTextColor(150, 150, 150);
    doc.text('USERNAME', 5, 32);
    doc.setTextColor(255, 255, 255);
    doc.text(`@${profile?.username || 'user'}`, 5, 35);

    doc.setTextColor(150, 150, 150);
    doc.text('MESS ID', 5, 42);
    doc.setTextColor(255, 255, 255);
    doc.text(profile?.messId?.slice(-8).toUpperCase() || 'NOT ASSIGNED', 5, 45);

    // Decorative label
    doc.setFontSize(5);
    doc.setTextColor(79, 70, 229);
    doc.text('MESS MANAGEMENT CARD', 5, 52);

    doc.save(`${profile?.username}_ID_CARD.pdf`);
  };

  return (
    <div className="pb-32 pt-8 px-6 bg-stone-50 min-h-screen">
      <div className="pt-8 mb-10 text-center">
        <div className="w-24 h-24 bg-indigo-50 text-indigo-600 border border-stone-200 rounded-[40px] flex items-center justify-center text-4xl font-bold mx-auto mb-4 shadow-sm transition-transform hover:scale-105 duration-500">
          {profile?.name?.[0].toUpperCase()}
        </div>
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight mb-1">{profile?.name}</h1>
        <p className="text-sm text-stone-500 font-medium">@{profile?.username}</p>
      </div>

      <div className="space-y-6">
        <button 
          onClick={downloadIdCard}
          className="w-full flex items-center justify-center gap-3 p-6 bg-indigo-600 text-white rounded-[2rem] font-bold text-sm transition-all hover:bg-indigo-700 shadow-sm"
        >
          <Download size={18} /> Download ID Card
        </button>

        <div className="bg-white border border-stone-200 p-8 rounded-[40px] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-stone-50">
             <User size={120} />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-8 flex items-center gap-2">
            <User size={14} className="text-indigo-600" /> Account Details
          </h3>
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-4 group">
               <div className="p-4 bg-stone-50 border border-stone-100 rounded-2xl text-stone-400 group-hover:text-indigo-600 transition-colors"><Mail size={18} /></div>
               <div>
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-0.5">Email</p>
                  <p className="text-sm font-bold text-stone-700">{profile?.email}</p>
               </div>
            </div>
            <div className="flex items-center gap-4 group">
               <div className="p-4 bg-stone-50 border border-stone-100 rounded-2xl text-stone-400 group-hover:text-indigo-600 transition-colors"><AtSign size={18} /></div>
               <div>
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-0.5">Username</p>
                  <p className="text-sm font-bold text-stone-700">@{profile?.username}</p>
               </div>
            </div>
            {profile?.messId && (
               <div className="flex items-center gap-4 group">
                  <div className="p-4 bg-stone-50 border border-stone-100 rounded-2xl text-stone-400 group-hover:text-indigo-600 transition-colors"><MapPin size={18} /></div>
                  <div>
                     <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-0.5">Mess Assignment</p>
                     <p className="text-sm font-bold text-stone-700">ID: {profile.messId.slice(-8).toUpperCase()}</p>
                  </div>
               </div>
            )}
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

export default StudentProfile;
