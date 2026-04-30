import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Star, Users, SlidersHorizontal } from 'lucide-react';
import Navbar from '../components/Navbar';
import { getCourses } from '../utils/api';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    level: '',
    price: '',
    sort: 'popular'
  });

  const categories = [
    'Web Development', 'AI & Machine Learning', 'UI/UX Design',
    'Mobile Development', 'Database & Backend', 'Web3 & Blockchain'
  ];

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await getCourses(filters);
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div style={{ backgroundColor: '#0A1628' }} className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">All Courses</h1>
          <p className="text-white/50 mb-6">Explore 500+ courses taught by expert instructors</p>
          <div className="flex gap-3 max-w-2xl">
            <div className="flex-1 flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-4 py-3">
              <Search size={18} color="rgba(255,255,255,0.5)" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search courses..."
                className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-sm"
              />
            </div>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm outline-none"
            >
              <option value="popular" className="text-gray-800">Most Popular</option>
              <option value="rating" className="text-gray-800">Top Rated</option>
              <option value="price-low" className="text-gray-800">Price: Low to High</option>
              <option value="price-high" className="text-gray-800">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">

        {/* Sidebar */}
        <div className="w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
            <div className="flex items-center gap-2 mb-5">
              <SlidersHorizontal size={16} color="#6C63FF" />
              <h3 className="font-semibold text-gray-800">Filters</h3>
            </div>

            {/* Category */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Category</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="category" value=""
                    checked={filters.category === ''}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="accent-purple-600" />
                  <span className="text-sm text-gray-600">All Categories</span>
                </label>
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="category" value={cat}
                      checked={filters.category === cat}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                      className="accent-purple-600" />
                    <span className="text-sm text-gray-600">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Level */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Level</p>
              <div className="space-y-2">
                {['', 'beginner', 'intermediate', 'advanced'].map((level, i) => (
                  <label key={i} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="level" value={level}
                      checked={filters.level === level}
                      onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                      className="accent-purple-600" />
                    <span className="text-sm text-gray-600 capitalize">{level || 'All Levels'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Price</p>
              <div className="space-y-2">
                {[
                  { value: '', label: 'All' },
                  { value: 'free', label: 'Free' },
                  { value: 'paid', label: 'Paid' },
                ].map((opt, i) => (
                  <label key={i} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="price" value={opt.value}
                      checked={filters.price === opt.value}
                      onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                      className="accent-purple-600" />
                    <span className="text-sm text-gray-600">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="flex-1">
          <p className="text-gray-400 text-sm mb-6">{courses.length} courses found</p>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-44 bg-gray-100"></div>
                  <div className="p-5">
                    <div className="h-4 bg-gray-100 rounded mb-3 w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No courses found!</p>
              <p className="text-gray-300 text-sm mt-2">Try different filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, i) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => navigate(`/courses/${course._id}`)}
                >
                  <div className="h-44 flex items-center justify-center text-5xl"
                    style={{ backgroundColor: '#EDE9FE' }}>
                    📚
                  </div>
                  <div className="p-5">
                    <div className="flex gap-2 mb-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{ backgroundColor: '#EDE9FE', color: '#6C63FF' }}>
                        {course.category}
                      </span>
                      <span className="text-xs font-medium px-2 py-1 rounded-full capitalize"
                        style={{ backgroundColor: '#FFF7ED', color: '#F97316' }}>
                        {course.level}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">by {course.instructor?.name}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star size={13} fill="#F97316" color="#F97316" />
                        <span className="text-sm font-medium text-gray-700">{course.rating || '4.8'}</span>
                        <span className="text-xs text-gray-400 ml-1">
                          <Users size={11} className="inline mr-1" />
                          {course.totalStudents || 0}
                        </span>
                      </div>
                      <span className="font-bold text-lg"
                        style={{ color: course.price === 0 ? '#14B8A6' : '#1E293B' }}>
                        {course.price === 0 ? 'FREE' : `₹${course.price}`}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;