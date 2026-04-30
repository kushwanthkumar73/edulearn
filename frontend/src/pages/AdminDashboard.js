import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, TrendingUp, Shield, Check, Trash2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAdminStats, getAdminUsers, approveInstructor, getAdminCourses } from '../utils/api';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, coursesRes] = await Promise.all([
        getAdminStats(),
        getAdminUsers(),
        getAdminCourses()
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleApprove = async (userId) => {
    try {
      await approveInstructor(userId);
      setUsers(users.map(u =>
        u._id === userId ? { ...u, isApproved: true } : u
      ));
    } catch (err) {
      alert('Error approving!');
    }
  };

  const pendingInstructors = users.filter(u => u.role === 'instructor' && !u.isApproved);

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers || 0, icon: <Users size={20} />, color: '#6C63FF', bg: '#EDE9FE' },
    { label: 'Total Courses', value: stats.totalCourses || 0, icon: <BookOpen size={20} />, color: '#F97316', bg: '#FFF7ED' },
    { label: 'Enrollments', value: stats.totalEnrollments || 0, icon: <TrendingUp size={20} />, color: '#14B8A6', bg: '#F0FDFA' },
    { label: 'Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: <Shield size={20} />, color: '#8B5CF6', bg: '#F5F3FF' },
  ];

  const tabs = ['overview', 'users', 'courses', 'pending'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-400 mt-1">Manage your platform</p>
          </div>
          {pendingInstructors.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ backgroundColor: '#FFF7ED' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#F97316' }}></span>
              <span className="text-sm font-medium" style={{ color: '#F97316' }}>
                {pendingInstructors.length} pending approvals
              </span>
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 p-5"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: stat.bg, color: stat.color }}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {tab === 'pending' && pendingInstructors.length > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs text-white"
                  style={{ backgroundColor: '#F97316' }}>
                  {pendingInstructors.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Recent Users</h3>
              <div className="space-y-3">
                {users.slice(0, 5).map((u, i) => (
                  <div key={u._id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0"
                      style={{ backgroundColor: '#6C63FF' }}>
                      {u.name?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${
                      u.role === 'admin' ? 'bg-purple-50 text-purple-600' :
                      u.role === 'instructor' ? 'bg-orange-50 text-orange-600' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Courses */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Recent Courses</h3>
              <div className="space-y-3">
                {courses.slice(0, 5).map((c, i) => (
                  <div key={c._id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                      style={{ backgroundColor: '#EDE9FE' }}>
                      📚
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{c.title}</p>
                      <p className="text-xs text-gray-400">by {c.instructor?.name}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      c.isPublished ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'
                    }`}>
                      {c.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC' }}>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase">User</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Role</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
                          style={{ backgroundColor: '#6C63FF' }}>
                          {u.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full capitalize font-medium ${
                        u.role === 'admin' ? 'bg-purple-50 text-purple-600' :
                        u.role === 'instructor' ? 'bg-orange-50 text-orange-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        u.isApproved ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                      }`}>
                        {u.isApproved ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC' }}>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Course</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Instructor</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Students</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {courses.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                          style={{ backgroundColor: '#EDE9FE' }}>📚</div>
                        <p className="text-sm font-medium text-gray-800 line-clamp-1 max-w-xs">{c.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{c.instructor?.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{c.totalStudents || 0}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        c.isPublished ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'
                      }`}>
                        {c.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingInstructors.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <Check size={48} className="mx-auto mb-4 text-green-200" />
                <p className="text-gray-400">No pending approvals!</p>
              </div>
            ) : (
              pendingInstructors.map((u) => (
                <motion.div
                  key={u._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: '#F97316' }}>
                    {u.name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{u.name}</p>
                    <p className="text-sm text-gray-400">{u.email}</p>
                    <p className="text-xs text-gray-300 mt-1">
                      Applied: {new Date(u.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleApprove(u._id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition hover:opacity-90"
                    style={{ backgroundColor: '#14B8A6' }}
                  >
                    <Check size={15} />
                    Approve
                  </button>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Logout */}
        <div className="mt-8">
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 text-sm transition"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;