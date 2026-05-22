# 🎓 EduLearn — AI-Powered E-Learning Platform

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Groq AI](https://img.shields.io/badge/Groq_AI-LLaMA_3.3-F97316?style=for-the-badge)

A full-stack e-learning platform with 3 user roles, AI-powered quizzes, Razorpay payments, and Cloudinary video streaming.

Live Demo: https://edulearn.vercel.app
GitHub: https://github.com/KushwanthKumarBevara/edulearn

---

## 🎯 About

EduLearn is a complete Udemy-like platform where students can browse and learn, instructors can create and teach, and admins manage everything. Built with Node.js backend, MongoDB database, and Groq AI integration.

---

## ✨ Features

### For Students
- Browse and search courses with filters (category, level, price)
- Enroll in free courses or pay via Razorpay payment gateway
- Watch video lessons with progress tracking
- Take AI-generated MCQ quizzes after each lesson (Groq LLaMA 3.3)
- Get AI course recommendations based on learning history
- Rate and review courses with star ratings
- Track progress with completion percentage
- Personal dashboard with enrolled courses and stats

### For Instructors
- Create courses with title, description, category, price, learning outcomes
- Upload video lessons via Cloudinary video streaming
- Manage lesson curriculum
- Publish/unpublish courses anytime
- Track student enrollments and revenue with Recharts
- AI generates course descriptions from outline

### For Admins
- Platform overview dashboard with stats
- Approve/reject instructor applications
- Manage all users and courses
- Revenue analytics with charts

---

## 🛠️ Tech Stack

### Frontend
- React.js — Component-based UI
- Tailwind CSS — Utility-first styling
- Framer Motion — Smooth animations
- Lucide React — 1000+ consistent icons
- Inter Font (Google Fonts) — Professional typography
- Recharts — Analytics dashboards
- React Router — Client-side routing
- Axios — API calls with JWT interceptors

### Backend
- Node.js + Express — REST API server
- MongoDB + Mongoose — NoSQL database
- JWT — Role-based authentication (student/instructor/admin)
- bcryptjs — Password hashing
- Groq API (LLaMA 3.3 70B) — AI quiz + recommendations
- Razorpay — Payment gateway
- Cloudinary — Video/image storage + streaming
- PDFKit — Certificate generation
- Nodemailer — Email notifications

### Deployment
- Vercel — Frontend hosting
- Render — Backend hosting
- MongoDB Atlas — Cloud database

---

## 👥 User Roles

STUDENT
- Browse, Enroll, Watch, AI Quiz, Reviews, Certificate

INSTRUCTOR
- Create Courses, Upload Videos, Track Revenue, Manage Lessons

ADMIN
- Manage All, Approve Instructors, Platform Analytics

---

## 🗄️ Database Schema

users       → id, name, email, password, role, avatar, isApproved
courses     → id, title, instructor, category, price, lessons[], rating
lessons     → id, courseId, title, videoUrl, duration, order, isFree
enrollments → id, userId, courseId, progress, completedLessons[], isCompleted
reviews     → id, userId, courseId, rating, comment
payments    → id, userId, courseId, amount, razorpayId, status

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free)
- Cloudinary account (free)
- Razorpay account (test mode)
- Groq API key (free at console.groq.com)

### Backend Setup

git clone https://github.com/KushwanthKumarBevara/edulearn.git
cd edulearn/backend
npm install

Create .env file:
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/edulearn
JWT_SECRET=your-jwt-secret
GROQ_API_KEY=gsk_your-groq-key
RAZORPAY_KEY_ID=rzp_test_your-key
RAZORPAY_SECRET=your-razorpay-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:3000

npm run dev

### Frontend Setup

cd ../frontend
npm install

Create .env file:
REACT_APP_API_URL=http://localhost:5000
REACT_APP_RAZORPAY_KEY=rzp_test_your-key

npm start

### Demo Accounts
Student:     kushwanth2001@gmail.com / test1234
Instructor:  rahul@gmail.com / test1234
Admin:       admin@edulearn.com / admin1234

---

## 📡 API Endpoints

Authentication
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
PATCH  /api/auth/profile

Courses
GET    /api/courses
GET    /api/courses/:id
POST   /api/courses
PATCH  /api/courses/:id
PATCH  /api/courses/:id/publish
DELETE /api/courses/:id
GET    /api/courses/instructor/my-courses

Enrollments
POST   /api/enrollments/enroll/:courseId
GET    /api/enrollments/my-courses
GET    /api/enrollments/check/:courseId
PATCH  /api/enrollments/progress/:courseId

Payments
POST   /api/payments/create-order
POST   /api/payments/verify

AI
POST   /api/ai/generate-quiz
POST   /api/ai/recommendations

Admin
GET    /api/admin/stats
GET    /api/admin/users
PATCH  /api/admin/approve/:userId
GET    /api/admin/courses

---

## 🤖 AI Features

Quiz Generation:
Lesson content sent to Groq LLaMA 3.3 70B
Returns MCQ questions with 4 options + correct answer
Saved to MongoDB, shown after lesson completion

Course Recommendations:
Based on enrolled categories + interests
AI suggests next courses to learn
Displayed in student dashboard

---

## 💡 Key Technical Decisions

MongoDB over PostgreSQL — Flexible schema for courses fits naturally in documents
Node.js over Django — First project used Django — shows multi-stack capability
Groq API over OpenAI — Free tier, LLaMA 3.3 70B quality comparable to GPT-4
JWT Role-based Auth — 3 roles with different permissions per route
Razorpay over Stripe — Best payment gateway in India, free test mode
Inter Font — Used by Vercel, Notion, Linear — most professional screen font
Framer Motion — Industry standard React animations

---

## 📁 Project Structure

edulearn/
├── backend/
│   ├── models/      User, Course, Lesson, Enrollment, Review, Payment
│   ├── routes/      auth, courses, lessons, enrollments, payments, ai, admin
│   ├── middleware/  auth.js, roles.js
│   ├── utils/       cloudinary.js, email.js
│   └── server.js
└── frontend/
    └── src/
        ├── pages/       HomePage, CoursesPage, CourseDetailPage, PlayerPage
        │                StudentDashboard, InstructorDashboard, AdminDashboard
        │                CreateCoursePage, AddLessonPage, LoginPage, RegisterPage
        ├── components/  Navbar, ReviewSection
        ├── context/     AuthContext
        └── utils/       api.js

---

## 👨‍💻 Author

Kushwanth Kumar Bevara
Email: kushwanth2001@gmail.com
LinkedIn: [linkedin.com/in/KushwanthKumar](https://www.linkedin.com/in/kushwanth-kumar-9b0710204/)
GitHub: [github.com/KushwanthKumarBevara](https://github.com/kushwanthkumar7)
Location: Visakhapatnam, India
Education: MCA @ Andhra University | GPA: 9.10

---

⭐ If this project helped you, please give it a star!
Built with ❤️ by Kushwanth Kumar Bevara
