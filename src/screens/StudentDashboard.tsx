import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import StudentHome from './student/StudentHome';
import StudentPayments from './student/StudentPayments';
import StudentProfile from './student/StudentProfile';
import MessSelection from './student/MessSelection';

const StudentDashboard: React.FC = () => {
  const { profile } = useAuth();

  if (!profile?.messId) {
    return <MessSelection />;
  }

  return (
    <div className="min-h-screen">
      <Routes>
        <Route index element={<StudentHome />} />
        <Route path="payments" element={<StudentPayments />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="*" element={<Navigate to="" />} />
      </Routes>
    </div>
  );
};

export default StudentDashboard;
