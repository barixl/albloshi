import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileFooterBar from '../components/MobileFooterBar';
import WhatsAppFloat from '../components/WhatsAppFloat';
import { supabase } from '../lib/supabase';

const fmt = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

export default function BlogPost() {
  const { slug } = useParams();
  const [post,    setPost]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!supabase) { setNotFound(true); setLoading(false); return; }
    supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else setPost(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return (
    <>
      <Header />
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        Loading…
      </div>
      <Footer />
    </>
  );

  if (notFound) return (
    <>
      <Header />
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <span className="material-icons" style={{ fontSize: '3rem', color: '#cbd5e1' }}>article</span>
        <h2 style={{ color: '#0f172a', fontSize: '1.4rem', fontWeight: 700 }}>Post not found</h2>
        <Link to="/blog" style={{ color: '#1B5FAF', fontWeight: 600 }}>← Back to Blog</Link>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Helmet>
        <title>{post.seo_title || post.title} | Albloshi Trading Co.</title>
        <meta name="description" content={post.seo_description || post.excerpt || ''} />
        {post.seo_keywords && <meta name="keywords" content={post.seo_keywords} />}
        {post.og_image && <meta property="og:image" content={post.og_image} />}
        <meta property="og:title"       content={post.seo_title || post.title} />
        <meta property="og:description" content={post.seo_description || post.excerpt || ''} />
        <meta property="og:type"        content="article" />
      </Helmet>

      <Header />

      {/* Hero */}
      {post.cover_image && (
        <div style={{ width: '100%', maxHeight: 480, overflow: 'hidden', position: 'relative' }}>
          <img src={post.cover_image} alt={post.title}
            style={{ width: '100%', height: 480, objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,20,45,0.6) 0%, transparent 60%)' }} />
        </div>
      )}

      <article style={{ maxWidth: 780, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
          <Link to="/blog" style={{ color: '#1B5FAF', textDecoration: 'none', fontWeight: 600 }}>Blog</Link>
          <span className="material-icons" style={{ fontSize: '0.95rem' }}>chevron_right</span>
          <span style={{ color: '#64748b' }}>{post.category || 'Article'}</span>
        </nav>

        {/* Category badge */}
        {post.category && (
          <span style={{ display: 'inline-block', background: '#eff6ff', color: '#1B5FAF', fontWeight: 700, fontSize: '0.75rem', padding: '4px 12px', borderRadius: 50, marginBottom: '1rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {post.category}
          </span>
        )}

        {/* Title */}
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, marginBottom: '1rem' }}>
          {post.title}
        </h1>

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontSize: '0.875rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <span className="material-icons" style={{ fontSize: '1rem', color: '#94a3b8' }}>person_outline</span>
          <span>{post.author || 'Albloshi Team'}</span>
          <span style={{ color: '#cbd5e1' }}>•</span>
          <span className="material-icons" style={{ fontSize: '1rem', color: '#94a3b8' }}>calendar_today</span>
          <span>{fmt(post.published_at || post.created_at)}</span>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: 1.7, marginBottom: '2rem', fontStyle: 'italic', borderLeft: '3px solid #1B5FAF', paddingLeft: '1.25rem' }}>
            {post.excerpt}
          </p>
        )}

        <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', marginBottom: '2rem' }} />

        {/* Content */}
        <div className="blog-post-content">
          <ReactMarkdown>{post.content || ''}</ReactMarkdown>
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div style={{ marginTop: '3rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {post.tags.map(tag => (
              <span key={tag} style={{ background: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: 50, fontSize: '0.8rem', fontWeight: 500 }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Back link */}
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9' }}>
          <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#1B5FAF', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
            <span className="material-icons" style={{ fontSize: '1.1rem' }}>arrow_back</span>
            Back to Blog
          </Link>
        </div>
      </article>

      <Footer />
      <MobileFooterBar />
      <WhatsAppFloat />
    </>
  );
}
