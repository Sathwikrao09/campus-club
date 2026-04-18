import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const CAT_COLORS = {
  Technical: { bg: '#E6F1FB', c: '#185FA5' },
  Cultural:  { bg: '#FAEEDA', c: '#BA7517' },
  Sports:    { bg: '#EAF3DE', c: '#3B6D11' },
  Academic:  { bg: '#EEEDFE', c: '#533AB7' },
  Social:    { bg: '#FAECE7', c: '#993C1D' },
};
export const CAT_EMOJI = { Technical: '⚙️', Cultural: '🎭', Sports: '⚽', Academic: '📚', Social: '🤝' };
export { CAT_COLORS };

const avatarColors = {
  student:    { bg: '#EEEDFE', c: '#533AB7' },
  clubadmin:  { bg: '#E6F1FB', c: '#185FA5' },
  superadmin: { bg: '#E1F5EE', c: '#085041' },
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (user?.role === 'superadmin') {
      api.get('/events?status=pending').then(r => setPendingCount(r.data.length)).catch(() => {});
    }
  }, [user]);

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || '??';
  const ac = avatarColors[user?.role] || avatarColors.student;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-name">Campus<br />Events</div>
          <div className="logo-tag">Club Management System</div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">Main</div>
          <NavLink to="/" end className={({isActive})=>`nav-item${isActive?' active':''}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>
            Dashboard
          </NavLink>
          <NavLink to="/calendar" className={({isActive})=>`nav-item${isActive?' active':''}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="2" width="14" height="13" rx="1.5"/><path d="M1 6h14M5 1v3M11 1v3"/></svg>
            Calendar
          </NavLink>
          <NavLink to="/events" className={({isActive})=>`nav-item${isActive?' active':''}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 4h10M3 8h7M3 12h5"/></svg>
            All Events
          </NavLink>

          {(user?.role === 'clubadmin' || user?.role === 'superadmin') && (
            <>
              <div className="nav-section">Club Admin</div>
              <NavLink to="/submit" className={({isActive})=>`nav-item${isActive?' active':''}`}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="7"/><path d="M8 5v6M5 8h6"/></svg>
                Submit Event
              </NavLink>
            </>
          )}

          {user?.role === 'superadmin' && (
            <NavLink to="/review" className={({isActive})=>`nav-item${isActive?' active':''}`}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3z"/><path d="M5 7l2 2 4-4"/></svg>
              Review Requests
              {pendingCount > 0 && <span className="nav-badge">{pendingCount}</span>}
            </NavLink>
          )}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar" style={{ background: ac.bg, color: ac.c }}>{initials}</div>
            <div>
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Sign out</button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
