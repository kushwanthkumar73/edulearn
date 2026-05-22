import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Video, ChevronLeft, Check, X } from 'lucide-react';
import { createLesson, getLessons, deleteLesson, uploadVideo, getCourse } from '../utils/api';
import Navbar from '../components/Navbar';

const AddLessonPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    isFree: false,
    videoUrl: '',
  });

  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const fetchData = async () => {
    try {
      const [courseRes, lessonsRes] = await Promise.all([
        getCourse(courseId),
        getLessons(courseId)
      ]);
      setCourse(courseRes.data);
      setLessons(lessonsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleUploadVideo = async () => {
    if (!videoFile) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const fd = new FormData();
      fd.append('video', videoFile);
      const res = await uploadVideo(fd, setUploadProgress);
      setFormData({ ...formData, videoUrl: res.data.url });
      alert('Video uploaded successfully!');
    } catch (err) {
      alert('Upload failed!');
    }
    setUploading(false);
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!formData.title) return alert('Title required!');
    setLoading(true);
    try {
      const lessonData = {
        ...formData,
        courseId,
        order: lessons.length + 1,
        duration: Number(formData.duration) || 0,
      };
      const res = await createLesson(lessonData);
      setLessons([...lessons, res.data.lesson]);
      setFormData({ title: '', description: '', duration: '', isFree: false, videoUrl: '' });
      setVideoFile(null);
      setVideoPreview('');
      alert('Lesson added!');
    } catch (err) {
      alert('Error adding lesson!');
    }
    setLoading(false);
  };

  const handleDeleteLesson = async (id) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await deleteLesson(id);
      setLessons(lessons.filter(l => l._id !== id));
    } catch (err) {
      alert('Error deleting!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/instructor')}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition">
            <ChevronLeft size={20} /> Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Lessons</h1>
            <p className="text-gray-400 text-sm">{course?.title}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Add Lesson Form */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Add New Lesson</h2>

              <form onSubmit={handleAddLesson} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-500"
                    placeholder="e.g. Introduction to React"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 resize-none"
                    placeholder="What will students learn in this lesson?"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (mins)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-500"
                      placeholder="20"
                    />
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFree}
                        onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                        className="w-4 h-4 accent-purple-600"
                      />
                      <span className="text-sm text-gray-600">Free preview</span>
                    </label>
                  </div>
                </div>

                {/* Video Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video</label>

                  {!videoPreview ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-purple-400 transition">
                      <Upload size={24} className="text-gray-300 mb-2" />
                      <span className="text-sm text-gray-400">Click to upload video</span>
                      <span className="text-xs text-gray-300 mt-1">MP4, AVI, MOV (max 500MB)</span>
                      <input type="file" accept="video/*" onChange={handleVideoSelect} className="hidden" />
                    </label>
                  ) : (
                    <div className="space-y-3">
                      <video src={videoPreview} controls className="w-full rounded-xl" style={{ maxHeight: '160px' }} />

                      {formData.videoUrl ? (
                        <div className="flex items-center gap-2 p-3 rounded-xl"
                          style={{ backgroundColor: '#F0FDFA' }}>
                          <Check size={16} color="#14B8A6" />
                          <span className="text-sm font-medium" style={{ color: '#14B8A6' }}>
                            Video uploaded to Cloudinary!
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {uploading && (
                            <div>
                              <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Uploading...</span>
                                <span>{uploadProgress}%</span>
                              </div>
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all"
                                  style={{ width: `${uploadProgress}%`, backgroundColor: '#6C63FF' }}
                                />
                              </div>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleUploadVideo}
                              disabled={uploading}
                              className="flex-1 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-60"
                              style={{ backgroundColor: '#6C63FF' }}
                            >
                              {uploading ? 'Uploading...' : 'Upload to Cloudinary'}
                            </button>
                            <button
                              type="button"
                              onClick={() => { setVideoFile(null); setVideoPreview(''); }}
                              className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-red-400"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-white font-medium transition hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: '#6C63FF' }}
                >
                  {loading ? 'Adding...' : '+ Add Lesson'}
                </button>
              </form>
            </div>
          </div>

          {/* Lessons List */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">Lessons</h2>
                <span className="text-sm text-gray-400">{lessons.length} lessons</span>
              </div>

              {lessons.length === 0 ? (
                <div className="text-center py-8">
                  <Video size={40} className="mx-auto mb-3 text-gray-200" />
                  <p className="text-gray-400 text-sm">No lessons yet</p>
                  <p className="text-gray-300 text-xs mt-1">Add your first lesson</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lessons.map((lesson, i) => (
                    <motion.div
                      key={lesson._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50"
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white shrink-0"
                        style={{ backgroundColor: '#6C63FF' }}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{lesson.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {lesson.duration > 0 && (
                            <span className="text-xs text-gray-400">{lesson.duration} min</span>
                          )}
                          {lesson.isFree && (
                            <span className="text-xs px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: '#F0FDFA', color: '#14B8A6' }}>
                              Free
                            </span>
                          )}
                          {lesson.videoUrl && (
                            <span className="text-xs px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: '#EDE9FE', color: '#6C63FF' }}>
                              Video
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteLesson(lesson._id)}
                        className="p-1.5 text-gray-300 hover:text-red-400 transition shrink-0"
                      >
                        <X size={15} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLessonPage;