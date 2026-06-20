import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';

const STATUS_COLORS = {
  new:          { bg: '#dbeafe', color: '#1d4ed8' },
  in_progress:  { bg: '#fef9c3', color: '#a16207' },
  closed:       { bg: '#dcfce7', color: '#15803d' },
};

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span className="material-icons" style={{ color, fontSize: '1.4rem' }}>{icon}</span>
      </div>
      <div>
        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value ?? '—'}</div>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', marginTop: 4 }}>{label}</div>
        {sub && <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats,       setStats]       = useState({ totalLeads: 0, newLeads: 0, publishedBlogs: 0, draftBlogs: 0 });
  const [recentLeads, setRecentLeads] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const [leadsAll, leadsNew, pubBlogs, draftBlogs, rLeads, rBlogs] = await Promise.all([
        supabase.from('leads').select('id', { count: 'exact', head: true }),
        supabase.from('leads').select('id', { count: 'exact', head: true }).eq('read', false),
        supabase.from('blogs').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('blogs').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(6),
        supabase.from('blogs').select('id, title, status, created_at, category').order('created_at', { ascending: false }).limit(5),
      ]);
      setStats({
        totalLeads:    leadsAll.count ?? 0,
        newLeads:      leadsNew.count ?? 0,
        publishedBlogs: pubBlogs.count ?? 0,
        draftBlogs:    draftBlogs.count ?? 0,
      });
      setRecentLeads(rLeads.data ?? []);
      setRecentBlogs(rBlogs.data ?? []);
      setLoading(false);
    }
    fetchAll();
  }, []);

  const fmt = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <>
      <Helmet><title>Dashboard | Albloshi Admin</title><meta name="robots" content="noindex" /></Helmet>
      <AdminLayout title="Dashboard">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
            <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTopColor: '#1B5FAF', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 1rem' }} />
            Loading dashboard...
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
              <StatCard icon="inbox"   label="Total Leads"      value={stats.totalLeads}     sub="All time submissions"  color="#1B5FAF" />
              <StatCard icon="mark_email_unread" label="Unread Leads"  value={stats.newLeads}  sub="Need follow-up"    color="#f59e0b" />
              <StatCard icon="article" label="Published Posts"  value={stats.publishedBlogs} sub="Live on website"       color="#10b981" />
              <StatCard icon="edit_note" label="Draft Posts"    value={stats.draftBlogs}     sub="Pending review"        color="#8b5cf6" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem', alignItems: 'start' }}>

              {/* Recent leads */}
              <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Recent Leads</h2>
                  <Link to="/admin/leads" style={{ fontSize: '0.8rem', color: '#1B5FAF', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
                </div>
                {recentLeads.length === 0 ? (
                  <div style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>No leads yet.</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        {['Name', 'Email', 'Division', 'Status', 'Date'].map(h => (
                          <th key={h} style={{ padding: '0.6rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentLeads.map((l, i) => (
                        <tr key={l.id} style={{ borderTop: '1px solid #f1f5f9', background: !l.read ? '#fafbff' : 'white' }}>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: l.read ? 400 : 600, color: '#0f172a', whiteSpace: 'nowrap' }}>
                            {!l.read && <span style={{ display: 'inline-block', width: 7, height: 7, background: '#1B5FAF', borderRadius: '50%', marginRight: 6, verticalAlign: 'middle' }} />}
                            {l.name}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>{l.email}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#475569', whiteSpace: 'nowrap' }}>{l.service ?? '—'}</td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span style={{ ...STATUS_COLORS[l.status ?? 'new'], padding: '2px 8px', borderRadius: 50, fontSize: '0.73rem', fontWeight: 600 }}>
                              {(l.status ?? 'new').replace('_', ' ')}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{fmt(l.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Right column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Quick actions */}
                <div style={{ background: 'white', borderRadius: 12, padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                  <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem' }}>Quick Actions</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {[
                      { to: '/admin/blogs/new', icon: 'add_circle', label: 'Write New Blog Post', color: '#1B5FAF' },
                      { to: '/admin/leads',     icon: 'inbox',       label: 'Manage All Leads',  color: '#f59e0b' },
                      { to: '/admin/blogs',     icon: 'article',     label: 'Manage Blog Posts', color: '#10b981' },
                    ].map(a => (
                      <Link key={a.to} to={a.to} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.9rem', borderRadius: 8, background: '#f8fafc', textDecoration: 'none', color: '#374151', fontSize: '0.875rem', fontWeight: 500, border: '1px solid #f1f5f9', transition: 'background 0.15s' }}>
                        <span className="material-icons" style={{ color: a.color, fontSize: '1.15rem' }}>{a.icon}</span>
                        {a.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Recent blog posts */}
                <div style={{ background: 'white', borderRadius: 12, padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem' }}>
                    <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Recent Posts</h2>
                    <Link to="/admin/blogs" style={{ fontSize: '0.8rem', color: '#1B5FAF', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
                  </div>
                  {recentBlogs.length === 0 ? (
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>No blog posts yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {recentBlogs.map(b => (
                        <div key={b.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.title}</div>
                            <div style={{ fontSize: '0.73rem', color: '#94a3b8', marginTop: 1 }}>{fmt(b.created_at)}</div>
                          </div>
                          <span style={{ ...(b.status === 'published' ? { bg: '#dcfce7', color: '#15803d' } : { bg: '#f1f5f9', color: '#64748b' }), background: b.status === 'published' ? '#dcfce7' : '#f1f5f9', color: b.status === 'published' ? '#15803d' : '#64748b', padding: '2px 8px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
                            {b.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </AdminLayout>
    </>
  );
}
