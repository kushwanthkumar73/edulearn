import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, FileText, Camera, Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../utils/api';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const avatarOptions = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Buddy',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await updateProfile(formData);
      updateUser(res.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed!');
    }
    setLoading(false);
  };

  const getDashboardLink = () => {
    if (user?.role === 'instructor') return '/instructor';
    if (user?.role === 'admin') return '/admin';
    return '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(getDashboardLink())}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-gray-400 text-sm">Update your personal information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left — Avatar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
              {/* Current Avatar */}
              <div className="relative inline-block mb-4">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-purple-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto"
                    style={{ backgroundColor: '#6C63FF' }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#6C63FF' }}>
                  <Camera size={13} color="white" />
                </div>
              </div>

              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-400 capitalize mt-1">{user?.role}</p>
              <p className="text-xs text-gray-300 mt-1">{user?.email}</p>

              {/* Role Badge */}
              <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: user?.role === 'instructor' ? '#FFF7ED' :
                    user?.role === 'admin' ? '#F0FDFA' : '#EDE9FE',
                  color: user?.role === 'instructor' ? '#F97316' :
                    user?.role === 'admin' ? '#14B8A6' : '#6C63FF'
                }}>
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="md:col-span-2 space-y-4">

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl text-green-700 font-medium text-sm"
                style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}
              >
                ✅ Profile updated successfully!
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl text-red-600 text-sm"
                style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
                {error}
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Personal Information</h2>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </div>

                {/* Email — Read only */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-gray-300 text-xs">(cannot change)</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full pl-10 pr-4 py-3 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <div className="relative">
                    <FileText size={16} className="absolute left-3 top-3 text-gray-400" />
                    <textarea
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 resize-none"
                      placeholder="Tell students about yourself..."
                    />
                  </div>
                </div>

                {/* Avatar URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avatar URL <span className="text-gray-300 text-xs">(or pick below)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    placeholder="https://your-avatar-url.com/image.png"
                  />
                </div>

                {/* Avatar Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pick an Avatar
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {avatarOptions.map((avatar, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormData({ ...formData, avatar })}
                        className={`w-10 h-10 rounded-full overflow-hidden border-2 transition ${
                          formData.avatar === avatar
                            ? 'border-purple-500 scale-110'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <img src={avatar} alt={`Avatar ${i}`} className="w-full h-full" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium transition hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: '#6C63FF' }}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;