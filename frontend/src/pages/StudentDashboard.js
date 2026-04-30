import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Award, Clock, TrendingUp, Play, Star, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyEnrollments, getRecommendations } from '../utils/api';
import Navbar from '../components/Navbar';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const enrollRes = await getMyEnrollments();
      setEnrollments(enrollRes.data);

      try {
        const recRes = await getRecommendations({
          enrolledCategories: enrollRes.data.map(e => e.courseId?.category).filter(Boolean),
          interests: 'web development, programming'
        });
        setRecommendations(recRes.data.recommendations || []);
      } catch (err) {
        console.log('Recommendations error:', err);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const completedCourses = enrollments.filter(e => e.isCompleted).length;
  const totalHours = enrollments.length * 8;

  const stats = [
    { label: 'Enrolled', value: enrollments.length, icon: <BookOpen size={20} />, color: '#6C63FF', bg: '#EDE9FE' },
    { label: 'Completed', value: completedCourses, icon: <Award size={20} />, color: '#14B8A6', bg: '#F0FDFA' },
    { label: 'Certificates', value: completedCourses, icon: <Star size={20} />, color: '#F97316', bg: '#FFF7ED' },
    { label: 'Hours Learned', value: totalHours, icon: <Clock size={20} />, color: '#8B5CF6', bg: '#F5F3FF' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, <span style={{ color: '#6C63FF' }}>{user?.name?.split(' ')[0]}!</span>
          </h1>
          <p className="text-gray-400 mt-1">Continue your learning journey</p>
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
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
          {['overview', 'my courses', 'certificates'].map(tab => (
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
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Continue Learning</h2>

            {loading ? (
              <div className="space-y-4">
                {[1,2].map(i => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                    <div className="h-4 bg-gray-100 rounded w-3/4 mb-3"></div>
                    <div className="h-2 bg-gray-100 rounded mb-2"></div>
                  </div>
                ))}
              </div>
            ) : enrollments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <BookOpen size={48} className="mx-auto mb-4 text-gray-200" />
                <p className="text-gray-400 text-lg">No courses enrolled yet!</p>
                <button
                  onClick={() => navigate('/courses')}
                  className="mt-4 px-6 py-3 rounded-xl text-white font-medium transition hover:opacity-90"
                  style={{ backgroundColor: '#6C63FF' }}
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              enrollments.map((enrollment, i) => (
                <motion.div
                  key={enrollment._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ backgroundColor: '#EDE9FE' }}>
                      📚
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {enrollment.courseId?.title || 'Course'}
                      </h3>
                      <p className="text-sm text-gray-400 mb-3">
                        by {enrollment.courseId?.instructor?.name}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${enrollment.progress}%`,
                              backgroundColor: enrollment.isCompleted ? '#14B8A6' : '#6C63FF'
                            }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-500 shrink-0">
                          {enrollment.progress}%
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/courses/${enrollment.courseId?._id}`)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shrink-0 transition hover:opacity-90"
                      style={{ backgroundColor: enrollment.isCompleted ? '#14B8A6' : '#6C63FF' }}
                    >
                      <Play size={14} />
                      {enrollment.isCompleted ? 'Review' : 'Continue'}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Recommendations */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#EDE9FE' }}>
                  <TrendingUp size={13} color="#6C63FF" />
                </div>
                <h3 className="font-semibold text-gray-800">AI Recommended</h3>
              </div>

              {recommendations.length === 0 ? (
                <div className="space-y-3">
                  {['React Advanced Patterns', 'Node.js Microservices', 'TypeScript Mastery'].map((title, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition"
                      onClick={() => navigate('/courses')}>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                        style={{ backgroundColor: '#EDE9FE' }}>📘</div>
                      <p className="text-sm text-gray-700 font-medium">{title}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {recommendations.map((rec, i) => (
                    <div key={i} className="p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition"
                      onClick={() => navigate('/courses')}>
                      <p className="text-sm font-medium text-gray-800">{rec.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{rec.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/courses')}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition hover:opacity-90 text-white"
                  style={{ backgroundColor: '#6C63FF' }}
                >
                  Browse New Courses
                </button>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;