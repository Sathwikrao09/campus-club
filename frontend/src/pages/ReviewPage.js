import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { CAT_COLORS, CAT_EMOJI } from '../components/Layout';
import EventModal from '../components/EventModal';

export default function ReviewPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');
  const [selected, setSelected] = useState(null);
  const [noteMap, setNoteMap] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/events');
      setEvents(data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id) => {
    try {
      await api.put(`/events/${id}/approve`, { note: noteMap[id] || '' });
      toast.success('Event approved!');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/events/${id}/reject`, { note: noteMap[id] || '' });
      toast.error('Event rejected.');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const pending = events.filter(e => e.status === 'pending');
  const show = tab === 'pending' ? pending : events;

  return (
    <>
      <div className="topbar">
        <div>
          <div className="page-title">Review Requests</div>
          <div className="page-sub">Approve or reject club event submissions</div>
        </div>
        <div className="topbar-actions">
          <span style={{ fontSize: 12, color: 'var(--text-hint)', background: 'var(--amber-light)', color: 'var(--amber)', padding: '5px 12px', borderRadius: 20, fontWeight: 500 }}>
            {pending.length} pending
          </span>
        </div>
      </div>
      <div className="page-content">
        <div className="tabs">
          <button className={`tab${tab === 'pending' ? ' active' : ''}`} onClick={() => setTab('pending')}>
            Pending Review ({pending.length})
          </button>
          <button className={`tab${tab === 'all' ? ' active' : ''}`} onClick={() => setTab('all')}>
            All Submissions ({events.length})
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
        ) : show.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">🎉</div><div className="empty-text">No pending reviews!</div></div>
        ) : (
          <div className="review-list">
            {show.map(e => {
              const cc = CAT_COLORS[e.category] || { bg: '#F1EFE8', c: '#5F5E5A' };
              const d = new Date(e.dateTime);
              const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
              return (
                <div key={e._id} className="review-item">
                  <div className="review-icon" style={{ background: cc.bg, color: cc.c }}>
                    {CAT_EMOJI[e.category] || '📌'}
                  </div>
                  <div className="review-info" style={{ cursor: 'pointer' }} onClick={() => setSelected(e)}>
                    <div className="review-name">{e.name}</div>
                    <div className="review-meta">
                      {e.clubName} · {dateStr} · {e.venue}
                      {e.submittedBy && <span> · by {e.submittedBy.name}</span>}
                    </div>
                    {e.status !== 'pending' && (
                      <span className={`status-badge ${e.status}`} style={{ marginTop: 4, display: 'inline-block' }}>
                        {e.status.charAt(0).toUpperCase() + e.status.slice(1)}
                      </span>
                    )}
                  </div>
                  {e.status === 'pending' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 220 }}>
                      <input
                        className="form-input"
                        style={{ fontSize: 11, padding: '5px 8px' }}
                        placeholder="Optional review note…"
                        value={noteMap[e._id] || ''}
                        onChange={ev => setNoteMap(n => ({ ...n, [e._id]: ev.target.value }))}
                      />
                      <div className="review-actions">
                        <button className="btn btn-sm btn-success" onClick={() => handleApprove(e._id)}>✓ Approve</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleReject(e._id)}>✗ Reject</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {selected && <EventModal event={selected} onClose={() => setSelected(null)} onApprove={handleApprove} onReject={handleReject} />}
    </>
  );
}
