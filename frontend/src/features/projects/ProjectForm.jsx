import React, { useState } from 'react';
import { createProject } from '../../services/projectsApi';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Leaf } from 'lucide-react';

const PROJECT_TYPES = [
  'Reforestation',
  'Mangrove Restoration',
  'Wetland Conservation',
  'Grassland Management',
  'Agroforestry',
  'Other',
];

export const ProjectForm = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('Planning');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await createProject({ name: name.trim(), type, status });
      navigate('/projects');
    } catch {
      setError('Failed to create project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '640px', margin: '0 auto' }}>
      {/* Back */}
      <Link
        to="/projects"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)',
          textDecoration: 'none',
          marginBottom: '1.5rem',
        }}
      >
        <ArrowLeft size={14} /> Back to Projects
      </Link>

      {/* Card */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}
      >
        {/* Card header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <div
            style={{
              width: '2.25rem',
              height: '2.25rem',
              borderRadius: '50%',
              background: 'var(--color-primary-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Leaf size={16} color="var(--color-primary)" />
          </div>
          <div>
            <h1 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)' }}>
              New Environmental Project
            </h1>
            <p
              style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '1px' }}
            >
              Create a project to start tracking carbon &amp; biodiversity impact.
            </p>
          </div>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          <div className="field">
            <label className="field__label field__label--required" htmlFor="proj-name">
              Project Name
            </label>
            <input
              id="proj-name"
              className="field__input"
              placeholder="e.g. Western Ghats Reforestation Initiative"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="proj-type">
              Project Type
            </label>
            <select
              id="proj-type"
              className="field__select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select a type…</option>
              {PROJECT_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="proj-status">
              Initial Status
            </label>
            <select
              id="proj-status"
              className="field__select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="Monitoring">Monitoring</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="proj-desc">
              Description{' '}
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              id="proj-desc"
              className="field__textarea"
              rows={3}
              placeholder="Brief description of the project's goals and location…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ resize: 'vertical', minHeight: '4rem' }}
            />
          </div>

          {error && (
            <div
              style={{
                padding: '0.6rem 1rem',
                background: 'var(--color-critical-bg)',
                color: 'var(--color-critical)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                marginBottom: '1rem',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <button type="submit" className="btn btn--primary" disabled={isLoading}>
              {isLoading ? 'Creating…' : 'Create Project'}
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => navigate('/projects')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
