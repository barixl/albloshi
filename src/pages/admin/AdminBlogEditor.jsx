import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { uploadImage, cloudinaryConfigured } from '../../lib/cloudinary';

const CATEGORIES = ['Industrial Materials', 'Food Distribution', 'Intelligent Chemicals', 'Manpower', 'Company News', 'Industry Insights'];

const slugify = (text) =>
  text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

const EMPTY = {
  title: '', slug: '', excerpt: '', content: '', cover_image: '',
  category: '', tags: '', author: 'Albloshi Team', status: 'draft',
  seo_title: '', seo_description: '', seo_keywords: '', og_image: '',
};

const inp = (extra = {}) => ({
  width: '100%', padding: '0.65rem 0.9rem', border: '1.5px solid #e2e8f0', borderRadius: 8,
  fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', color: '#0f172a',
  background: 'white', boxSizing: 'border-box', transition: 'border-color 0.15s', ...extra,
});

function Field({ label, hint, error, children }) {
  return (
    <div style={{ marginBottom: '1.1rem' }}>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>{label}</label>
      {children}
      {hint && !error && <p style={{ margin: '0.3rem 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>{hint}</p>}
      {error && <p style={{ margin: '0.3rem 0 0', fontSize: '0.75rem', color: '#ef4444' }}>{error}</p>}
    </div>
  );
}

export default function AdminBlogEditor() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const isEdit    = !!id;

  const [form,     setForm]     = useState(EMPTY);
  const [loading,  setLoading]  = useState(isEdit);
  const [saving,   setSaving]   = useState(false);
  const [errors,   setErrors]   = useState({});
  const [toast,    setToast]    = useState(null);
  const [slugLock, setSlugLock] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const { data } = await supabase.from('blogs').select('*').eq('id', id).single();
      if (data) { setForm({ ...EMPTY, ...data, tags: (data.tags ?? []).join(', ') }); setSlugLock(true); }
      setLoading(false);
    })();
  }, [id, isEdit]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleTitle = (v) => {
    set('title', v);
    if (!slugLock) set('slug', slugify(v));
    if (!form.seo_title) set('seo_title', v);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())        e.title = 'Title is required.';
    if (!form.slug.trim())         e.slug  = 'Slug is required.';
    if (form.seo_description.length > 160) e.seo_description = 'Keep under 160 characters.';
    if (form.seo_title.length > 60)        e.seo_title = 'Keep under 60 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const save = async (publishNow = false) => {
    if (!validate()) return;
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      status: publishNow ? 'published' : form.status,
    };
    if (publishNow && !payload.published_at) payload.published_at = new Date().toISOString();
    payload.updated_at = new Date().toISOString();

    const { error } = isEdit
      ? await supabase.from('blogs').update(payload).eq('id', id)
      : await supabase.from('blogs').insert([payload]);

    setSaving(false);
    if (error) { showToast(error.message, 'error'); }
    else       { showToast(publishNow ? 'Post published!' : 'Draft saved!'); setTimeout(() => navigate('/admin/blogs'), 1200); }
  };

  const [uploading,  setUploading]  = useState(false);
  const [dragOver,   setDragOver]   = useState(false);
  const [syncOg,     setSyncOg]     = useState(!form.og_image);
  const fileInputRef = useRef(null);

  const handleImageFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) { showToast('Image must be under 10 MB.', 'error'); return; }
    setUploading(true);
    try {
      const url = await uploadImage(file);
      set('cover_image', url);
      if (syncOg) set('og_image', url);
      showToast('Image uploaded successfully!');
    } catch (err) {
      showToast(err.message, 'error');
    }
    setUploading(false);
  }, [syncOg]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleImageFile(e.dataTransfer.files[0]);
  };

  const removeCover = () => {
    set('cover_image', '');
    if (syncOg) set('og_image', '');
  };

  const seoDescLen = form.seo_description.length;
  const seoTitleLen = form.seo_title.length;

  if (loading) return (
    <AdminLayout title={isEdit ? 'Edit Post' : 'New Post'}>
      <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>Loading post...</div>
    </AdminLayout>
  );

  return (
    <>
      <Helmet><title>{isEdit ? 'Edit Post' : 'New Post'} | Albloshi Admin</title><meta name="robots" content="noindex" /></Helmet>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <AdminLayout title={isEdit ? 'Edit Blog Post' : 'New Blog Post'}>

        {/* Toast */}
        {toast && (
          <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999, background: toast.type === 'error' ? '#fef2f2' : '#f0fdf4', border: `1px solid ${toast.type === 'error' ? '#fecaca' : '#bbf7d0'}`, borderRadius: 10, padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: toast.type === 'error' ? '#b91c1c' : '#15803d', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
            <span className="material-icons" style={{ fontSize: '1.1rem' }}>{toast.type === 'error' ? 'error_outline' : 'check_circle'}</span>
            {toast.msg}
          </div>
        )}

        {/* Header actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button onClick={() => navigate('/admin/blogs')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '0.5rem 0.9rem', cursor: 'pointer', color: '#64748b', fontSize: '0.875rem', fontWeight: 500, fontFamily: 'inherit' }}>
            <span className="material-icons" style={{ fontSize: '1rem' }}>arrow_back</span> Back
          </button>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button onClick={() => save(false)} disabled={saving}
              style={{ padding: '0.55rem 1.1rem', border: '1.5px solid #e2e8f0', borderRadius: 8, background: 'white', color: '#374151', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {saving ? 'Saving…' : 'Save Draft'}
            </button>
            <button onClick={() => save(true)} disabled={saving}
              style={{ padding: '0.55rem 1.25rem', background: '#1B5FAF', color: 'white', border: 'none', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="material-icons" style={{ fontSize: '1rem' }}>publish</span>
              {form.status === 'published' ? 'Update Post' : 'Publish Post'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.25rem', alignItems: 'start' }}>

          {/* Main content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Core fields */}
            <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
              <Field label="Post Title *" error={errors.title}>
                <input value={form.title} onChange={e => handleTitle(e.target.value)} placeholder="e.g. How TELLABS Chemicals Improve Water Treatment Efficiency"
                  style={inp()} onFocus={e => e.target.style.borderColor = '#1B5FAF'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </Field>

              <Field label="URL Slug *" hint="Auto-generated from title. Click to edit." error={errors.slug}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>/blog/</span>
                  <input value={form.slug} onChange={e => { set('slug', slugify(e.target.value)); setSlugLock(true); }}
                    style={inp()} onFocus={e => { setSlugLock(true); e.target.style.borderColor = '#1B5FAF'; }} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
              </Field>

              <Field label="Excerpt" hint="Short summary shown in blog listing (1-2 sentences).">
                <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} rows={2}
                  placeholder="A short description of the post…"
                  style={inp({ resize: 'vertical', lineHeight: 1.6 })}
                  onFocus={e => e.target.style.borderColor = '#1B5FAF'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </Field>
            </div>

            {/* Content editor */}
            <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>Content</label>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Markdown supported</span>
              </div>
              {/* Quick toolbar */}
              <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                {[
                  { icon: 'format_bold',         ins: '**text**'         },
                  { icon: 'format_italic',        ins: '*text*'           },
                  { icon: 'format_list_bulleted', ins: '\n- Item'         },
                  { icon: 'format_list_numbered', ins: '\n1. Item'        },
                  { icon: 'format_quote',         ins: '\n> Quote'        },
                  { icon: 'title',                ins: '\n## Heading'     },
                  { icon: 'horizontal_rule',      ins: '\n---\n'          },
                ].map(b => (
                  <button key={b.icon} type="button"
                    onClick={() => set('content', form.content + b.ins)}
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 6px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}>
                    <span className="material-icons" style={{ fontSize: '1.05rem' }}>{b.icon}</span>
                  </button>
                ))}
              </div>
              <textarea value={form.content} onChange={e => set('content', e.target.value)} rows={20}
                placeholder="Write your blog post content here. Markdown is supported."
                style={{ ...inp(), resize: 'vertical', lineHeight: 1.7, fontFamily: 'monospace', fontSize: '0.875rem' }}
                onFocus={e => e.target.style.borderColor = '#1B5FAF'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>

            {/* SEO section */}
            <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-icons" style={{ fontSize: '1.15rem', color: '#1B5FAF' }}>search</span>
                SEO Settings
              </h3>

              <Field label={`SEO Title (${seoTitleLen}/60)`} hint="Defaults to post title if left empty." error={errors.seo_title}>
                <input value={form.seo_title} onChange={e => set('seo_title', e.target.value)} placeholder="SEO optimized title…"
                  style={inp({ borderColor: seoTitleLen > 60 ? '#ef4444' : '#e2e8f0' })}
                  onFocus={e => e.target.style.borderColor = '#1B5FAF'} onBlur={e => e.target.style.borderColor = seoTitleLen > 60 ? '#ef4444' : '#e2e8f0'} />
              </Field>

              <Field label={`Meta Description (${seoDescLen}/160)`} hint="Shown in Google search results. Keep under 160 characters." error={errors.seo_description}>
                <textarea value={form.seo_description} onChange={e => set('seo_description', e.target.value)} rows={3}
                  placeholder="Describe this post for search engines…"
                  style={{ ...inp({ borderColor: seoDescLen > 160 ? '#ef4444' : '#e2e8f0' }), resize: 'vertical', lineHeight: 1.6 }}
                  onFocus={e => e.target.style.borderColor = '#1B5FAF'} onBlur={e => e.target.style.borderColor = seoDescLen > 160 ? '#ef4444' : '#e2e8f0'} />
              </Field>

              <Field label="SEO Keywords" hint="Comma-separated keywords.">
                <input value={form.seo_keywords} onChange={e => set('seo_keywords', e.target.value)} placeholder="chemicals, water treatment, Saudi Arabia…"
                  style={inp()} onFocus={e => e.target.style.borderColor = '#1B5FAF'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </Field>

              <Field label="OG / Social Share Image URL" hint="Recommended size: 1200×630px.">
                <input value={form.og_image} onChange={e => set('og_image', e.target.value)} placeholder="https://…"
                  style={inp()} onFocus={e => e.target.style.borderColor = '#1B5FAF'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </Field>

              {/* Google preview */}
              {(form.seo_title || form.title) && (
                <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 10, padding: '1rem 1.25rem', marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Google Preview</div>
                  <div style={{ fontSize: '1rem', color: '#1a0dab', fontWeight: 400, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {form.seo_title || form.title || 'Post Title'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#006621', marginBottom: '2px' }}>
                    albloshi.co/blog/{form.slug || 'post-url'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#545454', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {form.seo_description || form.excerpt || 'Meta description will appear here…'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'sticky', top: 76 }}>

            {/* Publish settings */}
            <div style={{ background: 'white', borderRadius: 12, padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem' }}>Publish Settings</h3>
              <div style={{ marginBottom: '0.9rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.35rem' }}>Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)}
                  style={{ ...inp(), cursor: 'pointer' }}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.35rem' }}>Author</label>
                <input value={form.author} onChange={e => set('author', e.target.value)}
                  style={inp()} onFocus={e => e.target.style.borderColor = '#1B5FAF'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
            </div>

            {/* Category & Tags */}
            <div style={{ background: 'white', borderRadius: 12, padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem' }}>Category & Tags</h3>
              <div style={{ marginBottom: '0.9rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.35rem' }}>Category</label>
                <select value={form.category} onChange={e => set('category', e.target.value)}
                  style={{ ...inp(), cursor: 'pointer' }}>
                  <option value="">Select category…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.35rem' }}>Tags</label>
                <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="chemicals, B2B, KSA…"
                  style={inp()} onFocus={e => e.target.style.borderColor = '#1B5FAF'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.72rem', color: '#94a3b8' }}>Comma-separated</p>
              </div>
            </div>

            {/* Cover image */}
            <div style={{ background: 'white', borderRadius: 12, padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem' }}>Cover Image</h3>

              {/* Hidden file input */}
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => handleImageFile(e.target.files[0])} />

              {form.cover_image ? (
                /* Uploaded preview */
                <div style={{ position: 'relative' }}>
                  <img src={form.cover_image} alt="Cover"
                    style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10, display: 'block', border: '1px solid #f1f5f9' }} />
                  <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 6 }}>
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      title="Replace image"
                      style={{ background: 'rgba(15,23,42,0.7)', color: 'white', border: 'none', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontFamily: 'inherit', fontWeight: 600, backdropFilter: 'blur(4px)' }}>
                      <span className="material-icons" style={{ fontSize: '0.95rem' }}>swap_horiz</span> Replace
                    </button>
                    <button type="button" onClick={removeCover} title="Remove image"
                      style={{ background: 'rgba(239,68,68,0.8)', color: 'white', border: 'none', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', backdropFilter: 'blur(4px)' }}>
                      <span className="material-icons" style={{ fontSize: '0.95rem' }}>delete_outline</span>
                    </button>
                  </div>
                  {/* Cloudinary badge */}
                  <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(15,23,42,0.65)', color: 'white', fontSize: '0.7rem', fontWeight: 600, padding: '3px 8px', borderRadius: 50, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="material-icons" style={{ fontSize: '0.75rem' }}>cloud_done</span> Cloudinary
                  </div>
                </div>
              ) : (
                /* Drop zone */
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  style={{ border: `2px dashed ${dragOver ? '#1B5FAF' : '#e2e8f0'}`, borderRadius: 10, padding: '2rem 1rem', textAlign: 'center', cursor: uploading ? 'wait' : 'pointer', background: dragOver ? '#eff6ff' : '#f8fafc', transition: 'all 0.15s' }}
                >
                  {uploading ? (
                    <>
                      <div style={{ width: 32, height: 32, border: '3px solid #dbeafe', borderTopColor: '#1B5FAF', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 0.75rem' }} />
                      <p style={{ color: '#1B5FAF', fontWeight: 600, fontSize: '0.875rem', margin: 0 }}>Uploading to Cloudinary…</p>
                    </>
                  ) : (
                    <>
                      <span className="material-icons" style={{ fontSize: '2rem', color: dragOver ? '#1B5FAF' : '#cbd5e1', display: 'block', marginBottom: '0.5rem' }}>cloud_upload</span>
                      <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600, margin: '0 0 0.25rem' }}>
                        {dragOver ? 'Drop to upload' : 'Click or drag & drop'}
                      </p>
                      <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0 }}>PNG, JPG, WebP — max 10 MB</p>
                      {!cloudinaryConfigured && (
                        <p style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '0.5rem', fontWeight: 600 }}>
                          ⚠ Add VITE_CLOUDINARY_UPLOAD_PRESET to .env
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Sync OG toggle */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.85rem', cursor: 'pointer', fontSize: '0.8rem', color: '#475569', fontWeight: 500 }}>
                <input type="checkbox" checked={syncOg} onChange={e => {
                  setSyncOg(e.target.checked);
                  if (e.target.checked && form.cover_image) set('og_image', form.cover_image);
                }} style={{ accentColor: '#1B5FAF', width: 14, height: 14 }} />
                Use as social share (OG) image
              </label>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
