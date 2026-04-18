import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const VENUES = ['Main Auditorium','Seminar Hall A','Seminar Hall B','Open Air Theatre','Sports Ground','Conference Room 101','Library Hall'];
const CATEGORIES = ['Technical','Cultural','Sports','Academic','Social'];
const CLUBS = ['Tech Club','Cultural Committee','Sports Council','IEEE Student Branch','Drama Club','Photography Club','NSS Unit','Music Society'];

export default function SubmitEventPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', clubName: user?.clubName || '', category: 'Technical',
    dateTime: '', venue: 'Main Auditorium', description: '', expectedAttendees: '',
  });
  const [errors, setErrors] = useState({});

  const handle = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Event name is required';
    if (!form.clubName.trim()) e.clubName = 'Club name is required';
    if (!form.dateTime) e.dateTime = 'Date and time is required';
    if (form.dateTime && new Date(form.dateTime) < new Date()) e.dateTime = 'Date must be in the future';
    if (!form.description.trim()) e.description = 'Description is required';
    if (form.description.trim().length < 20) e.description = 'Description must be at least 20 characters';
    return e;
  };

  const submit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await api.post('/events', { ...form, expectedAttendees: parseInt(form.expectedAttendees) || 0 });
      toast.success('Event submitted for review!');
      navigate('/events');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally { setLoading(false); }
  };

  return (
    <>
      <div className="topbar">
        <div>
          <div className="page-title">Submit Event</div>
          <div className="page-sub">Fill in the details to submit a new event for approval</div>
        </div>
      </div>
      <div className="page-content">
        <div className="form-panel">
          <div className="form-title">New Event Request</div>
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Event Name *</label>
              <input className="form-input" name="name" value={form.name} onChange={handle} placeholder="e.g. Annual Tech Fest 2025" />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Club Name *</label>
                {user?.role === 'clubadmin' && user?.clubName ? (
                  <input className="form-input" value={form.clubName} readOnly style={{ background: 'var(--bg)' }} />
                ) : (
                  <select className="form-select" name="clubName" value={form.clubName} onChange={handle}>
                    <option value="">Select club…</option>
                    {CLUBS.map(c => <option key={c}>{c}</option>)}
                  </select>
                )}
                {errors.clubName && <div className="form-error">{errors.clubName}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-select" name="category" value={form.category} onChange={handle}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date & Time *</label>
                <input className="form-input" name="dateTime" type="datetime-local" value={form.dateTime} onChange={handle} />
                {errors.dateTime && <div className="form-error">{errors.dateTime}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Expected Attendees</label>
                <input className="form-input" name="expectedAttendees" type="number" min="0" value={form.expectedAttendees} onChange={handle} placeholder="e.g. 150" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Venue *</label>
              <select className="form-select" name="venue" value={form.venue} onChange={handle}>
                {VENUES.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea className="form-textarea" name="description" value={form.description} onChange={handle}
                placeholder="Describe the event, its goals, activities, and what participants can expect..." />
              {errors.description && <div className="form-error">{errors.description}</div>}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Submitting…' : 'Submit for Approval'}
              </button>
              <button className="btn" type="button" onClick={() => navigate(-1)}>Cancel</button>
            </div>
            <div className="form-hint" style={{ marginTop: 10 }}>
              Events are reviewed by faculty admins within 2 working days. You'll see the status update in All Events.
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
