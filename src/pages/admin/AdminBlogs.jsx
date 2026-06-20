import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';

export default function AdminBlogs() {
  const [blogs,    setBlogs]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');
  const [search,   setSearch]   = useState('');
  const [deleting, setDeleting] = useState(null);
  const [toggling, setToggling] = useState(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('blogs').select('*').order('created_at', { ascending: false });
    if (filter !== 'all') q = q.eq('status', filter);
    const { data } = await q;
    setBlogs(data ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const toggleStatus = async (blog) => {
    setToggling(blog.id);
    const newStatus = blog.status === 'published' ? 'draft' : 'published';
    const updates = { status: newStatus };
    if (newStatus === 'published' && !blog.published_at) updates.published_at = new Date().toISOString();
    await supabase.from('blogs').update(updates).eq('id', blog.id);
    setBlogs(prev => prev.map(b => b.id === blog.id ? { ...b, ...updates } : b));
    setToggling(null);
  };

  const deleteBlog = async (id) => {
    if (!window.confirm('Delete this blog post? This cannot be undone.')) return;
    setDeleting(id);
    await supabase.from('blogs').delete().eq('id', id);
    setBlogs(prev => prev.filter(b => b.id !== id));
    setDeleting(null);
  };

  const filtered = blogs.filter(b =>
    !search || [b.title, b.category, b.author].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  const fmt = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const inp = { padding: '0.55rem 0.9rem', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', color: '#0f172a', background: 'white' };

  return (
    <>
      <Helmet><title>Blog Posts | Albloshi Admin</title><meta name="robots" content="noindex" /></Helmet>
      <AdminLayout title="Blog Posts">

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <span className="material-icons" style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1.1rem' }}>search</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title, category, author…"
              style={{ ...inp, paddingLeft: '2.25rem', width: '100%', boxSizing: 'border-box' }} />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
            <option value="all">All Posts ({blogs.length})</option>
            <option value="published">Published ({blogs.filter(b => b.status === 'published').length})</option>
            <option value="draft">Drafts ({blogs.filter(b => b.status === 'draft').length})</option>
          </select>
          <Link to="/admin/blogs/new" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.1rem', background: '#1B5FAF', color: 'white', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
            <span className="material-icons" style={{ fontSize: '1rem' }}>add</span> New Post
          </Link>
        </div>

        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>Loading posts...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <span className="material-icons" style={{ fontSize: '2.5rem', color: '#cbd5e1', display: 'block', marginBottom: '0.75rem' }}>article</span>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0 0 1rem' }}>No blog posts yet.</p>
              <Link to="/admin/blogs/new" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.1rem', background: '#1B5FAF', color: 'white', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
                <span className="material-icons" style={{ fontSize: '1rem' }}>add</span> Create your first post
              </Link>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                  {['Title', 'Category', 'Author', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.65rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(blog => (
                  <tr key={blog.id} style={{ borderTop: '1px solid #f1f5f9' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                    <td style={{ padding: '0.85rem 1rem', maxWidth: 280 }}>
                      <div style={{ fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{blog.title}</div>
                      {blog.excerpt && <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{blog.excerpt}</div>}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#475569', whiteSpace: 'nowrap' }}>
                      {blog.category
                        ? <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 500 }}>{blog.category}</span>
                        : '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#475569', whiteSpace: 'nowrap' }}>{blog.author ?? 'Albloshi Team'}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ background: blog.status === 'published' ? '#dcfce7' : '#f1f5f9', color: blog.status === 'published' ? '#15803d' : '#64748b', padding: '3px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 600 }}>
                        {blog.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#94a3b8', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{fmt(blog.created_at)}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                        {/* Publish toggle */}
                        <button onClick={() => toggleStatus(blog)} disabled={toggling === blog.id} title={blog.status === 'published' ? 'Unpublish' : 'Publish'}
                          style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: blog.status === 'published' ? '#f59e0b' : '#22c55e', padding: '4px', borderRadius: 4 }}>
                          <span className="material-icons" style={{ fontSize: '1.15rem' }}>{toggling === blog.id ? 'hourglass_empty' : blog.status === 'published' ? 'unpublished' : 'publish'}</span>
                        </button>
                        {/* Edit */}
                        <Link to={`/admin/blogs/${blog.id}`} title="Edit"
                          style={{ display: 'flex', alignItems: 'center', color: '#1B5FAF', padding: '4px', borderRadius: 4, textDecoration: 'none' }}>
                          <span className="material-icons" style={{ fontSize: '1.15rem' }}>edit</span>
                        </Link>
                        {/* Delete */}
                        <button onClick={() => deleteBlog(blog.id)} disabled={deleting === blog.id} title="Delete"
                          style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#fca5a5', padding: '4px', borderRadius: 4 }}>
                          <span className="material-icons" style={{ fontSize: '1.15rem' }}>{deleting === blog.id ? 'hourglass_empty' : 'delete_outline'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
