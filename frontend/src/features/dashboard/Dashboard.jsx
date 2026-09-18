import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardSummary } from '../../services/dashboardApi';
import { getProjects } from '../../services/projectsApi';
import { getSites, getCarbonMetrics, getBiodiversityMetrics } from '../../services/sitesApi';
import { CarbonChart } from './CarbonChart';
import { BiodiversityChart } from './BiodiversityChart';

const KpiCard = ({ label, value, sub, color = 'var(--color-primary)' }) => (
  <div
    style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem 1.5rem',
      flex: '1 1 180px',
    }}
  >
    <div
      style={{
        fontSize: '0.75rem',
        fontWeight: 500,
        color: 'var(--color-text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '0.5rem',
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: '2rem', fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
    {sub && (
      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
        {sub}
      </div>
    )}
  </div>
);

/* ---- Chart card wrapper ---- */
const ChartCard = ({ title, children }) => (
  <div
    style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem 1.5rem',
      flex: '1 1 340px',
      minWidth: 0,
    }}
  >
    <div
      style={{
        fontSize: '0.875rem',
        fontWeight: 600,
        marginBottom: '1rem',
        color: 'var(--color-text)',
      }}
    >
      {title}
    </div>
    {children}
  </div>
);

export const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sites, setSites] = useState([]);
  const [carbonMetrics, setCarbonMetrics] = useState([]);
  const [biodiversityMetrics, setBiodiversityMetrics] = useState([]);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setIsLoading(true);
        const [sum, projects] = await Promise.all([getDashboardSummary(), getProjects()]);
        if (cancelled) return;
        setSummary(sum);

        // Fetch sites across all projects (capped at 5 for speed)
        const allSites = [];
        for (const proj of projects.slice(0, 5)) {
          try {
            const s = await getSites(proj.id);
            allSites.push(...s);
          } catch {
            /* skip */
          }
        }
        if (cancelled) return;
        setSites(allSites);

        // Fetch metrics for up to 3 sites
        const carbon = [];
        const bio = [];
        for (const site of allSites.slice(0, 3)) {
          try {
            const [c, b] = await Promise.all([
              getCarbonMetrics(site.id),
              getBiodiversityMetrics(site.id),
            ]);
            carbon.push(...c);
            bio.push(...b);
          } catch {
            /* skip */
          }
        }
        if (cancelled) return;
        setCarbonMetrics(carbon);
        setBiodiversityMetrics(bio);
        setLastUpdated(new Date());
      } catch {
        if (!cancelled) setError('Failed to load dashboard data.');
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setError('');
    // Re-trigger by temporarily bumping a key — simplest pattern without duplicating logic
    window.location.reload();
  };

  const statusColor = (s) =>
    s === 'Active'
      ? 'var(--color-healthy)'
      : s === 'Planning'
        ? 'var(--color-info)'
        : s === 'Monitoring'
          ? 'var(--color-warning)'
          : 'var(--color-neutral)';

  if (isLoading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div
          style={{
            height: '1.75rem',
            width: '220px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-border)',
            marginBottom: '0.5rem',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
        <div
          style={{
            height: '1rem',
            width: '300px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-border)',
            marginBottom: '2rem',
            animation: 'pulse 1.5s ease-in-out infinite',
            opacity: 0.6,
          }}
        />
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                flex: '1 1 160px',
                height: '100px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-border)',
                animation: 'pulse 1.5s ease-in-out infinite',
                opacity: 1 - i * 0.12,
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
          {[1, 2].map((i) => (
            <div
              key={i}
              style={{
                flex: '1 1 340px',
                height: '280px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-border)',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div
          className="alert alert--error"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>{error}</span>
          <button className="btn btn--secondary btn--sm" onClick={handleRefresh}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Page header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)' }}>
            Portfolio Dashboard
          </h1>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: '0.875rem',
              marginTop: '0.25rem',
            }}
          >
            Environmental impact summary across all projects and sites.
            {lastUpdated && (
              <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.5rem' }}>
                · Updated{' '}
                {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </p>
        </div>
        <button
          className="btn btn--secondary btn--sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          style={{ flexShrink: 0 }}
        >
          {isRefreshing ? 'Refreshing…' : '↻ Refresh'}
        </button>
      </div>

      {/* KPI row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <KpiCard label="Total Projects" value={summary?.total_projects ?? 0} />
        <KpiCard label="Total Sites" value={summary?.total_sites ?? 0} />
        <KpiCard
          label="Total Area"
          value={`${summary?.total_area_ha ?? 0} ha`}
          sub="across all sites"
        />
        <KpiCard
          label="Avg Biodiversity Index"
          value={
            summary?.avg_biodiversity_index != null
              ? summary.avg_biodiversity_index.toFixed(3)
              : '—'
          }
          sub="0–1 scale"
          color={
            summary?.avg_biodiversity_index != null
              ? summary.avg_biodiversity_index >= 0.7
                ? 'var(--color-healthy)'
                : 'var(--color-warning)'
              : 'var(--color-text-muted)'
          }
        />

        <KpiCard
          label="Avg Carbon Est."
          value={summary?.avg_carbon_estimate != null ? `${summary.avg_carbon_estimate} t` : '—'}
          sub="CO₂e tonnes"
          color="var(--color-info)"
        />
      </div>

      {/* Status breakdown */}
      {summary && Object.keys(summary.projects_by_status).length > 0 && (
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
            Projects by Status
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {Object.entries(summary.projects_by_status).map(([status, count]) => (
              <div
                key={status}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '2rem',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.875rem',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: statusColor(status),
                    display: 'inline-block',
                  }}
                />
                <span style={{ fontWeight: 500 }}>{status}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2rem' }}>
        <ChartCard title="Carbon Sequestration Over Time (CO₂e tonnes)">
          <CarbonChart metrics={carbonMetrics} />
        </ChartCard>
        <ChartCard title="Biodiversity Index Over Time">
          <BiodiversityChart metrics={biodiversityMetrics} />
        </ChartCard>
      </div>

      {/* Sites table */}
      {sites.length > 0 && (
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid var(--color-border)',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            Recent Sites
          </div>
          <table className="data-table" style={{ border: 'none', borderRadius: 0 }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Ecosystem</th>
                <th>Area (ha)</th>
                <th>Carbon Est.</th>
                <th>Bio Index</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sites.slice(0, 8).map((site) => (
                <tr key={site.id}>
                  <td style={{ fontWeight: 500 }}>{site.name}</td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>
                    {site.ecosystem_type || '—'}
                  </td>
                  <td>{site.area != null ? `${site.area.toFixed(2)}` : '—'}</td>
                  <td>
                    {site.current_carbon_estimate != null
                      ? `${site.current_carbon_estimate} t`
                      : '—'}
                  </td>
                  <td>
                    {site.biodiversity_index != null ? site.biodiversity_index.toFixed(3) : '—'}
                  </td>
                  <td>
                    <span
                      className={`badge badge--${site.monitoring_status === 'Active' ? 'healthy' : 'neutral'}`}
                    >
                      {site.monitoring_status || 'Unknown'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sites.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--color-text-secondary)',
          }}
        >
          <p style={{ marginBottom: '1rem' }}>No sites have been added yet.</p>
          <Link to="/projects" className="btn btn--primary">
            Go to Projects → Add Sites
          </Link>
        </div>
      )}
    </div>
  );
};
