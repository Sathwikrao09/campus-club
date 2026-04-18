import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (email, password) => {
    setLoading(true);
    try { await login(email, password); navigate('/'); }
    catch { toast.error('Quick login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Campus Events</div>
        <div className="auth-tagline">Club Event Management System</div>
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input className="form-input" name="email" type="email" value={form.email} onChange={handle} placeholder="you@campus.edu" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: 20, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--text-hint)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.05em' }}>Quick login (demo)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { label: '🎓 Super Admin', email: 'admin@campus.edu', pw: 'admin123' },
              { label: '🏛️ Club Admin', email: 'rahul@campus.edu', pw: 'rahul123' },
              { label: '👤 Student', email: 'student@campus.edu', pw: 'student123' },
            ].map(({ label, email, pw }) => (
              <button key={email} className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start', fontSize: 12 }}
                onClick={() => quickLogin(email, pw)}>
                {label} — <span style={{ color: 'var(--text-hint)' }}>{email}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
