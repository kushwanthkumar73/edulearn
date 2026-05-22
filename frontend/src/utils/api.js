import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL + '/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.patch('/auth/profile', data);

// Courses
export const getCourses = (params) => API.get('/courses', { params });
export const getCourse = (id) => API.get(`/courses/${id}`);
export const createCourse = (data) => API.post('/courses', data);
export const updateCourse = (id, data) => API.patch(`/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);
export const getMyCourses = () => API.get('/courses/instructor/my-courses');
export const publishCourse = (id) => API.patch(`/courses/${id}/publish`);

// Lessons
export const getLessons = (courseId) => API.get(`/lessons/course/${courseId}`);
export const getLesson = (id) => API.get(`/lessons/${id}`);
export const createLesson = (data) => API.post('/lessons', data);
export const updateLesson = (id, data) => API.patch(`/lessons/${id}`, data);
export const deleteLesson = (id) => API.delete(`/lessons/${id}`);

// Enrollments
export const enrollFree = (courseId) => API.post(`/enrollments/enroll/${courseId}`);
export const getMyEnrollments = () => API.get('/enrollments/my-courses');
export const checkEnrollment = (courseId) => API.get(`/enrollments/check/${courseId}`);
export const updateProgress = (courseId, data) => API.patch(`/enrollments/progress/${courseId}`, data);

// Reviews
export const getReviews = (courseId) => API.get(`/reviews/${courseId}`);
export const addReview = (courseId, data) => API.post(`/reviews/${courseId}`, data);

// Payments
export const createOrder = (data) => API.post('/payments/create-order', data);
export const verifyPayment = (data) => API.post('/payments/verify', data);

// AI
export const generateQuiz = (data) => API.post('/ai/generate-quiz', data);
export const getRecommendations = (data) => API.post('/ai/recommendations', data);

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminUsers = () => API.get('/admin/users');
export const approveInstructor = (id) => API.patch(`/admin/approve/${id}`);
export const getAdminCourses = () => API.get('/admin/courses');

// Upload
export const uploadVideo = (formData, onProgress) => API.post('/upload/video', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  onUploadProgress: (e) => {
    if (onProgress) onProgress(Math.round((e.loaded * 100) / e.total));
  }
});

export const uploadImage = (formData) => API.post('/upload/image', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

// Certificate
export const downloadCertificate = (courseId) =>
  API.get(`/certificates/generate/${courseId}`, { responseType: 'blob' });

export default API;