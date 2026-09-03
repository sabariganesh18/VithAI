import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Code, BookmarkCheck, BarChart3, User } from 'lucide-react';

export default function MobileBottomNav() {
  const links = [
    { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/code', label: 'CodeLoop', icon: Code },
    { to: '/words', label: 'Words', icon: BookmarkCheck },
    { to: '/progress', label: 'Analytics', icon: BarChart3 },
    { to: '/profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="d-block d-md-none position-fixed bottom-0 start-0 end-0 bg-white dark:bg-dark border-top border-slate-200 dark:border-slate-800 z-3 py-1 shadow-lg backdrop-blur" style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(255,255,255,0.92)' }}>
      <div className="d-flex align-items-center justify-content-around px-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `btn btn-link text-decoration-none d-flex flex-column align-items-center py-1.5 px-2 border-0 transition-all rounded-3 ${
                  isActive
                    ? 'text-indigo fw-black active-mobile-tab'
                    : 'text-muted opacity-75 hover:opacity-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="position-relative">
                    <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-indigo' : ''}`} />
                    {isActive && (
                      <span className="position-absolute bottom-0 start-50 translate-middle-x rounded-circle bg-indigo" style={{ width: '4px', height: '4px', marginBottom: '-4px' }}></span>
                    )}
                  </div>
                  <span className="mt-1 font-bold" style={{ fontSize: '0.65rem', letterSpacing: '-0.01em' }}>
                    {link.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
