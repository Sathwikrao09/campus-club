import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', clubName: '' });
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Campus Events</div>
        <div className="auth-tagline">Create your account</div>
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input className="form-input" name="name" value={form.name} onChange={handle} placeholder="Your full name" required />
          </div>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input className="form-input" name="email" type="email" value={form.email} onChange={handle} placeholder="you@campus.edu" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" name="password" type="password" value={form.password} onChange={handle} placeholder="Min. 6 characters" required />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-select" name="role" value={form.role} onChange={handle}>
              <option value="student">Student</option>
              <option value="clubadmin">Club Admin</option>
            </select>
            <div className="form-hint">Super Admin accounts are created by the system administrator.</div>
          </div>
          {form.role === 'clubadmin' && (
            <div className="form-group">
              <label className="form-label">Club Name</label>
              <input className="form-input" name="clubName" value={form.clubName} onChange={handle} placeholder="e.g. Tech Club" required />
            </div>
          )}
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
