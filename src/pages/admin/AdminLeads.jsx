import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';

const STATUS_META = {
  new:         { label: 'New',         bg: '#dbeafe', color: '#1d4ed8' },
  in_progress: { label: 'In Progress', bg: '#fef9c3', color: '#a16207' },
  closed:      { label: 'Closed',      bg: '#dcfce7', color: '#15803d' },
};

function Badge({ status }) {
  const m = STATUS_META[status] ?? STATUS_META.new;
  return <span style={{ background: m.bg, color: m.color, padding: '3px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{m.label}</span>;
}

export default function AdminLeads() {
  const [leads,      setLeads]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState('all');
  const [search,     setSearch]     = useState('');
  const [selected,   setSelected]   = useState(null);
  const [deleting,   setDeleting]   = useState(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (filter !== 'all') q = q.eq('status', filter);
    const { data } = await q;
    setLeads(data ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const markRead = async (id) => {
    await supabase.from('leads').update({ read: true }).eq('id', id);
    setLeads(prev => prev.map(l => l.id === id ? { ...l, read: true } : l));
    if (selected?.id === id) setSelected(prev => ({ ...prev, read: true }));
  };

  const updateStatus = async (id, status) => {
    await supabase.from('leads').update({ status }).eq('id', id);
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
  };

  const deleteLead = async (id) => {
    setDeleting(id);
    await supabase.from('leads').delete().eq('id', id);
    setLeads(prev => prev.filter(l => l.id !== id));
    if (selected?.id === id) setSelected(null);
    setDeleting(null);
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Division', 'Message', 'Status', 'Date'];
    const rows = filtered.map(l => [
      l.name, l.email, l.phone ?? '', l.service ?? '', (l.message ?? '').replace(/\n/g, ' '), l.status ?? 'new',
      new Date(l.created_at).toLocaleDateString('en-GB'),
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `albloshi-leads-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const openLead = async (lead) => {
    setSelected(lead);
    if (!lead.read) markRead(lead.id);
  };

  const filtered = leads.filter(l =>
    !search || [l.name, l.email, l.phone, l.service, l.message].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  const fmt = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const inp  = { padding: '0.55rem 0.9rem', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', color: '#0f172a', background: 'white' };
  const newCount = leads.filter(l => !l.read).length;

  return (
    <>
      <Helmet><title>Leads | Albloshi Admin</title><meta name="robots" content="noindex" /></Helmet>
      <AdminLayout title="Leads Manager">

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <span className="material-icons" style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1.1rem' }}>search</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, phone…" style={{ ...inp, paddingLeft: '2.25rem', width: '100%', boxSizing: 'border-box' }} />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
            <option value="all">All Leads ({leads.length})</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
          <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <span className="material-icons" style={{ fontSize: '1rem' }}>download</span> Export CSV
          </button>
          {newCount > 0 && (
            <div style={{ background: '#dbeafe', color: '#1d4ed8', padding: '0.45rem 0.9rem', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600 }}>
              {newCount} unread
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '1.25rem', alignItems: 'start' }}>

          {/* Leads table */}
          <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>Loading leads...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}>
                <span className="material-icons" style={{ fontSize: '2.5rem', color: '#cbd5e1', display: 'block', marginBottom: '0.75rem' }}>inbox</span>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>No leads found.</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                    {['Name', 'Email', 'Phone', 'Division', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '0.65rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(lead => (
                    <tr key={lead.id}
                      onClick={() => openLead(lead)}
                      style={{ borderTop: '1px solid #f1f5f9', cursor: 'pointer', background: selected?.id === lead.id ? '#eff6ff' : !lead.read ? '#fafbff' : 'white', transition: 'background 0.1s' }}
                      onMouseEnter={e => { if (selected?.id !== lead.id) e.currentTarget.style.background = '#f8fafc'; }}
                      onMouseLeave={e => { if (selected?.id !== lead.id) e.currentTarget.style.background = !lead.read ? '#fafbff' : 'white'; }}
                    >
                      <td style={{ padding: '0.8rem 1rem', fontWeight: lead.read ? 400 : 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
                        {!lead.read && <span style={{ display: 'inline-block', width: 7, height: 7, background: '#1B5FAF', borderRadius: '50%', marginRight: 6, verticalAlign: 'middle' }} />}
                        {lead.name}
                      </td>
                      <td style={{ padding: '0.8rem 1rem', color: '#475569' }}>{lead.email}</td>
                      <td style={{ padding: '0.8rem 1rem', color: '#475569', whiteSpace: 'nowrap' }}>{lead.phone ?? '—'}</td>
                      <td style={{ padding: '0.8rem 1rem', color: '#475569', whiteSpace: 'nowrap', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.service ?? '—'}</td>
                      <td style={{ padding: '0.8rem 1rem' }}><Badge status={lead.status ?? 'new'} /></td>
                      <td style={{ padding: '0.8rem 1rem', color: '#94a3b8', whiteSpace: 'nowrap', fontSize: '0.78rem' }}>{fmt(lead.created_at)}</td>
                      <td style={{ padding: '0.8rem 1rem' }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => deleteLead(lead.id)} disabled={deleting === lead.id}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fca5a5', padding: '4px', borderRadius: 4, display: 'flex' }}
                          title="Delete lead">
                          <span className="material-icons" style={{ fontSize: '1.1rem' }}>{deleting === lead.id ? 'hourglass_empty' : 'delete_outline'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Lead detail panel */}
          {selected && (
            <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden', position: 'sticky', top: 76 }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Lead Details</h3>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: 4 }}>
                  <span className="material-icons" style={{ fontSize: '1.2rem' }}>close</span>
                </button>
              </div>
              <div style={{ padding: '1.25rem' }}>

                {/* Status selector */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</label>
                  <select value={selected.status ?? 'new'} onChange={e => updateStatus(selected.id, e.target.value)}
                    style={{ padding: '0.5rem 0.85rem', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', color: '#0f172a', background: 'white', cursor: 'pointer', width: '100%' }}>
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                {/* Fields */}
                {[
                  { icon: 'person',    label: 'Full Name',  val: selected.name },
                  { icon: 'email',     label: 'Email',      val: selected.email, link: `mailto:${selected.email}` },
                  { icon: 'phone',     label: 'Phone',      val: selected.phone,    link: `tel:${selected.phone}` },
                  { icon: 'category',  label: 'Division',   val: selected.service },
                  { icon: 'schedule',  label: 'Submitted',  val: fmt(selected.created_at) },
                ].map(f => f.val && (
                  <div key={f.label} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.85rem', alignItems: 'flex-start' }}>
                    <span className="material-icons" style={{ fontSize: '1rem', color: '#94a3b8', marginTop: 1, flexShrink: 0 }}>{f.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</div>
                      {f.link
                        ? <a href={f.link} style={{ fontSize: '0.875rem', color: '#1B5FAF', fontWeight: 500, textDecoration: 'none' }}>{f.val}</a>
                        : <div style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 500 }}>{f.val}</div>}
                    </div>
                  </div>
                ))}

                {/* Message */}
                {selected.message && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Message</div>
                    <div style={{ background: '#f8fafc', borderRadius: 8, padding: '0.85rem', fontSize: '0.875rem', color: '#374151', lineHeight: 1.65, whiteSpace: 'pre-wrap', border: '1px solid #f1f5f9' }}>
                      {selected.message}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.6rem' }}>
                  <a href={`mailto:${selected.email}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem', background: '#1B5FAF', color: 'white', borderRadius: 8, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span className="material-icons" style={{ fontSize: '1rem' }}>email</span> Reply
                  </a>
                  {selected.phone && (
                    <a href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem', background: '#22c55e', color: 'white', borderRadius: 8, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                      <span className="material-icons" style={{ fontSize: '1rem' }}>chat</span> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
