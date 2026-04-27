const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const auth = require('../middleware/auth');
const authorize = require('../middleware/roles');

// Get all published courses (with filter + search)
router.get('/', async (req, res) => {
  try {
    const { category, level, price, search, sort } = req.query;
    let query = { isPublished: true };

    if (category) query.category = category;
    if (level) query.level = level;
    if (price === 'free') query.price = 0;
    if (price === 'paid') query.price = { $gt: 0 };
    if (search) query.title = { $regex: search, $options: 'i' };

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { totalStudents: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };

    const courses = await Course.find(query)
      .populate('instructor', 'name avatar')
      .sort(sortOption);

    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar bio')
      .populate('lessons');
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create course (instructor only)
router.post('/', auth, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const {
      title, description, category,
      price, level, thumbnail,
      requirements, whatYouLearn
    } = req.body;

    const course = new Course({
      title, description, category,
      price, level, thumbnail,
      requirements, whatYouLearn,
      instructor: req.user.id
    });

    await course.save();
    res.status(201).json({ message: 'Course created!', course });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update course
router.patch('/:id', auth, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, instructor: req.user.id },
      req.body,
      { new: true }
    );
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Course updated!', course });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Publish/Unpublish course
router.patch('/:id/publish', auth, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    course.isPublished = !course.isPublished;
    await course.save();
    res.json({ message: `Course ${course.isPublished ? 'published' : 'unpublished'}!`, course });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete course
router.delete('/:id', auth, authorize('instructor', 'admin'), async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get instructor's courses
router.get('/instructor/my-courses', auth, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .populate('lessons')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;