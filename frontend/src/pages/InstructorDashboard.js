import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users, Star, TrendingUp, Plus, Edit, Trash2, Eye, EyeOff, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyCourses, deleteCourse, publishCourse } from '../utils/api';
import Navbar from '../components/Navbar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const InstructorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await getMyCourses();
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await deleteCourse(id);
      setCourses(courses.filter(c => c._id !== id));
    } catch (err) {
      alert('Error deleting!');
    }
  };

  const handlePublish = async (id) => {
    try {
      const res = await publishCourse(id);
      setCourses(courses.map(c => c._id === id ? res.data.course : c));
    } catch (err) {
      alert('Error updating!');
    }
  };

  const totalStudents = courses.reduce((sum, c) => sum + (c.totalStudents || 0), 0);
  const totalRevenue = courses.reduce((sum, c) => sum + ((c.price || 0) * (c.totalStudents || 0)), 0);
  const avgRating = courses.length > 0
    ? (courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length).toFixed(1)
    : '0.0';

  const chartData = courses.map(c => ({
    name: c.title.substring(0, 15) + '...',
    students: c.totalStudents || 0,
    revenue: (c.price || 0) * (c.totalStudents || 0)
  }));

  const stats = [
    { label: 'Total Students', value: totalStudents, icon: <Users size={20} />, color: '#6C63FF', bg: '#EDE9FE' },
    { label: 'Total Courses', value: courses.length, icon: <BookOpen size={20} />, color: '#F97316', bg: '#FFF7ED' },
    { label: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: <TrendingUp size={20} />, color: '#14B8A6', bg: '#F0FDFA' },
    { label: 'Avg Rating', value: avgRating, icon: <Star size={20} />, color: '#F59E0B', bg: '#FFFBEB' },
  ];

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
            <h1 className="text-3xl font-bold text-gray-900">
              Instructor Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={() => navigate('/instructor/create')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-white font-medium transition hover:opacity-90"
            style={{ backgroundColor: '#6C63FF' }}
          >
            <Plus size={18} />
            Create Course
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* My Courses */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">My Courses</h2>

            {loading ? (
              <div className="space-y-4">
                {[1,2].map(i => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                    <div className="h-4 bg-gray-100 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <BookOpen size={48} className="mx-auto mb-4 text-gray-200" />
                <p className="text-gray-400 text-lg">No courses yet!</p>
                <button
                  onClick={() => navigate('/instructor/create')}
                  className="mt-4 px-6 py-3 rounded-xl text-white font-medium"
                  style={{ backgroundColor: '#6C63FF' }}
                >
                  Create Your First Course
                </button>
              </div>
            ) : (
              courses.map((course, i) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-100 p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ backgroundColor: '#EDE9FE' }}>
                      📚
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Users size={13} /> {course.totalStudents || 0} students
                            </span>
                            <span className="flex items-center gap-1">
                              <Star size={13} /> {course.rating || '0'}
                            </span>
                            <span className="font-medium" style={{ color: '#14B8A6' }}>
                              ₹{((course.price || 0) * (course.totalStudents || 0)).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          course.isPublished
                            ? 'text-green-700 bg-green-50'
                            : 'text-orange-700 bg-orange-50'
                        }`}>
                          {course.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                    <button
                      onClick={() => handlePublish(course._id)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition"
                      style={{
                        backgroundColor: course.isPublished ? '#FFF7ED' : '#EDE9FE',
                        color: course.isPublished ? '#F97316' : '#6C63FF'
                      }}
                    >
                      {course.isPublished ? <EyeOff size={13} /> : <Eye size={13} />}
                      {course.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 transition"
                    >
                      <Edit size={13} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 transition"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Revenue Chart */}
            {chartData.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Students per Course</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="students" fill="#6C63FF" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/instructor/create')}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-white transition hover:opacity-90"
                  style={{ backgroundColor: '#6C63FF' }}
                >
                  + Create New Course
                </button>
                <button
                  onClick={() => navigate('/courses')}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 transition"
                >
                  Browse All Courses
                </button>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition"
                >
                  <LogOut size={15} /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;