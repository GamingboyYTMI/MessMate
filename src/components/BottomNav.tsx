import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Utensils, Users, ClipboardList, User } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

const BottomNav: React.FC = () => {
  const { profile } = useAuth();
  
  if (!profile) return null;

  const getLinks = () => {
    if (profile.role === 'Admin') {
      return [
        { to: '/admin', icon: LayoutDashboard, label: 'Overview' },
        { to: '/admin/approvals', icon: Utensils, label: 'Messes' },
        { to: '/admin/profile', icon: User, label: 'Profile' },
      ];
    }
    if (profile.role === 'MessOwner') {
      return [
        { to: '/owner', icon: LayoutDashboard, label: 'Home' },
        { to: '/owner/menu', icon: Utensils, label: 'Menu' },
        { to: '/owner/attendance', icon: ClipboardList, label: 'Attendance' },
        { to: '/owner/students', icon: Users, label: 'Students' },
        { to: '/owner/profile', icon: User, label: 'Profile' },
      ];
    }
    if (profile.role === 'Student') {
      return [
        { to: '/student', icon: LayoutDashboard, label: 'Home' },
        { to: '/student/menu', icon: Utensils, label: 'Meals' },
        { to: '/student/payments', icon: ClipboardList, label: 'Payments' },
        { to: '/student/profile', icon: User, label: 'Me' },
      ];
    }
    return [];
  };

  const links = getLinks();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-2 h-20 flex items-center justify-around shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end
          className={({ isActive }) => `flex flex-col items-center gap-1 flex-1 py-1 transition-all duration-300 ${
            isActive ? 'text-indigo-600' : 'text-stone-500'
          }`}
        >
          {({ isActive }) => (
            <>
              <div className={`relative px-6 py-1 rounded-full transition-all duration-300 ${isActive ? 'bg-indigo-100/50 scale-110' : 'bg-transparent'}`}>
                <link.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[11px] font-semibold tracking-tight text-center mt-1 transition-all ${isActive ? 'text-indigo-600' : 'text-stone-400'}`}>
                {link.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
