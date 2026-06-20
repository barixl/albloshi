import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileFooterBar from '../components/MobileFooterBar';
import WhatsAppFloat from '../components/WhatsAppFloat';
import { supabase } from '../lib/supabase';

const STATIC_ARTICLES = [
  {
    id: 'industrial-supplies',
    img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
    tag: 'Industrial Supplies',
    date: 'May 24, 2026',
    read: '5 Min Read',
    title: 'GCC Supply Chain Resilience: Navigating Steel and Piping Sourcing in 2026',
    excerpt: 'With infrastructure investments expanding across the Kingdom under Vision 2030, secure sourcing of high-grade carbon and stainless steel piping materials represents a critical operational bottleneck. We examine dynamic raw material scales and routing protocols for secure project delivery.',
    href: '/industrial-services',
    static: true,
  },
  {
    id: 'water-chemistry',
    img: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80',
    tag: 'Intelligent Chemicals',
    date: 'May 18, 2026',
    read: '6 Min Read',
    title: 'Industrial Water Chemistry: How TELLABS Formulations Meet SASO & GCC Regulatory Rules',
    excerpt: 'Modern industrial wastewater recycling requires custom water treatment polymers and coagulants to meet extreme salinity tolerances. Explore how our exclusive partnership with TELLABS delivers advanced process chemistry solutions certified to SASO environmental frameworks.',
    href: '/intelligent-chemicals',
    static: true,
  },
  {
    id: 'food-trading',
    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    tag: 'Food Trading',
    date: 'May 12, 2026',
    read: '4 Min Read',
    title: 'Regional Food Sourcing Stability: Sourcing Bulk Basmati Rice and Cooking Palm Oil',
    excerpt: "Navigating global agricultural trade lanes requires sophisticated cold-chain reserves and advanced supply fleets. Discover Albloshi's large-scale wholesale import systems that maintain inventory continuity for double-refined palm oil and premium Basmati rice across Saudi retail channels.",
    href: '/food-services',
    static: true,
  },
  {
    id: 'manpower-supply',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
    tag: 'Manpower Supply',
    date: 'May 05, 2026',
    read: '7 Min Read',
    title: 'Compliance First: Implementing Saudi Aramco Certification Standards in Skilled Manpower',
    excerpt: "Industrial shutdowns and petrochemical installations demand heavy structural welders and piping fitters that hold high-integrity compliance clearances. We review Albloshi's safety onboarding and intensive verification process that delivers fully certified teams to Aramco sites.",
    href: '/contact',
    static: true,
  },
  {
    id: 'vision-2030',
    img: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
    tag: 'Vision 2030',
    date: 'Apr 28, 2026',
    read: '5 Min Read',
    title: 'Vision 2030 Mega-Projects: What Construction Material Suppliers Must Know',
    excerpt: "Saudi Arabia's giga-projects — NEOM, Qiddiya, and the Red Sea Project — are driving unprecedented demand for seamless carbon steel and stainless piping. Albloshi maps the sourcing opportunities and compliance checkpoints for qualified suppliers.",
    href: '/industrial-services',
    static: true,
  },
  {
    id: 'activated-carbon',
    img: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&w=600&q=80',
    tag: 'Intelligent Chemicals',
    date: 'Apr 15, 2026',
    read: '6 Min Read',
    title: 'Activated Carbon in GCC Water Purification: Specifications and Market Overview',
    excerpt: 'High-grade activated carbon is a critical component in municipal and industrial water purification across the Gulf. We review the key specifications — iodine value, mesh size, and moisture content — that procurement teams must evaluate when sourcing for desalination plants.',
    href: '/intelligent-chemicals',
    static: true,
  },
];

const fmt = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

export default function Blog() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase
      .from('blogs')
      .select('id, title, slug, excerpt, cover_image, category, published_at, created_at, author')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .then(({ data }) => {
        setPosts(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>Corporate Insights & Sourcing News | ALBLOSHI Trading Co.</title>
        <meta name="description" content="Read the latest news, supply chain insights, SASO compliance updates, and specialty chemicals research from Mohammad Abdulla Albloshi Trading Co." />
      </Helmet>

      <Header />

      {/* Banner */}
      <section className="blog-banner">
        <div className="blog-banner-overlay"></div>
        <div className="container">
          <div className="blog-banner-content">
            <h1>Corporate Insights <span style={{ fontFamily: 'var(--font-sans)' }}>&amp;</span> Sourcing News</h1>
            <p>Expert perspectives and engineering resources on GCC industrial materials, water treatment chemistry, global food commodity imports, and professional workforce compliance.</p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="blog-section section-padding">
        <div className="container">

          {/* Dynamic posts from admin */}
          {!loading && posts.length > 0 && (
            <>
              <h2 className="section-title" style={{ marginBottom: '2rem' }}>Latest Posts</h2>
              <div className="blog-grid" style={{ marginBottom: '3.5rem' }}>
                {posts.map(post => (
                  <article key={post.id} className="blog-card">
                    <div className="blog-card-img-wrapper">
                      <img
                        src={post.cover_image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'}
                        alt={post.title}
                        className="blog-card-img"
                      />
                      {post.category && <span className="blog-card-tag">{post.category}</span>}
                    </div>
                    <div className="blog-card-body">
                      <div className="blog-card-meta">
                        <span>{fmt(post.published_at || post.created_at)}</span>
                        {post.author && <><span className="meta-divider">•</span><span>{post.author}</span></>}
                      </div>
                      <h3>{post.title}</h3>
                      {post.excerpt && <p>{post.excerpt}</p>}
                      <Link to={`/blog/${post.slug}`} className="blog-card-btn">Read Article</Link>
                    </div>
                  </article>
                ))}
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', marginBottom: '3.5rem' }} />
              <h2 className="section-title" style={{ marginBottom: '2rem' }}>Industry Insights</h2>
            </>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem 0 3rem', color: '#94a3b8', fontSize: '0.95rem' }}>
              Loading posts…
            </div>
          )}

          {/* Static editorial articles */}
          <div className="blog-grid">
            {STATIC_ARTICLES.map(article => (
              <article key={article.id} className="blog-card" id={article.id}>
                <div className="blog-card-img-wrapper">
                  <img src={article.img} alt={article.tag} className="blog-card-img" />
                  <span className="blog-card-tag">{article.tag}</span>
                </div>
                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    <span>{article.date}</span>
                    <span className="meta-divider">•</span>
                    <span>{article.read}</span>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <Link to={article.href} className="blog-card-btn">Read Article</Link>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* Blog CTA */}
      <section className="blog-cta-section">
        <div className="container">
          <div className="blog-cta-card">
            <div className="blog-cta-inner">
              <div className="blog-cta-text">
                <h2>Ready to Partner with Albloshi?</h2>
                <p>From industrial piping to specialty chemicals and qualified manpower — our team is ready to deliver. Reach out today and get a tailored sourcing proposal for your next project.</p>
              </div>
              <div className="blog-cta-actions">
                <Link to="/contact" className="btn btn-primary">Request a Quote</Link>
                <Link to="/#segments" className="btn btn-outline">Explore Our Verticals</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <MobileFooterBar />
      <WhatsAppFloat />
    </>
  );
}
