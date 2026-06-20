import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const NAV = [
  { to: '/admin',        icon: 'dashboard',   label: 'Dashboard',   exact: true },
  { to: '/admin/leads',  icon: 'inbox',        label: 'Leads'                   },
  { to: '/admin/blogs',  icon: 'article',      label: 'Blog Posts'              },
];

const S = {
  sidebar: {
    width: 240, background: '#0b1f3a', display: 'flex', flexDirection: 'column',
    height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 100,
    boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
  },
  logo: {
    padding: '1.5rem 1.25rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)',
    display: 'flex', alignItems: 'center', gap: '0.75rem',
  },
  logoIcon: {
    width: 36, height: 36, background: '#1B5FAF', borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  logoText: { color: 'white', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 },
  logoSub:  { color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', marginTop: 2 },
  nav:      { flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: 4 },
  navItem: (active) => ({
    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.9rem',
    borderRadius: 8, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
    transition: 'all 0.15s',
    background: active ? 'rgba(27,95,175,0.35)' : 'transparent',
    color: active ? 'white' : 'rgba(255,255,255,0.6)',
  }),
  footer: {
    padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.07)',
  },
  userBox: {
    display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 0.9rem',
    borderRadius: 8, marginBottom: 8,
  },
  avatar: {
    width: 30, height: 30, background: '#1B5FAF', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
  },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%',
    padding: '0.65rem 0.9rem', borderRadius: 8, border: 'none', cursor: 'pointer',
    background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem',
    fontWeight: 500, transition: 'all 0.15s', textAlign: 'left',
  },
};

export default function AdminLayout({ children, title }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const initials = user?.email?.[0]?.toUpperCase() ?? 'A';

  const Sidebar = () => (
    <aside style={S.sidebar}>
      <div style={S.logo}>
        <div style={S.logoIcon}>
          <span className="material-icons" style={{ fontSize: '1.2rem', color: 'white' }}>storefront</span>
        </div>
        <div>
          <div style={S.logoText}>Albloshi</div>
          <div style={S.logoSub}>Admin Panel</div>
        </div>
      </div>

      <nav style={S.nav}>
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            style={({ isActive }) => S.navItem(isActive)}
            onClick={() => setMobileOpen(false)}
          >
            <span className="material-icons" style={{ fontSize: '1.1rem' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={S.footer}>
        <div style={S.userBox}>
          <div style={S.avatar}>{initials}</div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>Administrator</div>
          </div>
        </div>
        <button style={S.logoutBtn} onClick={handleLogout}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#fca5a5'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
        >
          <span className="material-icons" style={{ fontSize: '1.1rem' }}>logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: 'flex', fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Desktop sidebar */}
      <div style={{ display: 'block' }}>
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} onClick={() => setMobileOpen(false)}>
          <Sidebar />
        </div>
      )}

      {/* Main content */}
      <main style={{ marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 1.75rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
          <h1 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>{title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a href="/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem', border: '1px solid #e2e8f0', borderRadius: 6, color: '#64748b', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 500 }}>
              <span className="material-icons" style={{ fontSize: '0.95rem' }}>open_in_new</span>
              View Site
            </a>
          </div>
        </header>

        <div style={{ flex: 1, padding: '1.75rem', maxWidth: 1280 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
