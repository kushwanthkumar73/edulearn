const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendEnrollmentEmail } = require('../utils/email');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const order = await razorpay.orders.create({
      amount: course.price * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      courseName: course.title,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify payment
router.post('/verify', auth, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, courseId } = req.body;

    const sign = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest('hex');

    if (razorpaySignature !== expectedSign) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Save payment
    await Payment.create({
      userId: req.user.id,
      courseId,
      amount: req.body.amount,
      razorpayOrderId,
      razorpayPaymentId,
      status: 'success'
    });

    // Create enrollment
    const existing = await Enrollment.findOne({ userId: req.user.id, courseId });
    if (!existing) {
      await Enrollment.create({ userId: req.user.id, courseId });
      await Course.findByIdAndUpdate(courseId, { $inc: { totalStudents: 1 } });
      await User.findByIdAndUpdate(req.user.id, { $push: { enrolledCourses: courseId } });
    }
    const courseData = await Course.findById(courseId);
    await sendEnrollmentEmail(req.user.email, req.user.name || 'Student', courseData.title);
    res.json({ message: 'Payment successful! Enrolled in course.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;