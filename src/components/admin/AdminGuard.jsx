import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminGuard({ children }) {
  const { user, loading, supabaseReady } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#1B5FAF', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!supabaseReady) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif', padding: '2rem' }}>
        <div style={{ background: 'white', border: '1px solid #fee2e2', borderRadius: 12, padding: '2.5rem', maxWidth: 480, textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <span className="material-icons" style={{ fontSize: '3rem', color: '#ef4444', marginBottom: '1rem', display: 'block' }}>error_outline</span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>Supabase Not Configured</h2>
          <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '1.5rem' }}>Add <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>VITE_SUPABASE_URL</code> and <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>VITE_SUPABASE_ANON_KEY</code> to your <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>.env</code> file, then restart the dev server.</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  return children;
}
