import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, User } from 'lucide-react';
import { getReviews, addReview } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ReviewSection = ({ courseId, enrollment }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const fetchReviews = async () => {
    try {
      const res = await getReviews(courseId);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return setError('Please select a rating!');
    setSubmitting(true);
    setError('');
    try {
      const res = await addReview(courseId, { rating, comment });
      setReviews([res.data.review, ...reviews]);
      setRating(0);
      setComment('');
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Error submitting review!');
    }
    setSubmitting(false);
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percent: reviews.length > 0
      ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100)
      : 0
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Student Reviews</h2>
        {user && enrollment && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition hover:opacity-90"
            style={{ backgroundColor: '#6C63FF' }}
          >
            <Star size={15} />
            Write Review
          </button>
        )}
      </div>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className="flex gap-8 mb-8 p-5 rounded-2xl" style={{ backgroundColor: '#F8FAFC' }}>
          <div className="text-center">
            <p className="text-6xl font-bold text-gray-900">{avgRating}</p>
            <div className="flex justify-center gap-0.5 my-2">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={16}
                  fill={s <= Math.round(avgRating) ? '#F97316' : 'none'}
                  color={s <= Math.round(avgRating) ? '#F97316' : '#D1D5DB'}
                />
              ))}
            </div>
            <p className="text-gray-400 text-sm">{reviews.length} reviews</p>
          </div>
          <div className="flex-1 space-y-2">
            {ratingCounts.map(({ star, count, percent }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-3">{star}</span>
                <Star size={12} fill="#F97316" color="#F97316" />
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${percent}%`, backgroundColor: '#F97316' }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-8">{percent}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-5 rounded-2xl border-2 border-dashed"
          style={{ borderColor: '#6C63FF', backgroundColor: '#FAFAFA' }}
        >
          <h3 className="font-bold text-gray-900 mb-4">Write Your Review</h3>

          {error && (
            <div className="mb-3 p-3 rounded-xl bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Star Rating */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Your Rating</p>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition"
                  >
                    <Star
                      size={32}
                      fill={s <= (hoverRating || rating) ? '#F97316' : 'none'}
                      color={s <= (hoverRating || rating) ? '#F97316' : '#D1D5DB'}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-gray-500 self-center">
                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Your Review</p>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 resize-none"
                placeholder="Share your experience with this course..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 rounded-xl text-white font-medium transition hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: '#6C63FF' }}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-4">
          {[1,2].map(i => (
            <div key={i} className="animate-pulse">
              <div className="flex gap-3 mb-2">
                <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-100 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8">
          <Star size={40} className="mx-auto mb-3 text-gray-200" />
          <p className="text-gray-400">No reviews yet!</p>
          <p className="text-gray-300 text-sm mt-1">Be the first to review this course</p>
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map((review, i) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 pb-5 border-b border-gray-50 last:border-0"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0"
                style={{ backgroundColor: '#6C63FF' }}>
                {review.userId?.name?.charAt(0) || <User size={16} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-800 text-sm">{review.userId?.name || 'Student'}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={13}
                      fill={s <= review.rating ? '#F97316' : 'none'}
                      color={s <= review.rating ? '#F97316' : '#D1D5DB'}
                    />
                  ))}
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;