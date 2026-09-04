import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../../lib/api';

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('admin@virtuoso-gems.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true); setError('');
    try { await login(email, password); navigate(location.state?.from?.pathname || '/', { replace: true }); }
    catch (submitError) { setError(submitError.message || 'Invalid email or password.'); }
    finally { setLoading(false); }
  };

  return (
    <main className="signin-shell">
      <section className="signin-brand">
        <div className="signin-brand-mark"><span className="material-symbols-outlined">diamond</span></div>
        <div>
          <p className="signin-brand-name">Virtuoso's Gems</p>
          <p className="signin-brand-tagline">Luxury gemstone administration</p>
        </div>
        <p className="signin-brand-copy">Manage your collection, orders, customers, and store performance from one secure workspace.</p>
      </section>
      <section className="signin-card" aria-labelledby="signin-title">
        <div className="signin-card-header">
          <div className="signin-mobile-mark"><span className="material-symbols-outlined">diamond</span></div>
          <p className="signin-eyebrow">Secure workspace</p>
          <h1 id="signin-title">Welcome back</h1>
          <p>Sign in to continue to your admin dashboard.</p>
        </div>
        {error && <div className="signin-error" role="alert">{error}</div>}
        <form onSubmit={submit} className="signin-form">
          <label>Email address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required /></label>
          <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /></label>
          <button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p className="signin-footer">Authorized administrators only</p>
      </section>
    </main>
  );
}
