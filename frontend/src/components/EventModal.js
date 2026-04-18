import React from 'react';
import { CAT_COLORS, CAT_EMOJI } from './Layout';
import { useAuth } from '../context/AuthContext';

export default function EventModal({ event, onClose, onApprove, onReject }) {
  const { user } = useAuth();
  if (!event) return null;
  const cc = CAT_COLORS[event.category] || { bg: '#F1EFE8', c: '#5F5E5A' };
  const d = new Date(event.dateTime);
  const dateStr = d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{event.name}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <span className={`status-badge ${event.status}`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: cc.c, background: cc.bg, padding: '2px 10px', borderRadius: 20 }}>
            {CAT_EMOJI[event.category]} {event.category}
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.7 }}>{event.description}</p>
        <div className="modal-grid">
          <div className="modal-field">
            <div className="modal-field-label">Club</div>
            <div className="modal-field-value">{event.clubName}</div>
          </div>
          <div className="modal-field">
            <div className="modal-field-label">Venue</div>
            <div className="modal-field-value">{event.venue}</div>
          </div>
          <div className="modal-field">
            <div className="modal-field-label">Date</div>
            <div className="modal-field-value" style={{ fontSize: 12 }}>{dateStr}</div>
          </div>
          <div className="modal-field">
            <div className="modal-field-label">Time & Attendees</div>
            <div className="modal-field-value">{timeStr} · {event.expectedAttendees} expected</div>
          </div>
          {event.submittedBy && (
            <div className="modal-field">
              <div className="modal-field-label">Submitted by</div>
              <div className="modal-field-value">{event.submittedBy.name}</div>
            </div>
          )}
          {event.reviewedBy && (
            <div className="modal-field">
              <div className="modal-field-label">Reviewed by</div>
              <div className="modal-field-value">{event.reviewedBy.name}</div>
            </div>
          )}
        </div>
        {event.reviewNote && (
          <div style={{ marginTop: 12, padding: '10px 12px', background: 'var(--bg)', borderRadius: 'var(--r)', fontSize: 12, color: 'var(--text-sub)' }}>
            <strong>Review note:</strong> {event.reviewNote}
          </div>
        )}
        {user?.role === 'superadmin' && event.status === 'pending' && (
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="btn btn-success" onClick={() => { onApprove(event._id); onClose(); }}>✓ Approve Event</button>
            <button className="btn btn-danger" onClick={() => { onReject(event._id); onClose(); }}>✗ Reject Event</button>
          </div>
        )}
      </div>
    </div>
  );
}
