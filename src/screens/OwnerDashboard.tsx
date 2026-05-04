import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import OwnerHome from './owner/OwnerHome';
import MenuManagement from './owner/MenuManagement';
import AttendanceTracking from './owner/AttendanceTracking';
import StudentManagement from './owner/StudentManagement';
import OwnerProfile from './owner/OwnerProfile';

const OwnerDashboard: React.FC = () => {
  const { profile } = useAuth();

  if (profile?.status === 'pending') {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-10 rounded-[32px] shadow-2xl shadow-black/5">
          <div className="w-20 h-20 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⏳</span>
          </div>
          <h2 className="text-2xl font-serif text-[#141414] mb-3">Approval Pending</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Your mess registration is currently being reviewed by our administrators. You will be notified once you are approved.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="text-xs font-bold uppercase tracking-widest text-[#5A5A40] underline underline-offset-4"
          >
            Check Again
          </button>
        </div>
      </div>
    );
  }

  if (profile?.status === 'rejected') {
    return (
        <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white p-10 rounded-[32px]">
            <h2 className="text-2xl font-serif text-red-600 mb-3">Registration Rejected</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Unfortunately, your registration was not approved. Please contact support for more details.
            </p>
          </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen">
      <Routes>
        <Route index element={<OwnerHome />} />
        <Route path="menu" element={<MenuManagement />} />
        <Route path="attendance" element={<AttendanceTracking />} />
        <Route path="students" element={<StudentManagement />} />
        <Route path="profile" element={<OwnerProfile />} />
        <Route path="*" element={<Navigate to="" />} />
      </Routes>
    </div>
  );
};

export default OwnerDashboard;
