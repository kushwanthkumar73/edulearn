import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Search, Bell, ChevronDown, LogOut, User, LayoutDashboard, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdown, setDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenu(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search) {
      navigate(`/courses?search=${search}`);
      setMobileMenu(false);
    }
  };

  const getDashboardLink = () => {
    if (user?.role === 'instructor') return '/instructor';
    if (user?.role === 'admin') return '/admin';
    return '/dashboard';
  };

  return (
    <nav style={{ backgroundColor: '#0A1628' }} className="sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#6C63FF' }}>
            <BookOpen size={16} color="white" />
          </div>
          <span className="text-white font-semibold text-lg">EduLearn</span>
        </Link>

        {/* Search — Desktop */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
          <div className="flex w-full bg-white/10 rounded-lg overflow-hidden border border-white/20">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="flex-1 bg-transparent text-white placeholder-white/40 px-4 py-2 text-sm outline-none"
            />
            <button type="submit" className="px-4 py-2 hover:bg-white/10 transition">
              <Search size={16} color="rgba(255,255,255,0.6)" />
            </button>
          </div>
        </form>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/courses" className="text-white/60 hover:text-white text-sm transition">
            Courses
          </Link>

          {!user ? (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-white/60 hover:text-white text-sm transition">Login</Link>
              <Link to="/register"
                className="text-white text-sm px-4 py-2 rounded-lg font-medium transition"
                style={{ backgroundColor: '#6C63FF' }}>
                Get Started
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button className="text-white/60 hover:text-white transition">
                <Bell size={18} />
              </button>
              <div className="relative">
                <button
                  onClick={() => setDropdown(!dropdown)}
                  className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-2 py-1 transition"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: '#6C63FF' }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-white text-sm hidden md:block">{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} color="rgba(255,255,255,0.6)" />
                </button>

                {dropdown && (
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                    </div>
                    <Link to={getDashboardLink()} onClick={() => setDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition">
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    <Link to="/profile" onClick={() => setDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition">
                      <User size={15} /> Profile
                    </Link>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition">
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="md:hidden text-white p-1"
        >
          {mobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden border-t border-white/10 px-4 py-4 space-y-3"
          style={{ backgroundColor: '#0A1628' }}>

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex">
            <div className="flex w-full bg-white/10 rounded-lg overflow-hidden border border-white/20">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses..."
                className="flex-1 bg-transparent text-white placeholder-white/40 px-4 py-2 text-sm outline-none"
              />
              <button type="submit" className="px-4">
                <Search size={16} color="rgba(255,255,255,0.6)" />
              </button>
            </div>
          </form>

          <Link to="/courses" onClick={() => setMobileMenu(false)}
            className="block text-white/60 hover:text-white text-sm py-2 transition">
            Courses
          </Link>

          {!user ? (
            <div className="space-y-2">
              <Link to="/login" onClick={() => setMobileMenu(false)}
                className="block text-center py-2 rounded-lg text-white/60 border border-white/20 text-sm">
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileMenu(false)}
                className="block text-center py-2 rounded-lg text-white text-sm font-medium"
                style={{ backgroundColor: '#6C63FF' }}>
                Get Started
              </Link>
            </div>
          ) : (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center gap-3 py-2">
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ backgroundColor: '#6C63FF' }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-white text-sm font-medium">{user.name}</p>
                  <p className="text-white/40 text-xs capitalize">{user.role}</p>
                </div>
              </div>
              <Link to={getDashboardLink()} onClick={() => setMobileMenu(false)}
                className="flex items-center gap-3 py-2 text-white/60 hover:text-white text-sm transition">
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              <Link to="/profile" onClick={() => setMobileMenu(false)}
                className="flex items-center gap-3 py-2 text-white/60 hover:text-white text-sm transition">
                <User size={15} /> Profile
              </Link>
              <button onClick={handleLogout}
                className="flex items-center gap-3 py-2 text-red-400 text-sm w-full">
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;