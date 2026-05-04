import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminApprovals from './admin/AdminApprovals';
import AdminOverview from './admin/AdminOverview';
import AdminProfile from './admin/AdminProfile';

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="approvals" element={<AdminApprovals />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="*" element={<Navigate to="" />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;
