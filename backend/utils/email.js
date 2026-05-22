const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Enrollment confirmation email
const sendEnrollmentEmail = async (userEmail, userName, courseName) => {
  try {
    await transporter.sendMail({
      from: `"EduLearn" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `🎓 You're enrolled in ${courseName}!`,
      html: `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          
          <!-- Header -->
          <div style="background: #0A1628; padding: 32px 40px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #6C63FF; margin: 0; font-size: 28px;">EduLearn</h1>
            <p style="color: rgba(255,255,255,0.5); margin: 8px 0 0; font-size: 14px;">AI-Powered Learning Platform</p>
          </div>

          <!-- Body -->
          <div style="padding: 40px; background: #F8FAFC;">
            <h2 style="color: #1E293B; font-size: 24px; margin: 0 0 16px;">
              🎉 Enrollment Confirmed!
            </h2>
            <p style="color: #64748B; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
              Hi <strong>${userName}</strong>, you have successfully enrolled in:
            </p>

            <!-- Course Card -->
            <div style="background: white; border-radius: 12px; padding: 24px; border-left: 4px solid #6C63FF; margin: 0 0 24px;">
              <h3 style="color: #1E293B; margin: 0 0 8px; font-size: 20px;">${courseName}</h3>
              <p style="color: #6C63FF; margin: 0; font-size: 14px;">✓ Lifetime access</p>
              <p style="color: #6C63FF; margin: 4px 0 0; font-size: 14px;">✓ AI-generated quizzes</p>
              <p style="color: #6C63FF; margin: 4px 0 0; font-size: 14px;">✓ Certificate on completion</p>
            </div>

            <!-- CTA Button -->
            <a href="${process.env.FRONTEND_URL}/dashboard" 
               style="display: inline-block; background: #6C63FF; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
              Start Learning →
            </a>

            <p style="color: #94A3B8; font-size: 14px; margin: 24px 0 0;">
              Happy learning! 🚀<br/>
              <strong>Team EduLearn</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #0A1628; padding: 20px 40px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="color: rgba(255,255,255,0.3); font-size: 12px; margin: 0;">
              © 2026 EduLearn · Built by Kushwanth Kumar Bevara
            </p>
          </div>
        </div>
      `
    });
    console.log('Enrollment email sent!');
  } catch (err) {
    console.log('Email error:', err.message);
  }
};

// Welcome email
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    await transporter.sendMail({
      from: `"EduLearn" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `👋 Welcome to EduLearn, ${userName}!`,
      html: `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0A1628; padding: 32px 40px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #6C63FF; margin: 0;">EduLearn</h1>
          </div>
          <div style="padding: 40px; background: #F8FAFC;">
            <h2 style="color: #1E293B;">Welcome, ${userName}! 🎓</h2>
            <p style="color: #64748B; line-height: 1.6;">
              You have successfully joined EduLearn — the AI-powered learning platform.
              Start exploring 500+ courses today!
            </p>
            <a href="${process.env.FRONTEND_URL}/courses"
               style="display: inline-block; background: #6C63FF; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Browse Courses →
            </a>
          </div>
          <div style="background: #0A1628; padding: 20px 40px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="color: rgba(255,255,255,0.3); font-size: 12px; margin: 0;">© 2026 EduLearn</p>
          </div>
        </div>
      `
    });
    console.log('Welcome email sent!');
  } catch (err) {
    console.log('Email error:', err.message);
  }
};

module.exports = { sendEnrollmentEmail, sendWelcomeEmail };