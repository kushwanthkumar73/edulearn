import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users, Clock, Award, ChevronDown, ChevronUp, Play, Lock, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import { getCourse, getLessons, checkEnrollment, enrollFree, createOrder, verifyPayment } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const CourseDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [openSection, setOpenSection] = useState(0);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [courseRes, lessonsRes] = await Promise.all([
        getCourse(id),
        getLessons(id)
      ]);
      setCourse(courseRes.data);
      setLessons(lessonsRes.data);

      if (user) {
        const enrollRes = await checkEnrollment(id);
        setEnrollment(enrollRes.data.enrollment);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleEnroll = async () => {
    if (!user) return navigate('/login');
    setEnrolling(true);
    try {
      if (course.price === 0) {
        await enrollFree(id);
        setEnrollment({ courseId: id });
        alert('Enrolled successfully!');
      } else {
        const orderRes = await createOrder({ courseId: id });
        const { orderId, amount, currency } = orderRes.data;

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY,
          amount,
          currency,
          name: 'EduLearn',
          description: course.title,
          order_id: orderId,
          handler: async (response) => {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              courseId: id,
              amount: course.price
            });
            setEnrollment({ courseId: id });
            alert('Payment successful! Enrolled!');
          },
          prefill: { name: user.name, email: user.email },
          theme: { color: '#6C63FF' }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      alert('Enrollment failed!');
    }
    setEnrolling(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );

  if (!course) return <div>Course not found!</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div style={{ backgroundColor: '#0A1628' }} className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs text-white/40 mb-4">
            Courses → {course.category} → {course.title}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex gap-2 mb-4">
                <span className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(108,99,255,0.2)', color: '#A5B4FC' }}>
                  {course.category}
                </span>
                <span className="text-xs font-medium px-3 py-1 rounded-full capitalize"
                  style={{ backgroundColor: 'rgba(249,115,22,0.2)', color: '#FED7AA' }}>
                  {course.level}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">{course.title}</h1>
              <p className="text-white/60 text-lg mb-6">{course.description}</p>
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-1">
                  <Star size={16} fill="#F97316" color="#F97316" />
                  <span className="text-white font-medium">{course.rating || '4.8'}</span>
                  <span className="text-white/40 text-sm">({course.totalReviews} ratings)</span>
                </div>
                <div className="flex items-center gap-1 text-white/40">
                  <Users size={15} />
                  <span className="text-sm">{course.totalStudents} students</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: '#6C63FF' }}>
                  {course.instructor?.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-white/40 text-xs">Created by</p>
                  <p className="text-white font-medium">{course.instructor?.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* What you'll learn */}
            {course.whatYouLearn?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">What you'll learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.whatYouLearn.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: '#EDE9FE' }}>
                        <Check size={11} color="#6C63FF" />
                      </div>
                      <span className="text-sm text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Course Curriculum</h2>
              <p className="text-gray-400 text-sm mb-6">{lessons.length} lessons</p>
              <div className="space-y-2">
                {lessons.map((lesson, i) => (
                  <div key={lesson._id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition ${
                      enrollment ? 'border-gray-100 hover:bg-gray-50 cursor-pointer' : 'border-gray-100'
                    }`}
                    onClick={() => enrollment && navigate(`/learn/${id}/${lesson._id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: lesson.isFree || enrollment ? '#EDE9FE' : '#F3F4F6' }}>
                        {lesson.isFree || enrollment
                          ? <Play size={14} color="#6C63FF" />
                          : <Lock size={14} color="#9CA3AF" />
                        }
                      </div>
                      <span className="text-sm text-gray-700">{lesson.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {lesson.isFree && !enrollment && (
                        <span className="text-xs px-2 py-1 rounded-full"
                          style={{ backgroundColor: '#EDE9FE', color: '#6C63FF' }}>
                          Free
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{lesson.duration} min</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24 shadow-lg">
              <div className="h-44 rounded-xl flex items-center justify-center text-6xl mb-6"
                style={{ backgroundColor: '#EDE9FE' }}>
                📚
              </div>

              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  {course.price === 0 ? 'FREE' : `₹${course.price}`}
                </span>
                {course.price > 0 && (
                  <span className="text-gray-400 line-through text-lg">₹{course.price * 5}</span>
                )}
              </div>

              {course.price > 0 && (
                <p className="text-green-600 text-sm font-medium mb-4">
                  80% off — Limited time offer!
                </p>
              )}

              {enrollment ? (
                <button
                  onClick={() => lessons[0] && navigate(`/learn/${id}/${lessons[0]._id}`)}
                  className="w-full py-4 rounded-xl text-white font-medium text-lg transition hover:opacity-90 mb-4"
                  style={{ backgroundColor: '#14B8A6' }}
                >
                  Continue Learning →
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full py-4 rounded-xl text-white font-medium text-lg transition hover:opacity-90 mb-4 disabled:opacity-60"
                  style={{ backgroundColor: '#6C63FF' }}
                >
                  {enrolling ? 'Processing...' : course.price === 0 ? 'Enroll for Free' : 'Enroll Now'}
                </button>
              )}

              <p className="text-center text-gray-400 text-xs mb-6">
                30-day money-back guarantee
              </p>

              <div className="space-y-3 border-t border-gray-100 pt-4">
                {[
                  { icon: <Clock size={15} />, text: `${lessons.length} video lessons` },
                  { icon: <Award size={15} />, text: 'Certificate of completion' },
                  { icon: <Users size={15} />, text: 'Lifetime access' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-500 text-sm">
                    {item.icon}
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;