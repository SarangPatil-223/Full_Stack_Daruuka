import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapDraw } from './MapDraw';
import { getSites, createSite, deleteSite } from '../../services/sitesApi';

export const SiteManager = () => {
  const { projectId } = useParams();
  const [sites, setSites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // New site form state
  const [siteName, setSiteName] = useState('');
  const [ecosystemType, setEcosystemType] = useState('');
  const [drawnGeometry, setDrawnGeometry] = useState(null);
  const [drawnAreaM2, setDrawnAreaM2] = useState(null);

  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;
    async function load() {
      try {
        setIsLoading(true);
        const data = await getSites(projectId);
        if (!cancelled) setSites(data);
      } catch {
        if (!cancelled) setError('Failed to load sites.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const handlePolygonDrawn = (geojson, areaM2) => {
    setDrawnGeometry(geojson);
    setDrawnAreaM2(areaM2);
    setSaveMsg('');
  };

  const handleSaveSite = async () => {
    if (!siteName.trim()) {
      setSaveMsg('Please enter a site name.');
      return;
    }
    if (!drawnGeometry) {
      setSaveMsg('Please draw a polygon on the map first.');
      return;
    }
    try {
      setIsSaving(true);
      setSaveMsg('');
      const payload = {
        name: siteName.trim(),
        ecosystem_type: ecosystemType || undefined,
        geometry: drawnGeometry,
        area: drawnAreaM2 ? Math.round((drawnAreaM2 / 10000) * 100) / 100 : undefined, // convert m² → ha
        monitoring_status: 'Active',
      };
      const newSite = await createSite(projectId, payload);
      setSites((prev) => [newSite, ...prev]);
      setSiteName('');
      setEcosystemType('');
      setDrawnGeometry(null);
      setDrawnAreaM2(null);
      setSaveMsg('✅ Site saved successfully!');
    } catch {
      setSaveMsg('❌ Failed to save site. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (siteId) => {
    if (!confirm('Delete this site? This cannot be undone.')) return;
    try {
      await deleteSite(siteId);
      setSites((prev) => prev.filter((s) => s.id !== siteId));
    } catch {
      alert('Failed to delete site.');
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <Link
            to="/projects"
            style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}
          >
            ← Back to Projects
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '0.25rem' }}>
            Site Manager
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            Draw site boundaries on the map and save them to your project.
          </p>
        </div>
      </div>

      {/* Map */}
      <div style={{ marginBottom: '1.5rem' }}>
        <MapDraw onPolygonDrawn={handlePolygonDrawn} />
        {drawnGeometry && drawnAreaM2 !== null && (
          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.5rem 1rem',
              background: 'var(--color-healthy-bg)',
              color: 'var(--color-healthy)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
            }}
          >
            ✅ Polygon drawn — approx. <strong>{(drawnAreaM2 / 10000).toFixed(2)} ha</strong>. Fill
            in the form below and click Save.
          </div>
        )}
      </div>

      {/* New Site Form */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Add New Site</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr auto',
            gap: '0.75rem',
            alignItems: 'flex-end',
          }}
        >
          <div className="field" style={{ margin: 0 }}>
            <label className="field__label field__label--required">Site Name</label>
            <input
              className="field__input"
              placeholder="e.g. Western Forest Block"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label className="field__label">Ecosystem Type</label>
            <select
              className="field__select"
              value={ecosystemType}
              onChange={(e) => setEcosystemType(e.target.value)}
            >
              <option value="">Select type…</option>
              <option>Tropical Rainforest</option>
              <option>Mangrove</option>
              <option>Savanna</option>
              <option>Wetland</option>
              <option>Grassland</option>
              <option>Other</option>
            </select>
          </div>
          <button className="btn btn--primary" onClick={handleSaveSite} disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save Site'}
          </button>
        </div>
        {saveMsg && (
          <p
            style={{
              marginTop: '0.75rem',
              fontSize: '0.875rem',
              color: saveMsg.startsWith('✅') ? 'var(--color-healthy)' : 'var(--color-critical)',
            }}
          >
            {saveMsg}
          </p>
        )}
      </div>

      {/* Sites List */}
      <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
        Existing Sites {!isLoading && `(${sites.length})`}
      </h2>

      {isLoading && <p style={{ color: 'var(--color-text-secondary)' }}>Loading sites…</p>}
      {error && <p style={{ color: 'var(--color-critical)' }}>{error}</p>}

      {!isLoading && sites.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '2rem',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--color-text-secondary)',
          }}
        >
          No sites yet. Draw a polygon on the map above and save your first site.
        </div>
      )}

      {sites.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Ecosystem</th>
              <th>Area (ha)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sites.map((site) => (
              <tr key={site.id}>
                <td style={{ fontWeight: 500 }}>{site.name}</td>
                <td style={{ color: 'var(--color-text-secondary)' }}>
                  {site.ecosystem_type || '—'}
                </td>
                <td>{site.area != null ? `${site.area.toFixed(2)} ha` : '—'}</td>
                <td>
                  <span
                    className={`badge badge--${site.monitoring_status === 'Active' ? 'healthy' : 'neutral'}`}
                  >
                    {site.monitoring_status || 'Unknown'}
                  </span>
                </td>
                <td>
                  <button className="btn btn--danger btn--sm" onClick={() => handleDelete(site.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
