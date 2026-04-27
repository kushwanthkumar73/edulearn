const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');
const auth = require('../middleware/auth');
const authorize = require('../middleware/roles');

// Get platform stats
router.get('/stats', auth, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    const payments = await Payment.find({ status: 'success' });
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    res.json({ totalUsers, totalCourses, totalEnrollments, totalRevenue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users
router.get('/users', auth, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve instructor
router.patch('/approve/:userId', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isApproved: true },
      { new: true }
    ).select('-password');
    res.json({ message: 'Instructor approved!', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all courses (admin)
router.get('/courses', auth, authorize('admin'), async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user
router.delete('/users/:userId', auth, authorize('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: 'User deleted!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;