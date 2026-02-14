import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import Logo from '../components/common/Logo';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const errs = {};
    if (!formData.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email format';
    if (!formData.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } else {
      toast.error(result.message || 'Login failed');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', position: 'relative', overflow: 'hidden' }} id="login-page">
      {/* Background Decoration */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', top: '-200px', right: '-100px', background: '#3b82f6', filter: 'blur(80px)', opacity: 0.15 }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', bottom: '-150px', left: '-100px', background: '#8b5cf6', filter: 'blur(80px)', opacity: 0.15 }} />
        <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#06b6d4', filter: 'blur(80px)', opacity: 0.1 }} />
      </div>

      <div className="animate-fade-in-up" style={{
        width: '100%', maxWidth: '440px', position: 'relative', zIndex: 10,
        borderRadius: '1.5rem', padding: '2.5rem 2rem', border: '1px solid rgba(255,255,255,0.1)',
        background: 'linear-gradient(135deg, rgba(17,24,39,0.85), rgba(30,41,59,0.5))',
        backdropFilter: 'blur(30px)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Logo size={56} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Sign in to manage your expenses</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} id="login-form">
          {/* Email */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.5rem' }} htmlFor="login-email">
              Email Address
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <MdEmail style={{ position: 'absolute', left: '14px', fontSize: '1.15rem', color: '#64748b', pointerEvents: 'none' }} />
              <input
                type="email" id="login-email" name="email"
                className="form-input"
                style={{ paddingLeft: '42px', paddingRight: '16px' }}
                placeholder="your@email.com"
                value={formData.email} onChange={handleChange} autoComplete="email"
              />
            </div>
            {errors.email && <span style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '0.35rem', display: 'block' }}>{errors.email}</span>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.5rem' }} htmlFor="login-password">
              Password
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <MdLock style={{ position: 'absolute', left: '14px', fontSize: '1.15rem', color: '#64748b', pointerEvents: 'none' }} />
              <input
                type={showPassword ? 'text' : 'password'} id="login-password" name="password"
                className="form-input"
                style={{ paddingLeft: '42px', paddingRight: '42px' }}
                placeholder="Enter your password"
                value={formData.password} onChange={handleChange} autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '14px', fontSize: '1.15rem', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>
            {errors.password && <span style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '0.35rem', display: 'block' }}>{errors.password}</span>}
          </div>

          {/* Submit */}
          <button type="submit" className="btn-primary" disabled={loading} id="login-submit"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <div className="spinner spinner-sm"></div> Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: '#94a3b8' }}>
          <p>
            Don&apos;t have an account?{' '}
            <Link to="/register" id="login-register-link"
              style={{ color: '#60a5fa', fontWeight: 600, textDecoration: 'none' }}>
              Create one
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div style={{
          marginTop: '1.5rem', padding: '1rem 1.25rem', borderRadius: '0.75rem',
          border: '1px dashed rgba(59,130,246,0.25)', textAlign: 'center',
          background: 'rgba(59,130,246,0.05)',
        }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
            Demo Credentials
          </p>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
            Email: <code style={{ padding: '2px 8px', borderRadius: '4px', background: '#1e293b', color: '#93c5fd', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>demo@bellcorp.com</code>
          </p>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Password: <code style={{ padding: '2px 8px', borderRadius: '4px', background: '#1e293b', color: '#93c5fd', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>demo123456</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
