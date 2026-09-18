import React, { useState } from 'react';
import { getProjects, type Project } from '../../services/projectsApi';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { FolderOpen, Plus, MapPin, Eye } from 'lucide-react';

const statusStyles: Record<string, { bg: string; color: string }> = {
  Active:     { bg: 'var(--color-healthy-bg)',  color: 'var(--color-healthy)'  },
  Planning:   { bg: 'var(--color-info-bg)',      color: 'var(--color-info)'     },
  Monitoring: { bg: 'var(--color-warning-bg)',   color: 'var(--color-warning)'  },
  Completed:  { bg: 'var(--color-neutral-bg)',   color: 'var(--color-neutral)'  },
};

export const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setIsLoading(true);
        const data = await getProjects();
        if (!cancelled) setProjects(data);
      } catch {
        if (!cancelled) setError('Failed to load projects. Please refresh.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ height: '1.75rem', width: '200px', borderRadius: 'var(--radius-md)', background: 'var(--color-border)', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <div style={{ height: '2.25rem', width: '130px', borderRadius: 'var(--radius-md)', background: 'var(--color-border)', animation: 'pulse 1.5s ease-in-out infinite' }} />
        </div>
        {[1,2,3].map(i => (
          <div key={i} style={{ height: '3.5rem', marginBottom: '0.5rem', borderRadius: 'var(--radius-md)', background: 'var(--color-border)', opacity: 1 - i * 0.2, animation: 'pulse 1.5s ease-in-out infinite' }} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem 1.5rem' }}>
        <div style={{ padding: '1rem 1.25rem', background: 'var(--color-critical-bg)', color: 'var(--color-critical)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.25rem' }}>
            Environmental Projects
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            {projects.length} project{projects.length !== 1 ? 's' : ''} in your portfolio
          </p>
        </div>
        <Link to="/projects/new" style={{ textDecoration: 'none' }}>
          <button className="btn btn--primary">
            <Plus size={15} />
            Create Project
          </button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'var(--color-surface)',
          border: '1px dashed var(--color-border-strong)',
          borderRadius: 'var(--radius-lg)',
        }}>
          <div style={{
            width: '3.5rem', height: '3.5rem',
            borderRadius: '50%',
            background: 'var(--color-primary-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
          }}>
            <FolderOpen size={22} color="var(--color-primary)" />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Your portfolio is empty</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', maxWidth: '320px', margin: '0 auto 1.5rem' }}>
            Create your first project to start tracking carbon sequestration and biodiversity impact.
          </p>
          <Link to="/projects/new" style={{ textDecoration: 'none' }}>
            <button className="btn btn--primary"><Plus size={15} /> Create First Project</button>
          </Link>
        </div>
      ) : (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <table className="data-table" style={{ border: 'none', borderRadius: 0 }}>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Status</th>
                <th>Type</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const s = statusStyles[project.status] ?? statusStyles['Completed'];
                return (
                  <tr key={project.id}>
                    <td style={{ fontWeight: 600, color: 'var(--color-text)' }}>{project.name}</td>
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                        padding: '2px 10px',
                        borderRadius: '2rem',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        background: s.bg,
                        color: s.color,
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
                        {project.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{project.type || '—'}</td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                      {new Date(project.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/projects/${project.id}/sites`} style={{ textDecoration: 'none' }}>
                          <button className="btn btn--secondary btn--sm" title="Manage Sites">
                            <MapPin size={13} /> Sites
                          </button>
                        </Link>
                        <Link to={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
                          <button className="btn btn--secondary btn--sm" title="View Project">
                            <Eye size={13} /> View
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
