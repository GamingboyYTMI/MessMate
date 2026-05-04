import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Utensils, Info, Calendar, Store, MapPin, Clock } from 'lucide-react';

const StudentHome: React.FC = () => {
  const { profile } = useAuth();
  const [mess, setMess] = useState<any>(null);
  const [menu, setMenu] = useState<any>(null);

  useEffect(() => {
    if (profile?.messId) fetchData();
  }, [profile]);

  const fetchData = async () => {
    const mDoc = await getDoc(doc(db, 'messes', profile?.messId!));
    setMess(mDoc.data());

    const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const menuDoc = await getDoc(doc(db, `messes/${profile?.messId}/menus`, dayName));
    if (menuDoc.exists()) setMenu(menuDoc.data());
  };

  if (!mess) return null;

  return (
    <div className="pb-32 pt-6 px-4 bg-stone-50 min-h-screen">
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <p className="text-xs text-stone-500 font-medium mb-1">Hello, {profile?.name?.split(' ')[0]}</p>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Student Hub</h1>
        </div>
        <div className="flex gap-2">
           <div className="bg-white px-3 py-1.5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[11px] font-bold text-stone-700">Online</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Main Card: Mess Info */}
        <div className="md:col-span-2 md:row-span-1 bg-white border border-stone-100 rounded-[32px] p-7 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-stone-50 group-hover:text-stone-100 transition-colors">
            <Store size={140} />
          </div>
          <div className="relative z-10">
            <div className="inline-flex p-2.5 bg-indigo-50 text-indigo-600 rounded-xl mb-6 w-fit">
              <Store size={22} />
            </div>
            <h2 className="text-2xl font-extrabold text-stone-900 mb-1">{mess.name}</h2>
            <div className="flex items-center gap-2 text-stone-500 mb-6 font-medium">
              <MapPin size={14} className="text-stone-400" />
              <span className="text-xs">{mess.address}</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-100 w-fit">
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-extrabold text-white">{mess.ownerName?.charAt(0) || 'M'}</div>
              <span className="text-[11px] font-extrabold text-stone-700">{mess.ownerName || 'Mess Admin'}</span>
            </div>
          </div>
        </div>

        {/* Card: Today's Menu */}
        <div className="md:col-span-2 md:row-span-2 bg-indigo-600 rounded-[32px] p-7 text-white shadow-lg shadow-indigo-100 relative overflow-hidden group">
          <div className="absolute -bottom-10 -right-10 text-white/5 opacity-20 group-hover:opacity-30 transition-colors">
            <Utensils size={200} />
          </div>
          <div className="relative z-10">
             <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-extrabold tracking-tight">Today's Menu</h3>
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                <Calendar size={18} />
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex justify-between items-start">
                <div className="w-1/3">
                  <div className="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-1">Breakfast</div>
                </div>
                <div className="w-2/3 text-right">
                  <p className="text-base font-extrabold tracking-tight">{menu?.breakfast || 'Pending'}</p>
                </div>
              </div>
              <div className="w-full border-t border-white/10"></div>
              <div className="flex justify-between items-start">
                <div className="w-1/3">
                  <div className="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-1">Lunch</div>
                </div>
                <div className="w-2/3 text-right">
                  <p className="text-base font-extrabold tracking-tight">{menu?.lunch || 'Pending'}</p>
                </div>
              </div>
              <div className="w-full border-t border-white/10"></div>
              <div className="flex justify-between items-start">
                <div className="w-1/3">
                  <div className="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-1">Dinner</div>
                </div>
                <div className="w-2/3 text-right">
                  <p className="text-base font-extrabold tracking-tight">{menu?.dinner || 'Pending'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Small Cards */}
        <div className="bg-white border border-stone-200 rounded-[32px] p-6 flex flex-col justify-between shadow-sm group hover:border-green-200 transition-all min-h-[160px]">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl w-fit">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-1">Mess Hours</div>
            <div className="text-xl font-bold text-stone-900">08:00 - 21:00</div>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-[32px] p-6 flex flex-col justify-between shadow-sm group hover:border-amber-200 transition-all min-h-[160px]">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit">
            <Info size={20} />
          </div>
          <div>
            <div className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-1">Notice</div>
            <p className="text-xs font-medium text-stone-600">Everything is running smoothly today.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
