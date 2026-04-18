import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';

const CATS = ['All', 'Technical', 'Cultural', 'Sports', 'Academic', 'Social'];

export default function DashboardPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    try {
      const [approvedRes, allRes] = await Promise.all([
        api.get('/events/approved'),
        user.role !== 'student' ? api.get('/events') : Promise.resolve({ data: [] }),
      ]);
      const approved = approvedRes.data;
      const all = user.role !== 'student' ? allRes.data : approved;
      setEvents(approved);
      setAllEvents(all);
      setStats({
        total: all.length,
        approved: approved.length,
        pending: all.filter(e => e.status === 'pending').length,
      });
    } catch { toast.error('Failed to load events'); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id) => {
    try {
      await api.put(`/events/${id}/approve`);
      toast.success('Event approved!');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/events/${id}/reject`);
      toast.error('Event rejected.');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const filtered = filter === 'All' ? events : events.filter(e => e.category === filter);

  return (
    <>
      <div className="topbar">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Welcome back, {user?.name?.split(' ')[0]}! Here's what's happening on campus.</div>
        </div>
        {(user?.role === 'clubadmin' || user?.role === 'superadmin') && (
          <div className="topbar-actions">
            <Link to="/submit" className="btn btn-primary">+ Submit Event</Link>
          </div>
        )}
      </div>
      <div className="page-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Events</div>
            <div className="stat-value">{stats.total}</div>
            <span className="stat-badge" style={{ background: 'var(--blue-light)', color: 'var(--blue)' }}>This semester</span>
          </div>
          <div className="stat-card">
            <div className="stat-label">Approved</div>
            <div className="stat-value">{stats.approved}</div>
            <span className="stat-badge" style={{ background: 'var(--accent-light)', color: 'var(--accent-dark)' }}>Live now</span>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending Review</div>
            <div className="stat-value">{stats.pending}</div>
            <span className="stat-badge" style={{ background: 'var(--amber-light)', color: 'var(--amber)' }}>Awaiting approval</span>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Clubs</div>
            <div className="stat-value">8</div>
            <span className="stat-badge" style={{ background: 'var(--purple-light)', color: 'var(--purple)' }}>On campus</span>
          </div>
        </div>

        <div className="section-header">
          <div className="section-title">Upcoming Approved Events</div>
          <div className="filter-row">
            {CATS.map(c => (
              <span key={c} className={`filter-pill${filter === c ? ' active' : ''}`} onClick={() => setFilter(c)}>{c}</span>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📋</div><div className="empty-text">No events found</div></div>
        ) : (
          <div className="events-grid">
            {filtered.map(e => (
              <EventCard key={e._id} event={e} onCardClick={setSelected}
                showActions={user?.role === 'superadmin'} onApprove={handleApprove} onReject={handleReject} />
            ))}
          </div>
        )}
      </div>
      {selected && <EventModal event={selected} onClose={() => setSelected(null)} onApprove={handleApprove} onReject={handleReject} />}
    </>
  );
}
