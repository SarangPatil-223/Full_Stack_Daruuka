import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { apiClient } from '../../services/apiClient';
import { AxiosError } from 'axios';
import { Leaf, Eye, EyeOff } from 'lucide-react';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ minHeight: '100vh', display: 'flex' }}>
    {/* Left — brand panel */}
    <div style={{
      display: 'none',
      flex: '0 0 420px',
      background: 'linear-gradient(160deg, #1a472a 0%, #2d6a4f 60%, #40916c 100%)',
      padding: '3rem',
      flexDirection: 'column',
      justifyContent: 'space-between',
      color: '#fff',
    }} className="auth-brand-panel">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '3rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf size={18} />
          </div>
          <span style={{ fontWeight: 700, letterSpacing: '0.05em', fontSize: '0.9rem' }}>DARUKAA.EARTH</span>
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '1rem' }}>
          Measure what matters for the planet.
        </h2>
        <p style={{ opacity: 0.8, lineHeight: 1.65, fontSize: '0.95rem' }}>
          Track carbon sequestration and biodiversity impact across your environmental restoration projects with precision geospatial analytics.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '2rem' }}>
        {[['500+', 'Projects tracked'], ['98%', 'Data accuracy'], ['12M ha', 'Area monitored']].map(([val, label]) => (
          <div key={label}>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{val}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Right — form panel */}
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--color-bg)' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        {/* Mobile logo only */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem' }} className="auth-mobile-logo">
          <Leaf size={18} color="var(--color-primary)" />
          <span style={{ fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.06em', color: 'var(--color-primary)' }}>DARUKAA.EARTH</span>
        </div>
        {children}
      </div>
    </div>
  </div>
);

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      const res = await apiClient.post<{ access_token: string }>('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      login(res.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      const axiosErr = err as AxiosError<{ detail: string }>;
      setError(axiosErr.response?.data?.detail ?? 'Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 style={{ fontSize: '1.625rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.25rem' }}>Welcome back</h1>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Sign in to your Darukaa account</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field__label" htmlFor="login-email">Email address</label>
          <input id="login-email" className="field__input" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="login-password">Password</label>
          <div style={{ position: 'relative' }}>
            <input
              id="login-password"
              className="field__input"
              type={showPw ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ paddingRight: '2.75rem' }}
            />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && <div className="alert alert--error" style={{ marginBottom: '1rem' }}>{error}</div>}

        <button type="submit" className="btn btn--primary w-full" style={{ marginTop: '0.5rem', justifyContent: 'center', padding: '0.65rem 1rem' }} disabled={isLoading}>
          {isLoading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
        No account? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>Create one</Link>
      </p>
    </AuthLayout>
  );
};
