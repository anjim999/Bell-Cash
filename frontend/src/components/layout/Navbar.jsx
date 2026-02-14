import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  MdDashboard,
  MdExplore,
  MdAddCircle,
  MdLogout,
  MdMenu,
  MdClose,
  MdAccountCircle,
} from 'react-icons/md';
import Logo from '../common/Logo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <MdDashboard /> },
    { path: '/explorer', label: 'Explorer', icon: <MdExplore /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="sticky top-0 z-50 border-b border-white/10"
      style={{ background: 'rgba(10, 14, 26, 0.85)', backdropFilter: 'blur(20px)' }}
      id="main-navbar"
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 py-3 gap-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 no-underline shrink-0" id="nav-logo">
          <Logo size={36} />
          <span className="text-lg font-bold text-slate-100 tracking-tight">
            Expense<span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">Tracker</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium no-underline transition-all duration-200
                ${isActive(link.path)
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              id={`nav-link-${link.label.toLowerCase()}`}
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <Link
            to="/add-transaction"
            className="btn-primary px-3 py-2 text-sm no-underline"
            id="nav-add-transaction"
          >
            <MdAddCircle />
            <span className="hidden sm:inline">Add Transaction</span>
          </Link>

          {/* User Menu */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10"
            style={{ background: 'rgba(17,24,39,0.7)' }}
          >
            <MdAccountCircle className="text-2xl text-blue-400" />
            <span className="text-xs font-semibold text-slate-200">{user?.name}</span>
          </div>

          <button
            className="hidden sm:flex btn-icon"
            onClick={handleLogout}
            title="Logout"
            id="nav-logout"
            style={{ color: '#94a3b8' }}
          >
            <MdLogout />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="flex md:hidden btn-icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <MdClose /> : <MdMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="flex flex-col md:hidden px-4 pb-4 pt-1 border-t border-white/5 animate-fade-in-up" id="mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium no-underline transition-all
                ${isActive(link.path)
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </Link>
          ))}
          <Link
            to="/add-transaction"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-blue-400 no-underline"
            onClick={() => setMobileMenuOpen(false)}
          >
            <MdAddCircle className="text-lg" />
            Add Transaction
          </Link>
          <button
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 bg-transparent border-none w-full text-left cursor-pointer"
            onClick={handleLogout}
          >
            <MdLogout className="text-lg" />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
