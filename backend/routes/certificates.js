const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const auth = require('../middleware/auth');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// Generate certificate
router.get('/generate/:courseId', auth, async (req, res) => {
  try {
    // Check enrollment + completion
    const enrollment = await Enrollment.findOne({
      userId: req.user.id,
      courseId: req.params.courseId
    });

    if (!enrollment) {
      return res.status(404).json({ error: 'Not enrolled in this course!' });
    }

    if (!enrollment.isCompleted && enrollment.progress < 100) {
      return res.status(400).json({ error: 'Course not completed yet!' });
    }

    const course = await Course.findById(req.params.courseId)
      .populate('instructor', 'name');
    const user = await User.findById(req.user.id);

    if (!course || !user) {
      return res.status(404).json({ error: 'Course or user not found!' });
    }

    // Create PDF
    const doc = new PDFDocument({
      size: [842, 595], // A4 Landscape
      margin: 0
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${course._id}.pdf`);
    doc.pipe(res);

    // Background
    doc.rect(0, 0, 842, 595).fill('#0A1628');

    // Purple border
    doc.rect(20, 20, 802, 555)
      .lineWidth(3)
      .stroke('#6C63FF');

    // Inner border
    doc.rect(30, 30, 782, 535)
      .lineWidth(1)
      .stroke('rgba(108,99,255,0.3)');

    // Top decoration line
    doc.rect(30, 30, 782, 4).fill('#6C63FF');
    doc.rect(30, 591, 782, 4).fill('#F97316');

    // EduLearn Logo text
    doc.fontSize(28)
      .fillColor('#6C63FF')
      .font('Helvetica-Bold')
      .text('EduLearn', 50, 60);

    doc.fontSize(11)
      .fillColor('rgba(255,255,255,0.4)')
      .font('Helvetica')
      .text('AI-Powered Learning Platform', 50, 95);

    // Certificate of Completion
    doc.fontSize(13)
      .fillColor('rgba(255,255,255,0.5)')
      .font('Helvetica')
      .text('CERTIFICATE OF COMPLETION', 0, 140, { align: 'center' });

    // Decorative line
    doc.moveTo(271, 165)
      .lineTo(571, 165)
      .lineWidth(1)
      .stroke('#6C63FF');

    // "This is to certify that"
    doc.fontSize(14)
      .fillColor('rgba(255,255,255,0.6)')
      .font('Helvetica')
      .text('This is to certify that', 0, 185, { align: 'center' });

    // Student Name
    doc.fontSize(42)
      .fillColor('#FFFFFF')
      .font('Helvetica-Bold')
      .text(user.name, 0, 215, { align: 'center' });

    // Underline
    const nameWidth = doc.widthOfString(user.name, { fontSize: 42 });
    const nameX = (842 - nameWidth) / 2;
    doc.moveTo(nameX, 265)
      .lineTo(nameX + nameWidth, 265)
      .lineWidth(1)
      .stroke('rgba(255,255,255,0.2)');

    // "has successfully completed"
    doc.fontSize(14)
      .fillColor('rgba(255,255,255,0.6)')
      .font('Helvetica')
      .text('has successfully completed the course', 0, 285, { align: 'center' });

    // Course Name
    doc.fontSize(26)
      .fillColor('#6C63FF')
      .font('Helvetica-Bold')
      .text(course.title, 60, 315, { align: 'center', width: 722 });

    // Instructor
    doc.fontSize(13)
      .fillColor('rgba(255,255,255,0.5)')
      .font('Helvetica')
      .text(`Instructor: ${course.instructor?.name || 'EduLearn'}`, 0, 375, { align: 'center' });

    // Date
    const completionDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    doc.fontSize(12)
      .fillColor('rgba(255,255,255,0.4)')
      .text(`Completed on: ${completionDate}`, 0, 400, { align: 'center' });

    // Certificate ID
    const certId = `CERT-${user._id.toString().slice(-6).toUpperCase()}-${course._id.toString().slice(-6).toUpperCase()}`;
    doc.fontSize(10)
      .fillColor('rgba(255,255,255,0.3)')
      .text(`Certificate ID: ${certId}`, 0, 425, { align: 'center' });

    // Bottom divider
    doc.moveTo(50, 460)
      .lineTo(792, 460)
      .lineWidth(1)
      .stroke('rgba(255,255,255,0.1)');

    // Bottom left — Signature area
    doc.fontSize(11)
      .fillColor('rgba(255,255,255,0.6)')
      .font('Helvetica-Bold')
      .text('Kushwanth Kumar Bevara', 80, 490);

    doc.fontSize(10)
      .fillColor('rgba(255,255,255,0.3)')
      .font('Helvetica')
      .text('Founder, EduLearn', 80, 508);

    doc.moveTo(80, 485)
      .lineTo(280, 485)
      .lineWidth(1)
      .stroke('rgba(255,255,255,0.2)');

    // Bottom right — Badge
    doc.circle(720, 500, 45)
      .lineWidth(2)
      .stroke('#6C63FF');

    doc.circle(720, 500, 38)
      .lineWidth(1)
      .stroke('rgba(108,99,255,0.4)');

    doc.fontSize(9)
      .fillColor('#6C63FF')
      .font('Helvetica-Bold')
      .text('CERTIFIED', 695, 485, { align: 'center', width: 50 });

    doc.fontSize(8)
      .fillColor('rgba(255,255,255,0.4)')
      .font('Helvetica')
      .text('EduLearn', 695, 500, { align: 'center', width: 50 });

    doc.fontSize(8)
      .fillColor('rgba(255,255,255,0.3)')
      .text('2026', 695, 512, { align: 'center', width: 50 });

    // Bottom orange accent
    doc.rect(30, 558, 782, 2).fill('#F97316');

    doc.end();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;