import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';

const TABS = ['all', 'approved', 'pending', 'rejected'];

export default function AllEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = user.role === 'student' ? '/events/approved' : '/events';
      const { data } = await api.get(endpoint);
      setEvents(data);
    } catch { toast.error('Failed to load events'); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id) => {
    try { await api.put(`/events/${id}/approve`); toast.success('Approved!'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleReject = async (id) => {
    try { await api.put(`/events/${id}/reject`); toast.error('Rejected.'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const filtered = tab === 'all' ? events : events.filter(e => e.status === tab);

  return (
    <>
      <div className="topbar">
        <div>
          <div className="page-title">All Events</div>
          <div className="page-sub">Complete list of all submitted events</div>
        </div>
      </div>
      <div className="page-content">
        {user.role !== 'student' && (
          <div className="tabs">
            {TABS.map(t => (
              <button key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
                {' '}
                <span style={{ fontSize: 11, color: tab === t ? 'var(--accent)' : 'var(--text-hint)' }}>
                  ({(t === 'all' ? events : events.filter(e => e.status === t)).length})
                </span>
              </button>
            ))}
          </div>
        )}
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
