import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User, Mail, Lock, Eye, EyeOff, GraduationCap, Briefcase } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await register(formData);
      const role = res.data.user.role;
      if (role === 'instructor') {
        alert('Registration successful! Please wait for admin approval.');
        navigate('/login');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0A1628' }}>
      {/* Left Side */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 py-12">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#6C63FF' }}>
            <BookOpen size={20} color="white" />
          </div>
          <span className="text-white text-2xl font-semibold">EduLearn</span>
        </div>
        <h1 className="text-5xl font-bold text-white leading-tight mb-6">
          Start Your<br />
          <span style={{ color: '#F97316' }}>Journey Today.</span>
        </h1>
        <p className="text-white/50 text-lg leading-relaxed max-w-md">
          Create your free account and get access to 500+ courses taught by industry experts.
        </p>
        <div className="mt-12 space-y-4">
          {[
            'Access 500+ courses for free',
            'AI-powered course recommendations',
            'Get certificates on completion',
            'Learn at your own pace',
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6C63FF' }}>
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-white/60 text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Create account</h2>
            <p className="text-gray-400 text-sm">Join thousands of learners today</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'student' })}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 transition ${
                formData.role === 'student'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <GraduationCap size={18} color={formData.role === 'student' ? '#6C63FF' : '#9CA3AF'} />
              <div className="text-left">
                <p className={`text-sm font-medium ${formData.role === 'student' ? 'text-purple-600' : 'text-gray-600'}`}>Student</p>
                <p className="text-xs text-gray-400">I want to learn</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'instructor' })}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 transition ${
                formData.role === 'instructor'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Briefcase size={18} color={formData.role === 'instructor' ? '#F97316' : '#9CA3AF'} />
              <div className="text-left">
                <p className={`text-sm font-medium ${formData.role === 'instructor' ? 'text-orange-600' : 'text-gray-600'}`}>Instructor</p>
                <p className="text-xs text-gray-400">I want to teach</p>
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-medium transition hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: formData.role === 'instructor' ? '#F97316' : '#6C63FF' }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </div>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-medium hover:underline" style={{ color: '#6C63FF' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;