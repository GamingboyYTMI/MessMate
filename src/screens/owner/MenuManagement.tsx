import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Plus, Trash2, Edit3, Save } from 'lucide-react';

const MenuManagement: React.FC = () => {
  const { profile } = useAuth();
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [newMenu, setNewMenu] = useState({ breakfast: '', lunch: '', dinner: '' });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (profile?.messId) fetchMenus();
  }, [profile]);

  const fetchMenus = async () => {
    const q = query(collection(db, `messes/${profile?.messId}/menus`));
    const snap = await getDocs(q);
    const m = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    setMenus(m);
    setLoading(false);
  };

  const saveMenu = async (day: string) => {
    if (!profile?.messId) return;
    try {
      await setDoc(doc(db, `messes/${profile.messId}/menus`, day), {
        messId: profile.messId,
        day,
        ...newMenu,
        updatedAt: new Date().toISOString()
      });
      setEditingDay(null);
      fetchMenus();
    } catch (err) {
      alert('Error saving menu');
    }
  };

  return (
    <div className="pb-32 pt-8 px-6 bg-stone-50 min-h-screen">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Weekly Menu</h1>
          <p className="text-xs text-stone-500 font-medium">Plan out your delicious meals for the week.</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
           <div className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-1">Status</div>
          <div className="flex items-center gap-2 text-indigo-600">
            <Save size={14} />
            <span className="text-xs font-bold">Autosave Enabled</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {days.map((day, idx) => {
          const menu = menus.find(m => m.day === day);
          const isEditing = editingDay === day;

          return (
            <motion.div 
              key={day}
              className={`bg-white border border-stone-200 rounded-[32px] p-6 shadow-sm overflow-hidden relative group transition-all ${isEditing ? 'ring-2 ring-indigo-500/20 scale-[1.01]' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-stone-50 border border-stone-100 rounded-xl flex items-center justify-center text-xs font-bold text-stone-400">
                    {idx + 1}
                   </div>
                   <h3 className="text-xl font-bold text-stone-900">{day}</h3>
                </div>
                {!isEditing ? (
                  <button 
                    onClick={() => {
                      setEditingDay(day);
                      setNewMenu({
                        breakfast: menu?.breakfast || '',
                        lunch: menu?.lunch || '',
                        dinner: menu?.dinner || ''
                      });
                    }}
                    className="p-3 bg-stone-50 border border-stone-100 rounded-2xl hover:bg-stone-100 transition-all text-stone-500 hover:text-indigo-600"
                  >
                    <Edit3 size={18} />
                  </button>
                ) : (
                  <button 
                    onClick={() => saveMenu(day)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-sm"
                  >
                    <Save size={14} /> Save Menu
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-stone-500 ml-1">Breakfast</label>
                        <input 
                          placeholder="What's for breakfast?"
                          value={newMenu.breakfast}
                          onChange={e => setNewMenu({...newMenu, breakfast: e.target.value})}
                          className="w-full text-sm p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-stone-900 placeholder:text-stone-300"
                        />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-stone-500 ml-1">Lunch</label>
                        <input 
                          placeholder="Main lunch items..."
                          value={newMenu.lunch}
                          onChange={e => setNewMenu({...newMenu, lunch: e.target.value})}
                          className="w-full text-sm p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-stone-900 placeholder:text-stone-300"
                        />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-stone-500 ml-1">Dinner</label>
                        <input 
                          placeholder="Evening specials..."
                          value={newMenu.dinner}
                          onChange={e => setNewMenu({...newMenu, dinner: e.target.value})}
                          className="w-full text-sm p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-stone-900 placeholder:text-stone-300"
                        />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10">
                  <div className="flex flex-col p-4 bg-stone-50 rounded-2xl border border-stone-100">
                    <p className="text-[9px] uppercase font-bold text-stone-400 tracking-wider mb-2">Breakfast</p>
                    <p className="text-sm font-bold text-stone-700 truncate">{menu?.breakfast || 'Not set'}</p>
                  </div>
                  <div className="flex flex-col p-4 bg-stone-50 rounded-2xl border border-stone-100">
                    <p className="text-[9px] uppercase font-bold text-stone-400 tracking-wider mb-2">Lunch</p>
                    <p className="text-sm font-bold text-stone-700 truncate">{menu?.lunch || 'Not set'}</p>
                  </div>
                  <div className="flex flex-col p-4 bg-stone-50 rounded-2xl border border-stone-100">
                    <p className="text-[9px] uppercase font-bold text-stone-400 tracking-wider mb-2">Dinner</p>
                    <p className="text-sm font-bold text-stone-700 truncate">{menu?.dinner || 'Not set'}</p>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuManagement;
