import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { LoginForm } from './features/auth/LoginForm';
import { RegisterForm } from './features/auth/RegisterForm';
import { ProjectList } from './features/projects/ProjectList';
import { ProjectForm } from './features/projects/ProjectForm';
import { SiteManager } from './features/sites/SiteManager';
import { Dashboard } from './features/dashboard/Dashboard';
import { Sidebar } from './components/layout/Sidebar';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, isLoading } = useAuth();
  if (isLoading) return <div style={{ padding: '2rem', color: 'var(--color-text-secondary)' }}>Loading…</div>;
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

/** Authenticated layout shell: sidebar + main content */
const AppShell = ({ children }: { children: React.ReactNode }) => (
  <div className="app-shell">
    <Sidebar />
    <main className="app-main">
      <div className="page-content" style={{ padding: '0' }}>
        {children}
      </div>
    </main>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      {/* Root → redirect to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Protected with sidebar */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppShell><Dashboard /></AppShell>
        </ProtectedRoute>
      } />
      <Route path="/projects" element={
        <ProtectedRoute>
          <AppShell>
            <div style={{ padding: '2rem 1.5rem' }}>
              <ProjectList />
            </div>
          </AppShell>
        </ProtectedRoute>
      } />
      <Route path="/projects/new" element={
        <ProtectedRoute>
          <AppShell>
            <div style={{ padding: '2rem 1.5rem' }}>
              <ProjectForm />
            </div>
          </AppShell>
        </ProtectedRoute>
      } />
      <Route path="/projects/:projectId/sites" element={
        <ProtectedRoute>
          <AppShell><SiteManager /></AppShell>
        </ProtectedRoute>
      } />

      {/* /map redirects to projects list until a specific project is selected */}
      <Route path="/map" element={<Navigate to="/projects" replace />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
