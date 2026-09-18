import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import { Leaf, Eye, EyeOff } from 'lucide-react';

const AuthLayout = ({ children }) => (
  <div style={{ minHeight: '100vh', display: 'flex' }}>
    <div
      style={{
        display: 'none',
        flex: '0 0 420px',
        background: 'linear-gradient(160deg, #1a472a 0%, #2d6a4f 60%, #40916c 100%)',
        padding: '3rem',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: '#fff',
      }}
      className="auth-brand-panel"
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '3rem' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Leaf size={18} />
          </div>
          <span style={{ fontWeight: 700, letterSpacing: '0.05em', fontSize: '0.9rem' }}>
            DARUKAA.EARTH
          </span>
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '1rem' }}>
          Join the mission to restore our planet.
        </h2>
        <p style={{ opacity: 0.8, lineHeight: 1.65, fontSize: '0.95rem' }}>
          Monitor and report on nature-based solutions with scientific-grade geospatial tools, built
          for conservation professionals.
        </p>
      </div>
      <p style={{ opacity: 0.5, fontSize: '0.75rem' }}>
        © 2024 Darukaa.Earth. All rights reserved.
      </p>
    </div>
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'var(--color-bg)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem' }}
        >
          <Leaf size={18} color="var(--color-primary)" />
          <span
            style={{
              fontWeight: 700,
              fontSize: '0.875rem',
              letterSpacing: '0.06em',
              color: 'var(--color-primary)',
            }}
          >
            DARUKAA.EARTH
          </span>
        </div>
        {children}
      </div>
    </div>
  </div>
);

export const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (password.length < 8) {
      setErrors({ password: 'Password must be at least 8 characters.' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;
    setIsLoading(true);
    try {
      await apiClient.post('/auth/register', { email, password, full_name: fullName });
      navigate('/login');
    } catch (err) {
      const axiosErr = err;
      setErrors({
        general: axiosErr.response?.data?.detail ?? 'Registration failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1
        style={{
          fontSize: '1.625rem',
          fontWeight: 700,
          color: 'var(--color-text)',
          marginBottom: '0.25rem',
        }}
      >
        Create your account
      </h1>
      <p
        style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '2rem' }}
      >
        Start tracking environmental impact today
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field__label" htmlFor="reg-name">
            Full name
          </label>
          <input
            id="reg-name"
            className="field__input"
            type="text"
            autoComplete="name"
            placeholder="Jane Smith"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field__label field__label--required" htmlFor="reg-email">
            Email address
          </label>
          <input
            id="reg-email"
            className="field__input"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label className="field__label field__label--required" htmlFor="reg-password">
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="reg-password"
              className="field__input"
              type={showPw ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingRight: '2.75rem' }}
            />

            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-muted)',
                display: 'flex',
              }}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <span className="field__error">{errors.password}</span>}
        </div>

        {errors.general && (
          <div className="alert alert--error" style={{ marginBottom: '1rem' }}>
            {errors.general}
          </div>
        )}

        <button
          type="submit"
          className="btn btn--primary w-full"
          style={{ marginTop: '0.5rem', justifyContent: 'center', padding: '0.65rem 1rem' }}
          disabled={isLoading}
        >
          {isLoading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p
        style={{
          marginTop: '1.5rem',
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)',
          textAlign: 'center',
        }}
      >
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};
