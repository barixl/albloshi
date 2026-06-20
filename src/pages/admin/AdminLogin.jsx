import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLogin() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { signIn, supabaseReady } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setError('');
    setLoading(true);
    const { error: authError } = await signIn(email, password) ?? {};
    setLoading(false);
    if (authError) {
      setError(authError.message === 'Invalid login credentials'
        ? 'Invalid email or password.'
        : authError.message);
    } else {
      navigate('/admin');
    }
  };

  const inp = {
    width: '100%', padding: '0.7rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: 8,
    fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
    color: '#0f172a', background: 'white', transition: 'border-color 0.15s',
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | Albloshi</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0b1f3a 0%, #1B5FAF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ background: 'white', borderRadius: 16, padding: '2.5rem 2.25rem', width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: 52, height: 52, background: '#1B5FAF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <span className="material-icons" style={{ fontSize: '1.6rem', color: 'white' }}>storefront</span>
            </div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem' }}>Albloshi Admin</h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>Sign in to your dashboard</p>
          </div>

          {!supabaseReady && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '0.85rem 1rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#b91c1c' }}>
              <strong>Supabase not configured.</strong> Add environment variables to your <code>.env</code> file.
            </div>
          )}

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.875rem', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="material-icons" style={{ fontSize: '1rem' }}>error_outline</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Email Address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@albloshi.co" style={inp} autoComplete="email"
                onFocus={e => e.target.style.borderColor = '#1B5FAF'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                disabled={!supabaseReady}
              />
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password" style={{ ...inp, paddingRight: '2.75rem' }} autoComplete="current-password"
                  onFocus={e => e.target.style.borderColor = '#1B5FAF'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  disabled={!supabaseReady}
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                  <span className="material-icons" style={{ fontSize: '1.1rem' }}>{showPass ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading || !supabaseReady}
              style={{ width: '100%', padding: '0.8rem', background: loading ? '#93c5fd' : '#1B5FAF', color: 'white', border: 'none', borderRadius: 8, fontSize: '0.95rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'background 0.15s' }}>
              {loading ? (
                <>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Signing in...
                </>
              ) : (
                <>
                  <span className="material-icons" style={{ fontSize: '1rem' }}>lock_open</span>
                  Sign In
                </>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
            Access restricted to authorized administrators only.
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
