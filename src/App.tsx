import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext';
import Login from './screens/Login';
import Signup from './screens/Signup';
import RoleSelection from './screens/RoleSelection';
import AdminDashboard from './screens/AdminDashboard';
import OwnerDashboard from './screens/OwnerDashboard';
import StudentDashboard from './screens/StudentDashboard';
import ProfileSetup from './screens/ProfileSetup';
import BottomNav from './components/BottomNav';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center font-sans tracking-tight text-gray-500">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (profile && !profile.role) return <Navigate to="/role-selection" />;
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) return <Navigate to="/" />;

  return (
    <div className="pb-20">
      {children}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-indigo-600/10 selection:text-indigo-600">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/role-selection" element={
              <ProtectedRoute>
                <RoleSelection />
              </ProtectedRoute>
            } />
            
            <Route path="/profile-setup" element={
                <ProtectedRoute>
                    <ProfileSetup />
                </ProtectedRoute>
            } />

            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="/owner/*" element={
              <ProtectedRoute allowedRoles={['MessOwner']}>
                <OwnerDashboard />
              </ProtectedRoute>
            } />

            <Route path="/student/*" element={
              <ProtectedRoute allowedRoles={['Student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />

            <Route path="/" element={<HomeRedirect />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

function HomeRedirect() {
  const { user, profile, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  
  if (!profile) return <Navigate to="/role-selection" />;
  
  if (profile.role === 'Admin') return <Navigate to="/admin" />;
  if (profile.role === 'MessOwner') return <Navigate to="/owner" />;
  if (profile.role === 'Student') return <Navigate to="/student" />;
  
  return <Navigate to="/role-selection" />;
}
