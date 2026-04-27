const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

// Get reviews for a course
router.get('/:courseId', async (req, res) => {
  try {
    const reviews = await Review.find({ courseId: req.params.courseId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add review
router.post('/:courseId', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const existing = await Review.findOne({
      userId: req.user.id,
      courseId: req.params.courseId
    });
    if (existing) return res.status(400).json({ error: 'Already reviewed!' });

    const review = new Review({
      userId: req.user.id,
      courseId: req.params.courseId,
      rating, comment
    });
    await review.save();

    // Update course rating
    const reviews = await Review.find({ courseId: req.params.courseId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Course.findByIdAndUpdate(req.params.courseId, {
      rating: avgRating.toFixed(1),
      totalReviews: reviews.length
    });

    res.status(201).json({ message: 'Review added!', review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete review
router.delete('/:id', auth, async (req, res) => {
  try {
    await Review.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Review deleted!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;