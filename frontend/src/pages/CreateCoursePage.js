import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Plus, X, Upload, ChevronLeft } from 'lucide-react';
import { createCourse, publishCourse } from '../utils/api';
import Navbar from '../components/Navbar';

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [courseId, setCourseId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: 0,
    level: 'beginner',
    whatYouLearn: [''],
    requirements: [''],
  });

  const categories = [
    'Web Development', 'AI & Machine Learning', 'UI/UX Design',
    'Mobile Development', 'Database & Backend', 'Web3 & Blockchain',
    'DevOps & Cloud', 'Cybersecurity', 'Game Development', 'Data Science'
  ];

  const addItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeItem = (field, index) => {
    const updated = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updated });
  };

  const updateItem = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const handleSaveDraft = async () => {
    if (!formData.title || !formData.description || !formData.category) {
      alert('Title, description and category required!');
      return;
    }
    setLoading(true);
    try {
      const data = {
        ...formData,
        whatYouLearn: formData.whatYouLearn.filter(i => i.trim()),
        requirements: formData.requirements.filter(i => i.trim()),
      };
      const res = await createCourse(data);
      setCourseId(res.data.course._id);
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.error || 'Error creating course!');
    }
    setLoading(false);
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      await publishCourse(courseId);
      alert('Course published successfully!');
      navigate('/instructor');
    } catch (err) {
      alert('Error publishing!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/instructor')}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition"
          >
            <ChevronLeft size={20} /> Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
            <p className="text-gray-400 text-sm">Fill in the details to create your course</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-3 mb-8">
          {['Course Details', 'Review & Publish'].map((s, i) => (
            <React.Fragment key={i}>
              <div className={`flex items-center gap-2 ${step === i + 1 ? 'text-purple-600' : step > i + 1 ? 'text-green-500' : 'text-gray-300'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white ${
                  step === i + 1 ? 'bg-purple-600' : step > i + 1 ? 'bg-green-500' : 'bg-gray-200'
                }`}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span className="text-sm font-medium hidden md:block">{s}</span>
              </div>
              {i < 1 && <div className="flex-1 h-0.5 bg-gray-200" />}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1 — Course Details */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Basic Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Basic Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    placeholder="e.g. Full Stack React & Node.js Masterclass"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 resize-none"
                    placeholder="Describe what students will learn in this course..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 bg-white"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 bg-white"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, price: 0 })}
                      className={`flex-1 py-3 rounded-xl border text-sm font-medium transition ${
                        formData.price === 0
                          ? 'border-teal-500 bg-teal-50 text-teal-600'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      Free
                    </button>
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                      <input
                        type="number"
                        value={formData.price || ''}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-full pl-7 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-500"
                        placeholder="999"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What You'll Learn */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">What students will learn</h2>
              <div className="space-y-3">
                {formData.whatYouLearn.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-3"
                      style={{ backgroundColor: '#EDE9FE' }}>
                      <span className="text-xs font-medium" style={{ color: '#6C63FF' }}>✓</span>
                    </div>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateItem('whatYouLearn', i, e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-500"
                      placeholder={`Learning outcome ${i + 1}`}
                    />
                    {formData.whatYouLearn.length > 1 && (
                      <button onClick={() => removeItem('whatYouLearn', i)}
                        className="p-2 text-gray-300 hover:text-red-400 transition mt-1">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addItem('whatYouLearn')}
                  className="flex items-center gap-2 text-sm font-medium transition"
                  style={{ color: '#6C63FF' }}
                >
                  <Plus size={16} /> Add outcome
                </button>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Requirements</h2>
              <div className="space-y-3">
                {formData.requirements.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateItem('requirements', i, e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-500"
                      placeholder={`Requirement ${i + 1}`}
                    />
                    {formData.requirements.length > 1 && (
                      <button onClick={() => removeItem('requirements', i)}
                        className="p-2 text-gray-300 hover:text-red-400 transition">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addItem('requirements')}
                  className="flex items-center gap-2 text-sm font-medium transition"
                  style={{ color: '#6C63FF' }}
                >
                  <Plus size={16} /> Add requirement
                </button>
              </div>
            </div>

            <button
              onClick={handleSaveDraft}
              disabled={loading}
              className="w-full py-4 rounded-xl text-white font-medium text-lg transition hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: '#6C63FF' }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : 'Save & Continue →'}
            </button>
          </motion.div>
        )}

        {/* Step 2 — Review & Publish */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Review Your Course</h2>

              <div className="space-y-4">
                <div className="flex justify-between items-start py-3 border-b border-gray-50">
                  <span className="text-sm text-gray-400">Title</span>
                  <span className="text-sm font-medium text-gray-800 text-right max-w-xs">{formData.title}</span>
                </div>
                <div className="flex justify-between items-start py-3 border-b border-gray-50">
                  <span className="text-sm text-gray-400">Category</span>
                  <span className="text-sm font-medium text-gray-800">{formData.category}</span>
                </div>
                <div className="flex justify-between items-start py-3 border-b border-gray-50">
                  <span className="text-sm text-gray-400">Level</span>
                  <span className="text-sm font-medium text-gray-800 capitalize">{formData.level}</span>
                </div>
                <div className="flex justify-between items-start py-3 border-b border-gray-50">
                  <span className="text-sm text-gray-400">Price</span>
                  <span className="text-sm font-medium" style={{ color: formData.price === 0 ? '#14B8A6' : '#1E293B' }}>
                    {formData.price === 0 ? 'FREE' : `₹${formData.price}`}
                  </span>
                </div>
                <div className="flex justify-between items-start py-3 border-b border-gray-50">
                  <span className="text-sm text-gray-400">Learning outcomes</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formData.whatYouLearn.filter(i => i.trim()).length} items
                  </span>
                </div>
                <div className="flex justify-between items-start py-3">
                  <span className="text-sm text-gray-400">Requirements</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formData.requirements.filter(i => i.trim()).length} items
                  </span>
                </div>
              </div>
            </div>

            {/* Publish Note */}
            <div className="p-4 rounded-xl border" style={{ backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }}>
              <p className="text-sm font-medium" style={{ color: '#854F0B' }}>After publishing:</p>
              <ul className="mt-2 space-y-1">
                <li className="text-sm" style={{ color: '#854F0B' }}>• Students can see and enroll in your course</li>
                <li className="text-sm" style={{ color: '#854F0B' }}>• Add video lessons from Instructor Dashboard</li>
                <li className="text-sm" style={{ color: '#854F0B' }}>• You can edit course details anytime</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 rounded-xl border border-gray-200 text-gray-600 font-medium transition hover:bg-gray-50"
              >
                ← Edit Details
              </button>
              <button
                onClick={handlePublish}
                disabled={loading}
                className="flex-1 py-4 rounded-xl text-white font-medium transition hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: '#6C63FF' }}
              >
                {loading ? 'Publishing...' : '🚀 Publish Course'}
              </button>
            </div>

            <button
              onClick={() => navigate('/instructor')}
              className="w-full py-3 rounded-xl text-gray-400 text-sm hover:text-gray-600 transition"
            >
              Save as Draft — Publish Later
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CreateCoursePage;