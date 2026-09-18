import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { LayoutDashboard, FolderKanban, Map, LogOut } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/map', label: 'Map / Sites', icon: Map },
];

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="app-sidebar" aria-label="Main navigation">
      {/* Brand */}
      <div
        style={{
          padding: 'var(--sp-5) var(--sp-4)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <span
          style={{
            fontWeight: 'var(--fw-semibold)',
            fontSize: 'var(--text-sm)',
            letterSpacing: '0.02em',
            color: 'var(--color-primary)',
          }}
        >
          DARUKAA.EARTH
        </span>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: 'var(--sp-3) var(--sp-2)' }}>
        <ul
          style={{
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--sp-1)',
          }}
        >
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sp-3)',
                  padding: 'var(--sp-2) var(--sp-3)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: isActive ? 'var(--fw-medium)' : 'var(--fw-normal)',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  backgroundColor: isActive ? 'var(--color-primary-subtle)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'background-color var(--transition-fast)',
                })}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User + Logout */}
      <div style={{ padding: 'var(--sp-4)', borderTop: '1px solid var(--color-border)' }}>
        {user && (
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--sp-3)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user.email}
          </div>
        )}
        <button
          onClick={handleLogout}
          className="btn btn--secondary"
          style={{ width: '100%', justifyContent: 'flex-start', gap: 'var(--sp-2)' }}
        >
          <LogOut size={14} aria-hidden="true" />
          Sign out
        </button>
      </div>
    </aside>
  );
};
