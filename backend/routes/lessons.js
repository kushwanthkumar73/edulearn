const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const auth = require('../middleware/auth');
const authorize = require('../middleware/roles');

// Get all lessons for a course
router.get('/course/:courseId', async (req, res) => {
  try {
    const lessons = await Lesson.find({ courseId: req.params.courseId })
      .sort({ order: 1 });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single lesson
router.get('/:id', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create lesson
router.post('/', auth, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const { title, description, courseId, videoUrl, duration, order, isFree } = req.body;

    const lesson = new Lesson({
      title, description, courseId,
      videoUrl, duration, order, isFree
    });

    await lesson.save();

    // Add lesson to course
    await Course.findByIdAndUpdate(courseId, {
      $push: { lessons: lesson._id }
    });

    res.status(201).json({ message: 'Lesson created!', lesson });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update lesson
router.patch('/:id', auth, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    res.json({ message: 'Lesson updated!', lesson });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete lesson
router.delete('/:id', auth, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    // Remove from course
    await Course.findByIdAndUpdate(lesson.courseId, {
      $pull: { lessons: lesson._id }
    });

    await Lesson.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lesson deleted!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;