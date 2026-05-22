const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendEnrollmentEmail } = require('../utils/email');

// Enroll in free course
router.post('/enroll/:courseId', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const existing = await Enrollment.findOne({
      userId: req.user.id,
      courseId: req.params.courseId
    });
    if (existing) return res.status(400).json({ error: 'Already enrolled!' });

    if (course.price > 0) {
      return res.status(400).json({ error: 'This is a paid course. Please use payment route.' });
    }

    const enrollment = new Enrollment({
      userId: req.user.id,
      courseId: req.params.courseId
    });
    await enrollment.save();

    // Send enrollment email
    sendEnrollmentEmail(req.user.email, req.user.name || 'Student', course.title);

    // Update course student count
    await Course.findByIdAndUpdate(req.params.courseId, {
      $inc: { totalStudents: 1 }
    });

    // Add to user enrolled courses
    await User.findByIdAndUpdate(req.user.id, {
      $push: { enrolledCourses: req.params.courseId }
    });

    res.status(201).json({ message: 'Enrolled successfully!', enrollment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get my enrollments
router.get('/my-courses', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.id })
      .populate({
        path: 'courseId',
        populate: { path: 'instructor', select: 'name avatar' }
      })
      .sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check enrollment
router.get('/check/:courseId', auth, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      userId: req.user.id,
      courseId: req.params.courseId
    });
    res.json({ isEnrolled: !!enrollment, enrollment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update progress
router.patch('/progress/:courseId', auth, async (req, res) => {
  try {
    const { lessonId } = req.body;

    const enrollment = await Enrollment.findOne({
      userId: req.user.id,
      courseId: req.params.courseId
    });

    if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    const course = await Course.findById(req.params.courseId).populate('lessons');
    const totalLessons = course.lessons.length;
    const completedCount = enrollment.completedLessons.length;
    enrollment.progress = Math.round((completedCount / totalLessons) * 100);

    if (enrollment.progress === 100) {
      enrollment.isCompleted = true;
    }

    await enrollment.save();
    res.json({ message: 'Progress updated!', enrollment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;