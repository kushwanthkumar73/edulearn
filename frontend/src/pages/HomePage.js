import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Star, Users, Award, ArrowRight, Play, Code, Palette, Brain, Smartphone, Database, Globe } from 'lucide-react';
import Navbar from '../components/Navbar';
import { getCourses } from '../utils/api';

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getCourses({ limit: 6 });
        setCourses(res.data.slice(0, 6));
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, []);

  const categories = [
    { name: 'Web Development', icon: <Code size={24} />, count: '128 courses', color: '#EDE9FE', iconColor: '#6C63FF' },
    { name: 'AI & Machine Learning', icon: <Brain size={24} />, count: '64 courses', color: '#FFF7ED', iconColor: '#F97316' },
    { name: 'UI/UX Design', icon: <Palette size={24} />, count: '89 courses', color: '#F0FDFA', iconColor: '#14B8A6' },
    { name: 'Mobile Development', icon: <Smartphone size={24} />, count: '47 courses', color: '#EFF6FF', iconColor: '#3B82F6' },
    { name: 'Database & Backend', icon: <Database size={24} />, count: '56 courses', color: '#FDF4FF', iconColor: '#A855F7' },
    { name: 'Web3 & Blockchain', icon: <Globe size={24} />, count: '32 courses', color: '#ECFDF5', iconColor: '#10B981' },
  ];

  const stats = [
    { num: '10,000+', label: 'Active Students', icon: <Users size={20} /> },
    { num: '500+', label: 'Expert Courses', icon: <BookOpen size={20} /> },
    { num: '4.8/5', label: 'Average Rating', icon: <Star size={20} /> },
    { num: '98%', label: 'Completion Rate', icon: <Award size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section style={{ backgroundColor: '#0A1628' }} className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10" style={{ backgroundColor: '#6C63FF' }}></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10" style={{ backgroundColor: '#F97316' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 mb-8"
              style={{ backgroundColor: 'rgba(108,99,255,0.15)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#6C63FF' }}></span>
              <span className="text-white/70 text-sm">AI-Powered Learning Platform</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight mb-6">
              Learn Without<br />
              <span style={{ color: '#6C63FF' }}>Limits.</span>
            </h1>

            <p className="text-white/50 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Join 10,000+ students learning from expert instructors with AI-guided personalized learning paths and instant certificates.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/courses"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-medium text-lg transition hover:opacity-90"
                style={{ backgroundColor: '#6C63FF' }}>
                Start Learning Free
                <ArrowRight size={20} />
              </Link>
              <Link to="/register?role=instructor"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-medium text-lg transition border border-white/20 hover:bg-white/10"
                style={{ color: 'white' }}>
                <Play size={18} />
                Become Instructor
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="text-center p-4 rounded-xl border border-white/10"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                >
                  <div className="flex justify-center mb-2 text-white/40">{stat.icon}</div>
                  <p className="text-2xl font-bold text-white">{stat.num}</p>
                  <p className="text-white/40 text-xs mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-6" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-gray-400 text-lg">Explore courses across different domains</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -4 }}
                onClick={() => navigate(`/courses?category=${cat.name}`)}
                className="cursor-pointer p-4 rounded-2xl border border-gray-100 text-center hover:shadow-lg transition-all"
                style={{ backgroundColor: cat.color }}
              >
                <div className="flex justify-center mb-3" style={{ color: cat.iconColor }}>
                  {cat.icon}
                </div>
                <p className="text-sm font-medium text-gray-800">{cat.name}</p>
                <p className="text-xs text-gray-400 mt-1">{cat.count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Featured Courses</h2>
              <p className="text-gray-400">Hand-picked courses by our experts</p>
            </div>
            <Link to="/courses" className="flex items-center gap-2 font-medium hover:gap-3 transition-all"
              style={{ color: '#6C63FF' }}>
              View all <ArrowRight size={16} />
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-100"></div>
                  <div className="p-5">
                    <div className="h-4 bg-gray-100 rounded mb-3"></div>
                    <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, i) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => navigate(`/courses/${course._id}`)}
                >
                  <div className="h-48 flex items-center justify-center text-5xl"
                    style={{ backgroundColor: '#EDE9FE' }}>
                    📚
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{ backgroundColor: '#EDE9FE', color: '#6C63FF' }}>
                        {course.category}
                      </span>
                      <span className="text-xs font-medium px-2 py-1 rounded-full capitalize"
                        style={{ backgroundColor: '#FFF7ED', color: '#F97316' }}>
                        {course.level}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">by {course.instructor?.name}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star size={14} fill="#F97316" color="#F97316" />
                        <span className="text-sm font-medium text-gray-700">{course.rating || '4.8'}</span>
                        <span className="text-xs text-gray-400">({course.totalReviews || 0})</span>
                      </div>
                      <span className="font-bold" style={{ color: course.price === 0 ? '#14B8A6' : '#1E293B' }}>
                        {course.price === 0 ? 'FREE' : `₹${course.price}`}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6" style={{ backgroundColor: '#0A1628' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Start<br />
              <span style={{ color: '#6C63FF' }}>Learning?</span>
            </h2>
            <p className="text-white/50 text-lg mb-10">
              Join thousands of students who are already learning and growing with EduLearn.
            </p>
            <Link to="/register"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-white font-medium text-lg transition hover:opacity-90"
              style={{ backgroundColor: '#6C63FF' }}>
              Get Started Free
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0A1628' }} className="border-t border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#6C63FF' }}>
              <BookOpen size={14} color="white" />
            </div>
            <span className="text-white font-medium">EduLearn</span>
          </div>
          <p className="text-white/30 text-sm">© 2026 EduLearn. Built by Kushwanth Kumar Bevara</p>
          <div className="flex gap-6">
            <Link to="/courses" className="text-white/40 hover:text-white text-sm transition">Courses</Link>
            <Link to="/register" className="text-white/40 hover:text-white text-sm transition">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;