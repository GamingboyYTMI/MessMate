import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { db, auth } from '../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { QrCode, Upload, Link as LinkIcon, LogOut, Download } from 'lucide-react';
import jsPDF from 'jspdf';

const OwnerProfile: React.FC = () => {
  const { user, profile } = useAuth();
  const [mess, setMess] = useState<any>(null);
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile?.messId) fetchMess();
  }, [profile]);

  const fetchMess = async () => {
    const m = await getDoc(doc(db, 'messes', profile?.messId!));
    if (m.exists()) {
      setMess(m.data());
      setUpiId(m.data().upiId || '');
    }
  };

  const handleUpdateUpi = async () => {
    if (!profile?.messId) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'messes', profile.messId), { upiId });
      alert('UPI ID updated');
    } catch (err) {
      alert('Error updating UPI');
    } finally {
      setLoading(false);
    }
  };

  const downloadIdCard = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85, 55]
    });

    doc.setFillColor(2, 6, 23);
    doc.rect(0, 0, 85, 55, 'F');
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 85, 5, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(profile?.name || 'Mess Owner', 5, 15);

    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text('ROLE', 5, 22);
    doc.setTextColor(255, 255, 255);
    doc.text('MESS OWNER', 5, 25);

    doc.setTextColor(150, 150, 150);
    doc.text('MESS NAME', 5, 32);
    doc.setTextColor(255, 255, 255);
    doc.text(mess?.name?.toUpperCase() || 'UNNAMED MESS', 5, 35);

    doc.setTextColor(150, 150, 150);
    doc.text('MESS ID', 5, 42);
    doc.setTextColor(255, 255, 255);
    doc.text(profile?.messId?.slice(-8).toUpperCase() || 'N/A', 5, 45);

    doc.setFontSize(5);
    doc.setTextColor(79, 70, 229);
    doc.text('MESS MANAGEMENT SYSTEM', 5, 52);

    doc.save(`${profile?.name}_ID_CARD.pdf`);
  };

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.messId) return;

    setUploading(true);
    
    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        await updateDoc(doc(db, 'messes', profile.messId), {
          upiQrUrl: base64String
        });
        setMess({ ...mess, upiQrUrl: base64String });
        alert('QR Code updated successfully!');
      } catch (err) {
        console.error('Error saving QR code:', err);
        alert('Failed to save QR code');
      } finally {
        setUploading(false);
      }
    };
    
    reader.onerror = () => {
      alert('Error reading file');
      setUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className="pb-32 pt-8 px-6 bg-stone-50 min-h-screen">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Settings</h1>
          <p className="text-xs text-stone-500 font-medium">Manage your account and mess preferences.</p>
        </div>
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 border border-stone-200 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm">
          {profile?.name?.[0].toUpperCase()}
        </div>
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
             <LinkIcon size={120} />
           </div>
           <h3 className="text-sm font-bold text-stone-900 mb-8 flex items-center gap-3">
            <LinkIcon size={18} className="text-indigo-600" /> Payment Details
          </h3>
          
          <div className="space-y-8 relative z-10">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2 ml-1">Your UPI ID</label>
              <div className="flex gap-2">
                <input 
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  className="flex-1 px-6 py-4 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-bold text-stone-900 outline-none focus:border-indigo-200 transition-all"
                  placeholder="e.g. name@upi"
                />
                <button 
                  onClick={handleUpdateUpi}
                  disabled={loading}
                  className="bg-indigo-600 text-white px-8 rounded-2xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm"
                >
                  {loading ? '...' : 'Save'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-4 ml-1">Payment QR Code</label>
              <div className="flex flex-col items-center p-8 bg-stone-50 border border-stone-200 rounded-[32px] group hover:border-indigo-200 transition-all relative">
                {mess?.upiQrUrl ? (
                  <div className="relative">
                    <img src={mess.upiQrUrl} alt="QR Code" className="w-48 h-48 object-contain rounded-2xl mb-4" />
                    <label className="absolute -bottom-2 -right-2 bg-indigo-600 p-3 rounded-full shadow-lg cursor-pointer border border-white hover:scale-110 transition-transform">
                      <Upload size={16} className="text-white" />
                      <input type="file" className="hidden" onChange={handleQrUpload} accept="image/*" />
                    </label>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center py-10 w-full">
                    <div className="w-20 h-20 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                      <QrCode size={40} />
                    </div>
                    <span className="text-xs font-bold text-stone-500">{uploading ? 'Uploading...' : 'Upload QR Code'}</span>
                    <input type="file" className="hidden" onChange={handleQrUpload} accept="image/*" />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-stone-200 p-8 rounded-[40px] shadow-sm">
          <h3 className="text-sm font-bold text-stone-900 mb-8">Personal Info</h3>
          <div className="space-y-4">
             <div className="p-4 bg-stone-50 border border-stone-100 rounded-2xl">
                <p className="text-[10px] text-stone-400 uppercase font-bold tracking-widest mb-1">Full Name</p>
                <p className="text-sm font-bold text-stone-700">{profile?.name}</p>
             </div>
             <div className="p-4 bg-stone-50 border border-stone-100 rounded-2xl">
                <p className="text-[10px] text-stone-400 uppercase font-bold tracking-widest mb-1">Email</p>
                <p className="text-sm font-bold text-stone-700">{profile?.email}</p>
             </div>
          </div>
          
          <button 
            onClick={() => auth.signOut()}
            className="w-full mt-8 flex items-center justify-center gap-3 p-6 bg-red-50 text-red-600 rounded-[2rem] font-bold text-sm transition-all hover:bg-red-600 hover:text-white border border-red-100 shadow-sm"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;
