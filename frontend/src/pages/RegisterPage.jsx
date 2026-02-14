import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdEmail, MdLock, MdPerson, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import Logo from '../components/common/Logo';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email format';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password);
    setLoading(false);
    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/dashboard', { replace: true });
    } else {
      toast.error(result.message || 'Registration failed');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const InputField = ({ id, name, label, type = 'text', placeholder, Icon, value, isPassword, showPw, onToggle, error }) => (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.5rem' }} htmlFor={id}>{label}</label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Icon style={{ position: 'absolute', left: '14px', fontSize: '1.15rem', color: '#64748b', pointerEvents: 'none' }} />
        <input
          type={isPassword ? (showPw ? 'text' : 'password') : type}
          id={id} name={name} className="form-input"
          style={{ paddingLeft: '42px', paddingRight: isPassword ? '42px' : '16px' }}
          placeholder={placeholder} value={value} onChange={handleChange}
          autoComplete={type === 'email' ? 'email' : name === 'name' ? 'name' : 'new-password'}
        />
        {isPassword && (
          <button type="button" onClick={onToggle}
            style={{ position: 'absolute', right: '14px', fontSize: '1.15rem', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
            {showPw ? <MdVisibilityOff /> : <MdVisibility />}
          </button>
        )}
      </div>
      {error && <span style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '0.35rem', display: 'block' }}>{error}</span>}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', position: 'relative', overflow: 'hidden' }} id="register-page">
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', top: '-200px', right: '-100px', background: '#8b5cf6', filter: 'blur(80px)', opacity: 0.15 }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', bottom: '-150px', left: '-100px', background: '#3b82f6', filter: 'blur(80px)', opacity: 0.15 }} />
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
            Create Account
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Start tracking your expenses today</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} id="register-form">
          <InputField id="register-name" name="name" label="Full Name" placeholder="John Doe"
            Icon={MdPerson} value={formData.name} error={errors.name} />
          <InputField id="register-email" name="email" label="Email Address" type="email" placeholder="your@email.com"
            Icon={MdEmail} value={formData.email} error={errors.email} />
          <InputField id="register-password" name="password" label="Password" placeholder="Min 6 characters"
            Icon={MdLock} value={formData.password} isPassword showPw={showPassword}
            onToggle={() => setShowPassword(!showPassword)} error={errors.password} />
          <InputField id="register-confirm" name="confirmPassword" label="Confirm Password" placeholder="Repeat your password"
            Icon={MdLock} value={formData.confirmPassword} isPassword showPw={showConfirmPassword}
            onToggle={() => setShowConfirmPassword(!showConfirmPassword)} error={errors.confirmPassword} />

          <button type="submit" className="btn-primary" disabled={loading} id="register-submit"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <div className="spinner spinner-sm"></div> Creating account...
              </span>
            ) : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: '#94a3b8' }}>
          <p>Already have an account?{' '}
            <Link to="/login" id="register-login-link" style={{ color: '#60a5fa', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
