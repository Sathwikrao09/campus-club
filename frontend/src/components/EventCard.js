import React from 'react';
import { CAT_COLORS, CAT_EMOJI } from './Layout';

export default function EventCard({ event, onCardClick, onApprove, onReject, showActions }) {
  const cc = CAT_COLORS[event.category] || { bg: '#F1EFE8', c: '#5F5E5A' };
  const d = new Date(event.dateTime);
  const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`event-card ${event.status}`} onClick={() => onCardClick && onCardClick(event)}>
      <div className="event-top">
        <span className="event-cat" style={{ color: cc.c }}>
          {CAT_EMOJI[event.category]} {event.category}
        </span>
        <span className={`status-badge ${event.status}`}>
          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
        </span>
      </div>
      <div className="event-name">{event.name}</div>
      <div className="event-club">{event.clubName}</div>
      <div className="event-meta">
        <div className="meta-row">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="2" width="14" height="13" rx="1.5"/><path d="M1 6h14"/></svg>
          {dateStr} · {timeStr}
        </div>
        <div className="meta-row">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 1C5.24 1 3 3.24 3 6c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5z"/><circle cx="8" cy="6" r="1.5"/></svg>
          {event.venue}
        </div>
        <div className="meta-row">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="5" r="3"/><path d="M2 14c0-3.31 2.69-6 6-6s6 2.69 6 6"/></svg>
          {event.expectedAttendees || '—'} attendees
        </div>
      </div>
      {showActions && event.status === 'pending' && (
        <div className="event-footer" onClick={e => e.stopPropagation()}>
          <button className="btn btn-sm btn-success" onClick={() => onApprove(event._id)}>✓ Approve</button>
          <button className="btn btn-sm btn-danger" onClick={() => onReject(event._id)}>✗ Reject</button>
        </div>
      )}
    </div>
  );
}
